import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ShieldCheck, Award } from 'lucide-react';

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
    <div className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-zinc-400" />
          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            Critic Feedback & Review
          </h3>
        </div>

        {parsed.score && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs font-semibold text-white">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Score: {parsed.score}</span>
          </div>
        )}
      </div>

      {parsed.hasStructuredData ? (
        <div className="space-y-5">
          {/* Verdict */}
          {parsed.verdict && (
            <div className="p-4 rounded-xl bg-[#16161a] border border-zinc-800/80 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                One-Line Verdict
              </span>
              <p className="text-zinc-100 font-medium leading-relaxed italic">
                "{parsed.verdict}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="rounded-xl p-4 bg-[#141417] border border-zinc-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center justify-between">
                <span>Strengths</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                  {parsed.strengths.length}
                </span>
              </div>
              {parsed.strengths.length > 0 ? (
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {parsed.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500 italic">None specified.</p>
              )}
            </div>

            {/* Areas to Improve */}
            <div className="rounded-xl p-4 bg-[#141417] border border-zinc-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center justify-between">
                <span>Areas to Improve</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                  {parsed.improvements.length}
                </span>
              </div>
              {parsed.improvements.length > 0 ? (
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {parsed.improvements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500 italic">None specified.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none text-zinc-300 text-sm">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CriticView;
