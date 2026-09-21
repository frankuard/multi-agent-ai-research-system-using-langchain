import React, { useState } from 'react';
import { runResearch } from './apis/api';
import SearchForm from './components/SearchForm';
import PipelineProgress from './components/PipelineProgress';
import ReportView from './components/ReportView';
import CriticView from './components/CriticView';
import RawDataDrawer from './components/RawDataDrawer';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const App = () => {
  const [topic, setTopic] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'report', 'critic'

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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans relative">
      {/* Soft spotlight radial gradient from top center like reference image */}
      <div className="fixed inset-0 bg-spotlight pointer-events-none"></div>

      {/* Main Container with subtle vertical dashed guide lines like reference screenshot */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col dashed-guide-left dashed-guide-right relative z-10 px-4 sm:px-8">
        {/* Simple Top Bar - just 'AI Research Assistant' */}
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
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
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

          {/* Search Form (styled like the reference screenshot) */}
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

          {/* Results Section */}
          {researchData && (
            <div className="mt-10 space-y-8 max-w-4xl mx-auto w-full">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-1.5 p-1 bg-[#141417] border border-zinc-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('both')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      viewMode === 'both'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All Results
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('report')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      viewMode === 'report'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Report & Sources
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('critic')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      viewMode === 'critic'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Critic Review
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear Results
                </button>
              </div>

              {/* Report View with Sources & Download */}
              {(viewMode === 'both' || viewMode === 'report') && (
                <ReportView report={researchData.report} topic={activeTopic} />
              )}

              {/* Critic Review View */}
              {(viewMode === 'both' || viewMode === 'critic') && (
                <CriticView feedback={researchData.feedback} />
              )}

              {/* Raw Data Drawer */}
              <RawDataDrawer
                searchResults={researchData.search_results}
                scrapedContent={researchData.scraped_content}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;