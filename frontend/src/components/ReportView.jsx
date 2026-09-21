import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Download, ExternalLink, Globe, FileText } from 'lucide-react';

export const ReportView = ({ report, topic }) => {
  const [copied, setCopied] = useState(false);

  // Extract URLs mentioned in the report to present in a dedicated Sources panel
  const extractedSources = useMemo(() => {
    if (!report) return [];
    const urlRegex = /(https?:\/\/[^\s\)\],]+)/g;
    const matches = report.match(urlRegex) || [];
    // Deduplicate and filter clean URLs
    const unique = Array.from(new Set(matches.map(u => u.replace(/[.,;:]$/, ''))));
    return unique.slice(0, 12);
  }, [report]);

  if (!report) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const safeName = (topic || 'research-report')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    element.download = `${safeName}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = report.trim().split(/\s+/).length;

  return (
    <div className="bg-[#131317] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-zinc-300" />
            <span>Synthesized Research Report</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {topic || 'Research Synthesis'}
          </h2>
          <span className="text-xs sm:text-sm text-zinc-500 mt-1.5 block font-mono">
            {wordCount.toLocaleString()} words &bull; ~{Math.max(1, Math.ceil(wordCount / 200))} min read
          </span>
        </div>

        {/* Action buttons: Download & Copy */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-zinc-200 text-black shadow-lg transition-colors active:scale-95"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Markdown Content with remark-gfm for tables, autolinks & tasklists */}
      <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 pb-2.5 border-b border-zinc-800/80">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-semibold text-white mt-7 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-200 mt-5 mb-2.5">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-zinc-300 mb-4 leading-relaxed font-normal">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2.5 my-4 pl-5 list-disc text-zinc-300 marker:text-zinc-500">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2.5 my-4 pl-5 list-decimal text-zinc-300 marker:text-zinc-500">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-1">
                {children}
              </li>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 hover:text-white underline underline-offset-4 inline-flex items-center gap-1.5 break-all font-medium transition-colors"
              >
                <span>{children}</span>
                <ExternalLink className="w-3.5 h-3.5 inline-block shrink-0 opacity-70" />
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-3 border-zinc-500 bg-zinc-900/60 pl-5 py-3 italic text-zinc-300 my-4 rounded-r-xl text-base">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) => (
              inline ? (
                <code className="px-2 py-1 rounded bg-zinc-900 text-zinc-200 text-xs sm:text-sm font-mono border border-zinc-800">
                  {children}
                </code>
              ) : (
                <pre className="p-5 rounded-2xl bg-black border border-zinc-800 text-xs sm:text-sm font-mono overflow-x-auto my-4 text-zinc-300">
                  <code>{children}</code>
                </pre>
              )
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-2xl border border-zinc-800 bg-[#0e0e11]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-[#18181d] border-b border-zinc-800 text-white font-semibold">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="py-3.5 px-4 font-semibold text-zinc-200 whitespace-nowrap">
                {children}
              </th>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors">
                {children}
              </tr>
            ),
            td: ({ children }) => (
              <td className="py-3.5 px-4 text-zinc-300">
                {children}
              </td>
            )
          }}
        >
          {report}
        </ReactMarkdown>
      </div>

      {/* Dedicated Large Sources Section */}
      {extractedSources.length > 0 && (
        <div className="pt-8 border-t border-zinc-800/80 mt-8">
          <div className="flex items-center gap-2.5 mb-5 text-sm sm:text-base font-semibold text-white tracking-wide">
            <Globe className="w-5 h-5 text-zinc-400" />
            <span>Referenced Sources ({extractedSources.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {extractedSources.map((url, idx) => {
              let hostname = '';
              try {
                hostname = new URL(url).hostname.replace(/^www\./, '');
              } catch (e) {
                hostname = url;
              }

              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#18181d] hover:bg-[#202027] border border-zinc-800 text-zinc-200 hover:text-white transition-all duration-200 shadow-md group"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <span className="w-7 h-7 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-white shrink-0 transition-colors">
                      {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <div className="truncate font-semibold text-sm sm:text-base text-white">
                        {hostname}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5 font-mono">
                        {url}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 ml-3 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
