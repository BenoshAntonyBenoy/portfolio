import { Fragment } from "react";

/**
 * Renders the two emphasis markers used throughout content.json.
 *
 *   *word*    italic, accent colour — the one typographic move the site makes,
 *             used once per section heading.
 *   **word**  bright foreground, for a name or a proper noun inside body copy.
 *
 * Headings and paragraphs used to carry these as literal <span>s in JSX, which
 * is exactly what stopped the copy being editable from outside the code. Two
 * markers is the whole vocabulary: anything more and this becomes a markdown
 * parser, which is not what a heading needs.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export default function AccentText({ value }: { value: string }) {
  const parts = value.split(TOKEN).filter((part) => part !== "");

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="text-bone">
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className="italic text-lichen">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
