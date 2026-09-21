import React, { useState } from 'react';
import { runResearch } from './apis/api';
import SearchForm from './components/SearchForm';
import PipelineProgress from './components/PipelineProgress';
import ReportView from './components/ReportView';
import CriticView from './components/CriticView';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const App = () => {
  const [topic, setTopic] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [researchData, setResearchData] = useState(null);

  const handleResearch = async (searchTopic) => {
    if (!searchTopic || loading) return;

    setError(null);
    setLoading(true);
    setActiveTopic(searchTopic);

    try {
      const data = await runResearch(searchTopic);
      setResearchData(data);
    } catch (err) {
      console.error('Research error:', err);
      setError(
        err.message ||
          'Failed to connect to backend server. Make sure the backend is running on http://localhost:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setActiveTopic('');
    setResearchData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-100 flex flex-col font-sans relative">
      {/* Soft spotlight radial gradient from top center */}
      <div className="fixed inset-0 bg-spotlight pointer-events-none"></div>

      {/* Main Container with subtle vertical dashed guide lines */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col dashed-guide-left dashed-guide-right relative z-10 px-4 sm:px-8">
        {/* Simple Top Bar */}
        <header className="w-full py-6 flex items-center justify-between border-b border-zinc-900">
          <span
            onClick={handleReset}
            className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer tracking-wider uppercase"
          >
            AI Research Assistant
          </span>

          {researchData && (
            <button
              onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 py-12 sm:py-20 flex flex-col">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="text-white">Automated AI </span>
              <span className="text-zinc-500">Research System</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
              Autonomous multi-agent intelligence to search the web, scrape deep content, synthesize reports, and evaluate findings.
            </p>
          </div>

          {/* Search Form */}
          <SearchForm
            topic={topic}
            setTopic={setTopic}
            onSubmit={handleResearch}
            loading={loading}
          />

          {/* Pipeline State Indicator */}
          <PipelineProgress isLoading={loading} isFinished={!!researchData} />

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto my-6 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-200">Connection Error</div>
                <p className="mt-0.5 text-red-300 leading-relaxed">{error}</p>
                <p className="mt-2 text-[11px] font-mono text-red-400">
                  Ensure backend is running: `uvicorn main:app --reload --port 8000`
                </p>
              </div>
              <button
                onClick={() => handleResearch(activeTopic || topic)}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-red-900/60 hover:bg-red-900 text-red-200 rounded-lg border border-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Results Section - Direct sequential display without filter tabs */}
          {researchData && (
            <div className="mt-10 space-y-10 max-w-5xl mx-auto w-full">
              {/* Synthesized Research Report with Big Sources & Download */}
              <ReportView report={researchData.report} topic={activeTopic} />

              {/* Clean, Large Critic Feedback & Review */}
              <CriticView feedback={researchData.feedback} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;