import { motion } from "motion/react";
import { Facebook, Globe, Instagram, Music2, Heart, Star, Zap } from "lucide-react";
import { Corners, Eyebrow, Reveal } from "./primitives";

const NETWORKS = [
  { icon: Instagram, label: "Instagram", caption: "Coulisses & nouveautés" },
  { icon: Facebook, label: "Facebook", caption: "Événements & avis" },
  { icon: Music2, label: "TikTok", caption: "Vidéos exclusives" },
];

function Circle({
  icon: Icon,
  label,
  caption,
  size = "md",
  delay = 0,
}: {
  icon: typeof Instagram;
  label: string;
  caption: string;
  size?: "md" | "lg";
  delay?: number;
}) {
  const dim = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  return (
    <Reveal delay={delay} className="flex flex-col items-center gap-2 text-center">
      <motion.div
        whileHover={{ y: -6, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        className={`group relative grid ${dim} place-items-center rounded-full`}
      >
        <span
          className="animate-spin-slow absolute inset-0 rounded-full opacity-80"
          style={{ background: "conic-gradient(var(--gold-deep), var(--gold-light), var(--navy-line), var(--gold))" }}
        />
        <span className="absolute inset-[2px] rounded-full bg-ivory" />
        <span
          className="absolute inset-[-14%] rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />
        <Icon className={`relative ${size === "lg" ? "h-8 w-8" : "h-6 w-6"} text-gold-deep`} strokeWidth={1.6} />
      </motion.div>
      <span className="font-sans text-[0.62rem] font-600 tracking-[0.24em] text-ivory uppercase">{label}</span>
      <span className="max-w-[7.5rem] font-sans text-[0.66rem] leading-snug text-ivory/45">{caption}</span>
    </Reveal>
  );
}

export function SocialBlock() {
  return (
    <section className="px-5 pb-16">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 py-10"
          style={{ backgroundImage: "var(--gradient-navy)", boxShadow: "var(--shadow-lift)" }}
        >
          <Corners />
          <span
            className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/4 w-1/4"
            style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.07), transparent)" }}
          />

          <Eyebrow>Restons connectés</Eyebrow>

          <h2 className="mt-4 text-center">
            <span className="block font-sans text-3xl font-500 text-ivory">Suivez-nous</span>
            <span className="gold-text block font-display text-3xl italic">sur les réseaux</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-center font-sans text-sm leading-relaxed text-ivory/55">
            Nouveautés, avis clients et actualités à suivre sur nos réseaux.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {NETWORKS.map((n, i) => (
              <Circle key={n.label} {...n} delay={0.08 * i} />
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <Circle icon={Globe} label="Site web" caption="Notre site officiel" size="lg" delay={0.24} />
          </div>

          <div className="mt-9 gold-rule" />
          <div className="mt-4 flex justify-between font-sans text-[0.6rem] font-600 tracking-[0.24em] text-gold uppercase">
            <span>Coulisses</span>
            <span>Nouveautés</span>
            <span>Avis</span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 font-sans text-[0.68rem] text-ivory/55">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3 w-3 text-gold" strokeWidth={2} /> Officiel
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-gold" strokeWidth={2} /> Réponse rapide
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-gold" strokeWidth={2} /> Communauté
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
