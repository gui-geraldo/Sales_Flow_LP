import { Fragment } from "react";

// Trechos entre *asteriscos* nos textos viram destaque em serifada itálica.
export function Emph({ text, className = "v1-serif" }: { text: string; className?: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className={className}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
