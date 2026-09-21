import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Database } from 'lucide-react';

export const RawDataDrawer = ({ searchResults, scrapedContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [copied, setCopied] = useState(false);

  if (!searchResults && !scrapedContent) return null;

  const currentContent = activeTab === 'search' ? searchResults : scrapedContent;

  const handleCopy = async () => {
    if (!currentContent) return;
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 border border-zinc-800/80 rounded-2xl bg-[#111114] shadow-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-zinc-400" />
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-white">
              Raw Agent Intelligence & Telemetry
            </h4>
            <p className="text-[11px] text-zinc-500">
              Inspect raw search hits and scraped page text
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
          <span>{isOpen ? 'Hide' : 'Inspect'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-800/80 p-5 bg-[#0d0d10]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                Search Results
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('scraped')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'scraped'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                Scraped Content
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800 transition-colors"
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
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800/80 font-mono text-xs text-zinc-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {currentContent || (
              <span className="text-zinc-600 italic">No telemetry data recorded.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RawDataDrawer;
