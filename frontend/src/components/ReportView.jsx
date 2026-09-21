import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
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
    return unique.slice(0, 10);
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
    <div className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div>
          <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>Synthesized Research Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {topic || 'Research Synthesis'}
          </h2>
          <span className="text-xs text-zinc-500 mt-1 block font-mono">
            {wordCount.toLocaleString()} words &bull; ~{Math.max(1, Math.ceil(wordCount / 200))} min read
          </span>
        </div>

        {/* Action buttons: Download & Copy */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-zinc-200 text-black shadow-sm transition-colors active:scale-95"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 pb-2 border-b border-zinc-800/80">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-2.5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold text-zinc-200 mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-zinc-300 mb-3.5 leading-relaxed font-normal">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 my-3 pl-4 list-disc text-zinc-300 marker:text-zinc-500">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 my-3 pl-4 list-decimal text-zinc-300 marker:text-zinc-500">
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
                className="text-zinc-200 hover:text-white underline underline-offset-4 inline-flex items-center gap-1 break-all"
              >
                <span>{children}</span>
                <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-zinc-600 bg-zinc-900/50 pl-4 py-2 italic text-zinc-300 my-3 rounded-r">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) => (
              inline ? (
                <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-200 text-xs font-mono border border-zinc-800">
                  {children}
                </code>
              ) : (
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono overflow-x-auto my-3 text-zinc-300">
                  <code>{children}</code>
                </pre>
              )
            )
          }}
        >
          {report}
        </ReactMarkdown>
      </div>

      {/* Dedicated Sources Section */}
      {extractedSources.length > 0 && (
        <div className="pt-6 border-t border-zinc-800/80 mt-6">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Referenced Sources ({extractedSources.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  className="flex items-center justify-between p-3 rounded-xl bg-[#141417] hover:bg-[#19191d] border border-zinc-800/80 text-xs text-zinc-300 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-medium text-zinc-200 group-hover:text-white">
                      {hostname}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0 ml-2" />
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
