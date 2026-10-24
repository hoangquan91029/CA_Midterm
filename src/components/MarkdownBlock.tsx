import React from 'react';
import katex from 'katex';

interface MarkdownBlockProps {
  content: string;
  className?: string;
}

interface MathFormulaProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/**
 * Renders a LaTeX mathematical expression using KaTeX with real fractions,
 * subscripts, superscripts, and summation symbols.
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  tex,
  display = false,
  className = '',
}) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  return (
    <span
      className={`${display ? 'block my-2 overflow-x-auto py-1' : 'inline-block align-middle mx-0.5'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Parses inline markdown syntax:
 * - $$display math$$
 * - $inline math$ (protected from MIPS registers like $s0, $t1, $ra, $sp, $v0)
 * - **bold** (including nested `code` and $math$)
 * - `code`
 * - Bare MIPS registers ($s0..$s7, $t0..$t9, $a0..$a3, $v0..$v1, $ra, $sp, $gp, $fp, $at, $zero, $0..$31)
 * - *italic*
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Tokenize in priority order:
  // 1. $$...$$ display math
  // 2. `...` inline code
  // 3. **...** bold text
  // 4. Named MIPS register tokens like $s0, $t1, $ra, $sp, $zero (so they never collide with $math$)
  // 5. $...$ inline LaTeX math
  // 6. *...* italic text
  const tokenRegex =
    /(\$\$(?:\\\$|[^$])+\$\$|`[^`]+`|\*\*[^*]+\*\*|\$(?:zero|at|v[0-1]|a[0-3]|t[0-9]|s[0-7]|k[0-1]|gp|sp|fp|ra)\b|\$(?:\\\$|[^$\n])+\$|\*[^*\s][^*]*\*)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. $$...$$ display math
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      return <MathFormula key={idx} tex={part.slice(2, -2).trim()} display />;
    }

    // 2. `...` inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const innerCode = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 text-[11.5px] font-mono font-semibold text-sky-900 bg-sky-50 border border-sky-200/80 rounded"
        >
          {innerCode}
        </code>
      );
    }

    // 3. **...** bold
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {renderInlineMarkdown(inner)}
        </strong>
      );
    }

    // 4. Bare named MIPS register token ($s0, $t1, $ra, etc.)
    if (
      /^\$(?:zero|at|v[0-1]|a[0-3]|t[0-9]|s[0-7]|k[0-1]|gp|sp|fp|ra)$/.test(
        part
      )
    ) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 text-[11.5px] font-mono font-bold text-indigo-900 bg-indigo-50/90 border border-indigo-200/80 rounded"
        >
          {part}
        </code>
      );
    }

    // 5. $...$ inline LaTeX math
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return <MathFormula key={idx} tex={part.slice(1, -1).trim()} />;
    }

    // 6. *...* italic
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic text-slate-600">
          {renderInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Structured Markdown + KaTeX Renderer supporting:
 * - Display math blocks ($$ ... $$)
 * - Inline math ($ ... $)
 * - Headings (###, ####)
 * - Code blocks (```...```)
 * - Markdown tables (| col1 | col2 |)
 * - Blockquotes / Callouts (> ...)
 * - Ordered & Unordered lists (-, *, •, 1.)
 * - Inline **bold**, `code`, and MIPS register pills
 */
export const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i += 1;
      continue;
    }

    // 0. Display Math Block $$ ... $$
    if (line.startsWith('$$')) {
      if (line.endsWith('$$') && line.length > 4) {
        const tex = line.slice(2, -2).trim();
        elements.push(
          <div
            key={`math-${i}`}
            className="my-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto"
          >
            <MathFormula tex={tex} display />
          </div>
        );
        i += 1;
        continue;
      } else {
        const mathLines: string[] = [line.slice(2)];
        i += 1;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathLines.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) {
          mathLines.push(lines[i].trim().slice(0, -2));
          i += 1;
        }
        elements.push(
          <div
            key={`math-block-${i}`}
            className="my-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto"
          >
            <MathFormula tex={mathLines.join('\n').trim()} display />
          </div>
        );
        continue;
      }
    }

    // 1. Code block ```
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing ```
      elements.push(
        <pre
          key={`code-${i}`}
          className="my-2.5 p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // 2. Markdown Table (| ... |)
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i += 1;
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim());

        const headers = parseRow(tableLines[0]);
        const dataRows = tableLines
          .slice(1)
          .filter((r) => !/^\|[\s:-]+\|$/.test(r.replace(/\|/g, '|')))
          .filter((r) => !r.includes('---'))
          .map(parseRow);

        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs"
          >
            <table className="w-full text-left text-xs sm:text-[13px]">
              <thead className="bg-slate-100/90 text-slate-800 border-b border-slate-200 font-bold">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-2.5 px-3.5">
                      {renderInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-2.5 px-3.5 text-slate-700 align-middle leading-relaxed"
                      >
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Headings ### or ####
    if (line.startsWith('#### ')) {
      elements.push(
        <h5
          key={`h4-${i}`}
          className="text-xs font-bold uppercase tracking-wider text-sky-800 mt-3 mb-1.5"
        >
          {renderInlineMarkdown(line.slice(5))}
        </h5>
      );
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4
          key={`h3-${i}`}
          className="text-sm font-bold text-slate-900 mt-3.5 mb-1.5 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
          <span>{renderInlineMarkdown(line.slice(4))}</span>
        </h4>
      );
      i += 1;
      continue;
    }

    // 4. Blockquote >
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2.5 p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-xs sm:text-[13px] text-slate-800 leading-relaxed space-y-1.5"
        >
          {quoteLines.map((ql, qIdx) => (
            <div key={qIdx}>{renderInlineMarkdown(ql)}</div>
          ))}
        </blockquote>
      );
      continue;
    }

    // 5. Bullet list (-, *, •)
    if (/^([-*•])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^([-*•])\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-*•])\s+/, ''));
        i += 1;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-2 space-y-2 pl-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed"
            >
              <span className="text-sky-600 font-bold mt-0.5 shrink-0">•</span>
              <span className="flex-1">{renderInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Numbered list (1), 1.)
    if (/^\d+[.)]\s+/.test(line)) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+[.)])\s+(.*)$/);
        if (match) {
          items.push({ num: match[1], text: match[2] });
        }
        i += 1;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-2 space-y-2 pl-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed"
            >
              <span className="font-mono font-bold text-sky-700 shrink-0 mt-0.5">{item.num}</span>
              <span className="flex-1">{renderInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {renderInlineMarkdown(line)}
      </p>
    );
    i += 1;
  }

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
};
