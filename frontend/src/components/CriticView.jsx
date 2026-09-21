import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ShieldCheck } from 'lucide-react';

export const CriticView = ({ feedback }) => {
  if (!feedback) return null;

  const parsed = useMemo(() => {
    const lines = feedback.split('\n');
    let score = null;
    let verdict = '';
    const strengths = [];
    const improvements = [];

    let currentSection = null;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (/^Score:\s*(.*)/i.test(trimmed)) {
        const match = trimmed.match(/^Score:\s*(.*)/i);
        if (match) score = match[1].trim();
        currentSection = null;
        continue;
      }

      if (/^Strengths:/i.test(trimmed)) {
        currentSection = 'strengths';
        continue;
      }

      if (/^Areas to Improve:/i.test(trimmed)) {
        currentSection = 'improvements';
        continue;
      }

      if (/^One line verdict:/i.test(trimmed)) {
        currentSection = 'verdict';
        const match = trimmed.match(/^One line verdict:\s*(.*)/i);
        if (match && match[1]) verdict = match[1].trim();
        continue;
      }

      if (currentSection === 'strengths') {
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          strengths.push(trimmed.replace(/^[-*•]\s*/, ''));
        }
      } else if (currentSection === 'improvements') {
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          improvements.push(trimmed.replace(/^[-*•]\s*/, ''));
        }
      } else if (currentSection === 'verdict') {
        if (!verdict) verdict = trimmed;
        else verdict += ' ' + trimmed;
      }
    }

    return {
      score,
      strengths,
      improvements,
      verdict,
      hasStructuredData: score || strengths.length > 0 || improvements.length > 0 || verdict
    };
  }, [feedback]);

  return (
    <div className="bg-[#131317] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block mb-0.5">
              Peer Review & Evaluation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Critic Review
            </h3>
          </div>
        </div>

        {parsed.score && (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 self-start sm:self-auto">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Rating</span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono">{parsed.score}</span>
          </div>
        )}
      </div>

      {parsed.hasStructuredData ? (
        <div className="space-y-6">
          {/* Verdict */}
          {parsed.verdict && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#18181d] border border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
                Executive Verdict
              </span>
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed italic">
                "{parsed.verdict}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[#18181d] border border-zinc-800">
              <div className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-4 flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span>Identified Strengths</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono font-medium">
                  {parsed.strengths.length}
                </span>
              </div>
              {parsed.strengths.length > 0 ? (
                <ul className="space-y-3 text-sm sm:text-base text-zinc-300">
                  {parsed.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-zinc-500 font-bold shrink-0 mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500 italic">None specified.</p>
              )}
            </div>

            {/* Areas to Improve */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[#18181d] border border-zinc-800">
              <div className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-4 flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span>Areas to Improve</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono font-medium">
                  {parsed.improvements.length}
                </span>
              </div>
              {parsed.improvements.length > 0 ? (
                <ul className="space-y-3 text-sm sm:text-base text-zinc-300">
                  {parsed.improvements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-zinc-500 font-bold shrink-0 mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500 italic">None specified.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none text-zinc-300 text-base leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CriticView;
