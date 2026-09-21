import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

const STAGES = [
  { id: 1, name: 'Search Agent', desc: 'Fetching authoritative web resources via Tavily' },
  { id: 2, name: 'Reader Agent', desc: 'Scraping and extracting deep text content' },
  { id: 3, name: 'Writer Agent', desc: 'Synthesizing report, findings, and citations' },
  { id: 4, name: 'Critic Agent', desc: 'Strictly evaluating quality and audit score' },
];

export const PipelineProgress = ({ isLoading, isFinished }) => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      if (isFinished) setActiveStep(4);
      return;
    }

    setActiveStep(1);
    const t1 = setTimeout(() => setActiveStep(2), 3500);
    const t2 = setTimeout(() => setActiveStep(3), 8500);
    const t3 = setTimeout(() => setActiveStep(4), 16000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading, isFinished]);

  if (!isLoading && !isFinished) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-10 p-6 sm:p-8 rounded-3xl bg-[#111114] border border-zinc-800/80 shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/60">
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200 tracking-wide">
          {isLoading ? 'Pipeline In Progress' : 'Pipeline Execution Complete'}
        </h3>
        <span className="text-xs sm:text-sm text-zinc-500 font-mono">
          {isLoading ? `Stage ${activeStep} of 4` : '4 / 4 Complete'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STAGES.map((stage) => {
          const isDone = isFinished || activeStep > stage.id;
          const isCurrent = isLoading && activeStep === stage.id;

          return (
            <div
              key={stage.id}
              className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between min-h-[130px] sm:min-h-[150px] transition-all duration-200 ${
                isCurrent
                  ? 'border-zinc-500 bg-[#19191e] text-white shadow-xl scale-[1.02]'
                  : isDone
                  ? 'border-zinc-800 bg-[#131317] text-zinc-200'
                  : 'border-zinc-900 bg-[#0d0d10] text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-500">0{stage.id}</span>
                {isDone ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-800 shrink-0"></span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base text-white tracking-tight mb-1">
                  {stage.name}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineProgress;
