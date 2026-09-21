"use client";

import { motion } from "framer-motion";

export function FillBar({ delay = 0 }: { delay?: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[rgba(7,11,31,0.08)]">
      <motion.div
        className="h-full origin-left rounded-full bg-gradient-to-r from-[var(--v1-accent)] to-[var(--v1-accent-2)]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
