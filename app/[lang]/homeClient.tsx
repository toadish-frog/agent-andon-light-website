"use client";

import Link from "next/link";

import { AuroraGlow } from "@/app/components/ui/auroraGlow";
import { LiveStatusStrip } from "@/app/components/ui/liveStatusStrip";
import { Reveal } from "@/app/components/ui/reveal";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n";

type StateKey = "working" | "waiting" | "idle" | "compacting";

// Literal Tailwind class names (not template-built) so the compiler's static scan picks them up.
const STATE_DOT_CLASS: Record<StateKey, string> = {
  working: "bg-status-working",
  waiting: "bg-status-waiting",
  idle: "bg-status-idle",
  compacting: "bg-status-working",
};

const STATE_ORDER: StateKey[] = ["working", "waiting", "idle", "compacting"];

export function HomeClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["home"];
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-8 overflow-hidden px-6 py-32 text-center">
        <AuroraGlow />
        <p className="font-mono text-sm text-neutral-500">{dict.eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {dict.title}
        </h1>
        <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          {dict.subtitle}
        </p>

        <LiveStatusStrip
          ariaLabel={dict.stripAriaLabel}
          labels={{
            working: dict.states.working.label,
            waiting: dict.states.waiting.label,
            idle: dict.states.idle.label,
            compacting: dict.states.compacting.label,
          }}
        />

        <div className="flex gap-4">
          <Link
            href={`/${locale}/product/`}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {dict.ctaProduct}
          </Link>
          <Link
            href={`/${locale}/docs/`}
            className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium dark:border-white/20"
          >
            {dict.ctaDocs}
          </Link>
        </div>
      </section>

      {/* What it is */}
      <Reveal className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.whatItIs.heading}
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          {dict.whatItIs.body}
        </p>
      </Reveal>

      {/* Why it exists */}
      <Reveal className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.whyItExists.heading}
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          {dict.whyItExists.body}
        </p>
      </Reveal>

      {/* Four states */}
      <Reveal className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.states.heading}
        </h2>
        <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATE_ORDER.map((state) => (
            <div
              key={state}
              className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATE_DOT_CLASS[state]}`} />
                <dt className="font-mono text-sm font-medium">
                  {dict.states[state].label}
                </dt>
              </div>
              <dd className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {dict.states[state].description}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Open hardware / honest positioning */}
      <Reveal className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.openHardware.heading}
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          {dict.openHardware.body}
        </p>
      </Reveal>

      {/* Closing CTA */}
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.closing.heading}
        </h2>
        <div className="flex gap-4">
          <Link
            href={`/${locale}/product/`}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {dict.ctaProduct}
          </Link>
          <Link
            href={`/${locale}/docs/`}
            className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium dark:border-white/20"
          >
            {dict.ctaDocs}
          </Link>
        </div>

        {/* Nav's link list is desktop-only (md:flex); this is the small-screen path to Resources. */}
        <Link
          href={`/${locale}/resources/`}
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium md:hidden dark:border-white/20"
        >
          {dict.ctaResources}
        </Link>
      </Reveal>
    </>
  );
}
