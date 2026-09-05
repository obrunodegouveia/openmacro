import { Section, SectionHeading } from "@/components/ui/section";
import { TAccountPuzzle } from "@/components/site/t-account-puzzle";
import { QE_SCENARIO } from "@/lib/scenarios";

/** The playable teaser, framed the way it is framed inside a lesson. */
export function Demo() {
  return (
    <Section id="demo" className="scroll-mt-20">
      <SectionHeading
        overline="Playable teaser"
        title={
          <>
            Don&rsquo;t read about QE.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">Post the entries.</span>
          </>
        }
        lede="This is a real lesson step: place each entry on the right sheet and the right side, then find out what actually moved. No sign-up, no download."
      />

      <div className="mt-12">
        <TAccountPuzzle scenario={QE_SCENARIO} />
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-ink-faint">
        Simplified in one respect: the dealer&rsquo;s own sheet is left off screen to
        keep two T-accounts on a phone. In the app the dealer appears as a third
        entity, and the same operation is replayed with randomised counterparties
        and amounts so the answer cannot be memorised.
      </p>
    </Section>
  );
}
