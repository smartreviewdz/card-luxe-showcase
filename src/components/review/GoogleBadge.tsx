import { motion } from "motion/react";

export function GoogleBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto h-28 w-28"
    >
      <span
        className="animate-breathe absolute inset-[-18%] rounded-full"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 68%)", opacity: 0.35 }}
      />
      <span
        className="animate-spin-slow absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(var(--gold-deep), var(--gold-light), var(--gold-deep), var(--gold-light), var(--gold-deep))" }}
      />
      <span className="absolute inset-[3px] rounded-full bg-ivory" />
      <div className="absolute inset-[3px] grid place-items-center overflow-hidden rounded-full">
        <svg viewBox="0 0 48 48" className="h-14 w-14" aria-label="Google" role="img">
          <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.5 17.7 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"
          />
          <path
            fill="#FBBC05"
            d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.2z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.6-4-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z"
          />
        </svg>
      </div>
    </motion.div>
  );
}
