import { SITE } from "@/lib/site";

/** Community numbers rendered in the contributor hub. */
export interface RepoStats {
  stars: number;
  forks: number;
  openPullRequests: number;
  openIssues: number;
  contributors: number;
  /** False when the live call failed and the placeholders below are shown. */
  live: boolean;
}

/**
 * Placeholder figures used before the repository is public, and whenever the
 * GitHub API is unreachable or rate-limited. Rendering a stale-but-plausible
 * number is better than rendering a spinner that never resolves, and the
 * `live` flag lets the UI stay honest about which it is showing.
 */
const FALLBACK_STATS: RepoStats = {
  stars: 0,
  forks: 0,
  openPullRequests: 0,
  openIssues: 0,
  contributors: 0,
  live: false,
};

const GITHUB_API = "https://api.github.com";

/** Unauthenticated GitHub allows 60 req/h per IP; a token raises it to 5,000. */
function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "openmacro.org",
  };
  if (process.env.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return base;
}

/**
 * Reads public repository stats, cached for an hour.
 *
 * Called from a Server Component, so the token (if any) never reaches the
 * browser and every visitor in a given hour is served the same cached numbers
 * rather than each one burning a GitHub API call.
 */
export async function getRepoStats(): Promise<RepoStats> {
  const repo = SITE.githubRepo;

  try {
    const [repoRes, prRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/${repo}`, {
        headers: headers(),
        next: { revalidate: 3600 },
      }),
      // `is:pr is:open` via search returns the count without paging the list.
      fetch(
        `${GITHUB_API}/search/issues?q=${encodeURIComponent(`repo:${repo} is:pr is:open`)}&per_page=1`,
        { headers: headers(), next: { revalidate: 3600 } },
      ),
    ]);

    if (!repoRes.ok) return FALLBACK_STATS;

    const repoJson = (await repoRes.json()) as {
      stargazers_count?: number;
      forks_count?: number;
      open_issues_count?: number;
    };
    const prJson = prRes.ok
      ? ((await prRes.json()) as { total_count?: number })
      : { total_count: 0 };

    const openPullRequests = prJson.total_count ?? 0;
    // `open_issues_count` counts PRs too; subtract them back out.
    const openIssues = Math.max(
      (repoJson.open_issues_count ?? 0) - openPullRequests,
      0,
    );

    return {
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      openPullRequests,
      openIssues,
      contributors: await countContributors(repo),
      live: true,
    };
  } catch {
    // Never let a marketing page fail to render because GitHub is down.
    return FALLBACK_STATS;
  }
}

/**
 * Counts contributors by reading the `Link: ... rel="last"` header of a
 * one-per-page listing, which avoids downloading every contributor object.
 */
async function countContributors(repo: string): Promise<number> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${repo}/contributors?per_page=1&anon=true`,
      { headers: headers(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return 0;

    const link = res.headers.get("link");
    const lastPage = link?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];
    if (lastPage) return Number.parseInt(lastPage, 10);

    const body = (await res.json()) as unknown[];
    return Array.isArray(body) ? body.length : 0;
  } catch {
    return 0;
  }
}
