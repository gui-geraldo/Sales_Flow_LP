"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Emph } from "./Emph";

export function WordReveal({
  text,
  as: Tag = "h1",
  className = "",
  emphasisClassName = "v1-serif v1-gradient-text",
  delay = 0.2,
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  emphasisClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag className={className}>
        <Emph text={text} className={emphasisClassName} />
      </Tag>
    );
  }

  const words = text.split("*").flatMap((segment, i) =>
    segment
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, emphasized: i % 2 === 1 })),
  );

  return (
    <Tag className={className}>
      {words.map(({ word, emphasized }, i) => (
        <Fragment key={i}>
          <motion.span
            className={emphasized ? emphasisClassName : undefined}
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5, delay: delay + i * 0.055 }}
          >
            {word}
          </motion.span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}
