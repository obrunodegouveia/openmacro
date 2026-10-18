import { SeasonGreeting } from "@openmacro/seasons/web/provider";

/**
 * A page. Try `/?season=halloween`, `/?season=christmas:calm` or `/?season=none`.
 *
 * @return The page.
 */
export default function Home() {
  return (
    <main style={{ padding: "6rem 1.5rem", maxWidth: "40rem", margin: "0 auto" }}>
      <h1>My site</h1>
      <SeasonGreeting />
      <p>Whatever the site is about. The season dresses it; it never changes what it says.</p>
    </main>
  );
}
