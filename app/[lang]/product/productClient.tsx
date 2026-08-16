"use client";

import Image from "next/image";

import { AuroraGlow } from "@/app/components/ui/auroraGlow";
import { LiveStatusStrip } from "@/app/components/ui/liveStatusStrip";
import { ProductSectionNav } from "@/app/components/ui/productSectionNav";
import { Reveal } from "@/app/components/ui/reveal";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n";

const GITHUB_URL = "https://github.com/toadish-frog/agent-andon-light";

const headingClass = "text-2xl font-semibold tracking-tight sm:text-3xl";
const bodyClass = "mt-4 text-neutral-600 dark:text-neutral-400";

export function ProductClient({ dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.product;

  const sections = [
    { id: "overview", label: p.nav.overview },
    { id: "how-it-works", label: p.nav.howItWorks },
    { id: "reliability", label: p.nav.reliability },
    { id: "hooks", label: p.nav.hooks },
    { id: "open-source", label: p.nav.openSource },
  ];

  return (
    <>
      <ProductSectionNav sections={sections} />

      {/* Overview */}
      <section id="overview" className="relative scroll-mt-32 overflow-hidden px-6 py-24">
        <AuroraGlow />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <p className="font-mono text-sm text-neutral-500">{p.hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {p.hero.title}
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            {p.hero.subtitle}
          </p>
          <LiveStatusStrip
            ariaLabel={dict.home.stripAriaLabel}
            labels={{
              working: dict.home.states.working.label,
              waiting: dict.home.states.waiting.label,
              idle: dict.home.states.idle.label,
              compacting: dict.home.states.compacting.label,
            }}
          />
        </div>

        <Reveal className="mx-auto mt-20 max-w-5xl">
          <h2 className={`text-center ${headingClass}`}>{p.overview.heading}</h2>
          <p className={`mx-auto max-w-2xl text-center ${bodyClass}`}>
            {p.overview.body}
          </p>
          <Image
            src="/product-board.png"
            alt={p.overview.diagramAriaLabel}
            width={1920}
            height={1080}
            className="mt-10 h-auto w-full"
          />
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-32 px-6 py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className={headingClass}>{p.howItWorks.heading}</h2>
          <p className={bodyClass}>{p.howItWorks.body}</p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-2xl overflow-x-auto">
          <h3 className="text-center font-mono text-sm text-neutral-500">
            {p.howItWorks.protocolHeading}
          </h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="py-2 font-mono font-medium">
                  {p.howItWorks.commandLabel}
                </th>
                <th className="py-2 font-medium">{p.howItWorks.effectLabel}</th>
                <th className="py-2 font-medium">{p.howItWorks.meaningLabel}</th>
              </tr>
            </thead>
            <tbody>
              {p.howItWorks.commands.map((row) => (
                <tr
                  key={row.command}
                  className="border-b border-black/5 dark:border-white/5"
                >
                  <td className="py-2 font-mono">{row.command}</td>
                  <td className="py-2">{row.effect}</td>
                  <td className="py-2 text-neutral-600 dark:text-neutral-400">
                    {row.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* Reliability */}
      <section id="reliability" className="scroll-mt-32 px-6 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className={headingClass}>{p.reliability.heading}</h2>
          <p className={bodyClass}>{p.reliability.body}</p>
        </Reveal>
      </section>

      {/* Hooks */}
      <section id="hooks" className="scroll-mt-32 px-6 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className={headingClass}>{p.hooks.heading}</h2>
          <p className={bodyClass}>{p.hooks.body}</p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="py-2 font-medium">{p.hooks.eventLabel}</th>
                <th className="py-2 font-medium">{p.hooks.colorLabel}</th>
              </tr>
            </thead>
            <tbody>
              {p.hooks.hookRows.map((row) => (
                <tr
                  key={row.event}
                  className="border-b border-black/5 dark:border-white/5"
                >
                  <td className="py-2 font-mono text-xs">{row.event}</td>
                  <td className="py-2 text-neutral-600 dark:text-neutral-400">
                    {row.color}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* Open source */}
      <section id="open-source" className="scroll-mt-32 px-6 py-24">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className={headingClass}>{p.openSource.heading}</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{p.openSource.body}</p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {p.openSource.ctaLabel}
          </a>
        </Reveal>
      </section>

      {/* Fine print — placeholder pending source, see ARCH-prompt.md §2 */}
      <p className="mx-auto max-w-2xl px-6 pb-16 text-center text-xs text-neutral-400">
        {p.disclaimer}
      </p>
    </>
  );
}
