"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ChevronRight, Lock } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { SYLLABUS, TIERS, type Track, TRACK_COUNT_LABEL } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

/**
 * The learning path, drawn as the app draws it: a track of module nodes joined
 * by a filling connector. Selecting a node reveals what it teaches, so the
 * whole curriculum fits on one screen without a wall of text.
 */

const STATUS_LABEL: Record<Track["status"], string> = {
  live: "Live in beta",
  beta: "In testing",
  drafting: "Being written",
  planned: "Planned",
};

const STATUS_TONE: Record<Track["status"], BadgeTone> = {
  live: "mint",
  beta: "azure",
  drafting: "gold",
  planned: "neutral",
};

const ACCENT_RING: Record<Track["accent"], string> = {
  emerald: "border-mint/60 bg-mint/15 shadow-mint/25",
  gold: "border-gold/60 bg-gold/15 shadow-gold/25",
  azure: "border-azure/60 bg-azure/15 shadow-azure/25",
  violet: "border-violet/60 bg-violet/15 shadow-violet/25",
  mint: "border-mint/60 bg-mint/15 shadow-mint/25",
  coral: "border-coral/60 bg-coral/15 shadow-coral/25",
};

export function Roadmap() {
  const [activeId, setActiveId] = React.useState(SYLLABUS[2]?.id ?? SYLLABUS[0]!.id);
  const active = SYLLABUS.find((track) => track.id === activeId) ?? SYLLABUS[0]!;

  return (
    <Section id="curriculum">
      <SectionHeading
        overline="Syllabus"
        title={
          <>
            {TRACK_COUNT_LABEL} tracks, from <span className="text-gradient">tax liabilities</span>{" "}
            to <span className="text-gradient">swap lines</span>.
          </>
        }
        lede="Each track builds the mechanism the next one depends on, and every one of them ends in a balance sheet you post yourself."
      />

      {/* Track ---------------------------------------------------------- */}
      <div className="mt-14">
        <ol className="relative grid gap-4 md:grid-cols-4">
          {/* Connector rail, behind the nodes, desktop only. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-1 rounded-full bg-hairline md:block"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "58%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-gold via-mint to-azure"
            />
          </div>

          {SYLLABUS.map((track, index) => {
            const selected = track.id === active.id;
            return (
              <li key={track.id} className="relative">
                <motion.button
                  type="button"
                  onClick={() => setActiveId(track.id)}
                  aria-pressed={selected}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "group flex w-full flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-colors",
                    selected
                      ? "border-mint/40 bg-mint/[0.08]"
                      : "border-transparent hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-[4.5rem] place-items-center rounded-full border-4 text-2xl shadow-lg transition-transform",
                      ACCENT_RING[track.accent],
                      selected && "scale-105",
                    )}
                  >
                    {track.icon}
                  </span>
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-faint">
                    Track {track.index}
                  </span>
                  <span className="font-display text-sm font-extrabold leading-snug text-ink">
                    {track.title}
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ol>

        {/* Detail panel -------------------------------------------------- */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="glass mt-8 rounded-card p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={STATUS_TONE[active.status]}>
              {active.status === "planned" ? (
                <Lock className="size-3" aria-hidden />
              ) : null}
              {STATUS_LABEL[active.status]}
            </Badge>
            <span className="text-xs font-semibold text-ink-faint">
              {active.lessonCount} lessons
            </span>
            <span className="text-xs font-semibold text-ink-faint">
              Operates on{" "}
              {active.tiers
                .map((tierId) => {
                  const tier = TIERS.find((candidate) => candidate.id === tierId);
                  return tier ? `Tier ${tier.index}` : tierId;
                })
                .join(" & ")}
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
            {active.title}
          </h3>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-ink-muted">
            {active.promise}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {active.concepts.map((concept) => (
              <li
                key={concept}
                className="flex items-center gap-1.5 rounded-lg border border-hairline bg-abyss/60 px-3 py-1.5 text-xs font-bold text-ink-muted"
              >
                <ChevronRight className="size-3 text-mint" aria-hidden />
                {concept}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
