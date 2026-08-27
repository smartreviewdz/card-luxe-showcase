import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GoogleBadge } from "@/components/review/GoogleBadge";
import { RatingPicker } from "@/components/review/RatingPicker";
import { SocialBlock } from "@/components/review/SocialBlock";
import { Corners, Eyebrow, GoldStar, Reveal } from "@/components/review/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confiserie du Bonheur — Laissez votre avis Google" },
      {
        name: "description",
        content:
          "Partagez votre expérience à la Confiserie du Bonheur : notez votre visite et suivez-nous sur les réseaux. Une page d'avis premium signée Avify Stat.",
      },
      { property: "og:title", content: "Confiserie du Bonheur — Laissez votre avis Google" },
      {
        property: "og:description",
        content: "Notez votre expérience en un geste et restons connectés sur les réseaux.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});

function Particles() {
  const dots = [8, 20, 33, 47, 61, 74, 88];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((left, i) => (
        <span
          key={left}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-gold"
          style={{
            left: `${left}%`,
            animation: `avify-drift ${7 + (i % 4) * 2.5}s linear ${i * 1.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden pt-14 pb-24" style={{ backgroundImage: "var(--gradient-navy)" }}>
      <Particles />
      <span
        className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
        style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.08), transparent)" }}
      />

      <div className="relative px-6">
        <GoogleBadge />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <Eyebrow>Avis vérifié</Eyebrow>
          <h1 className="mt-4 text-center font-display text-3xl leading-tight font-semibold tracking-wide text-ivory uppercase">
            Laissez-nous votre avis sur Google
          </h1>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="gold-rule w-10" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4, rotate: -35 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.45 + i * 0.11, type: "spring", stiffness: 300, damping: 12 }}
            >
              <GoldStar className="animate-twinkle h-7 w-7" fill={1} />
            </motion.span>
          ))}
          <span className="gold-rule w-10" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[-1px]">
        <svg viewBox="0 0 390 70" preserveAspectRatio="none" className="block h-16 w-full">
          <path d="M0 44 C 90 4, 250 -6, 390 26 L390 70 L0 70 Z" fill="var(--gold)" opacity="0.9" />
          <path d="M0 50 C 90 10, 250 0, 390 32 L390 70 L0 70 Z" fill="var(--ivory)" />
        </svg>
      </div>
    </header>
  );
}

function BusinessBlock() {
  return (
    <section className="px-6 pt-8 pb-4">
      <Reveal className="flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-44 w-44"
        >
          <Corners />
          <div
            className="absolute inset-6 grid place-items-center rounded-[1.4rem] bg-ivory"
            style={{ boxShadow: "var(--shadow-soft-inset)" }}
          >
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-gold/70 bg-ivory">
              <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
                <circle cx="18" cy="20" r="2.4" fill="var(--ink)" />
                <circle cx="30" cy="20" r="2.4" fill="var(--ink)" />
                <path
                  d="M16 31 h16"
                  stroke="var(--ink)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <h2 className="mt-4 text-center font-display text-4xl font-bold text-navy">Confiserie du Bonheur</h2>
        <p className="mt-2 text-center font-sans text-sm text-ink-muted">
          Bonne nuit — Votre opinion compte pour nous.
        </p>
      </Reveal>
    </section>
  );
}

function RatingSection() {
  return (
    <section className="px-6 py-10">
      <Reveal>
        <h3 className="mx-auto max-w-xs text-center font-sans text-xl font-semibold text-navy">
          Comment avez-vous vécu votre expérience&nbsp;?
        </h3>
      </Reveal>
      <Reveal delay={0.12} className="mt-8">
        <RatingPicker />
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-12">
      <div className="gold-rule" />
      <Reveal className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <span className="gold-rule w-16" />
          <span className="h-2 w-2 rotate-45 bg-gold" />
          <span className="gold-rule w-16" />
        </div>
        <p className="silver-text mt-5 font-display text-4xl font-semibold tracking-[0.16em]">AVIFY STAT</p>
        <p className="mt-3 font-sans text-[0.62rem] tracking-[0.28em] text-ink-muted uppercase">
          Better feedback. Better businesses.
        </p>
      </Reveal>
    </footer>
  );
}

function ReviewPage() {
  return (
    <main className="min-h-screen bg-ivory font-sans antialiased">
      <Hero />
      <BusinessBlock />
      <RatingSection />
      <SocialBlock />
      <Footer />
    </main>
  );
}
