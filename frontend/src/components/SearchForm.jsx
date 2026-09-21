import React from 'react';
import { Loader2 } from 'lucide-react';

export const SearchForm = ({ topic, setTopic, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onSubmit(topic.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-[#141416] rounded-2xl border border-zinc-800/80 shadow-2xl p-1.5 focus-within:border-zinc-600 transition-all duration-200">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter research topic (e.g. Solid State Batteries, Quantum Computing)..."
            disabled={loading}
            className="w-full py-3 px-4 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-sm sm:text-base font-normal disabled:opacity-60"
          />

          <div className="flex items-center gap-2 shrink-0">
            {topic && !loading && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="text-xs px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-white hover:bg-zinc-200 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Researching...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Subtext where suggestions previously were */}
      <div className="mt-3.5 text-center">
        <span className="text-xs sm:text-sm text-zinc-500 font-normal tracking-wide">
          Let's do some research
        </span>
      </div>
    </div>
  );
};

export default SearchForm;
