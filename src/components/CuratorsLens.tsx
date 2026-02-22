import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Loader2, BookOpen, History, TrendingUp } from 'lucide-react';
import { analyzeItem } from '../services/curatorService';
import Markdown from 'react-markdown';

export const CuratorsLens = ({ listings }: { listings: any[] }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const analysis = await analyzeItem(query, listings);
    setResult(analysis || null);
    setLoading(false);
  };

  return (
    <section id="curators-lens" className="py-32 px-6 bg-[#fdfcf8]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs uppercase tracking-widest font-bold mb-6">
            <Sparkles className="w-3 h-3" /> AI Artifact & Bibliographic Analysis
          </div>
          <h2 className="text-5xl md:text-7xl font-light mb-8">The Curator's Lens</h2>
          <p className="text-xl opacity-60 max-w-2xl mx-auto font-serif italic">
            Describe a book, manuscript, or rare collectible you've discovered. Our AI-powered curator will analyze its historical significance, rarity markers, and market value.
          </p>
        </div>

        <div className="relative mb-12">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your find in detail (e.g., edition, publisher, year, manufacturer, condition, and any unique markings or serial numbers)..."
            className="w-full h-48 p-8 rounded-[32px] bg-white border border-black/5 shadow-sm focus:ring-2 focus:ring-black/5 focus:border-black/20 outline-none transition-all resize-none text-lg font-serif"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !query.trim()}
            className="absolute bottom-6 right-6 px-8 py-4 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze Piece
          </button>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-[40px] border border-black/5 shadow-xl"
            >
              <div className="prose prose-lg max-w-none font-serif text-[#1a1a1a]/80">
                <Markdown>{result}</Markdown>
              </div>
              <div className="mt-12 pt-12 border-t border-black/5 flex flex-col md:flex-row gap-8 justify-between items-center text-xs uppercase tracking-widest opacity-40">
                <div className="flex items-center gap-2"><History className="w-4 h-4" /> Historical Context Engine</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Bibliographic Database</div>
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Market Sentiment Analysis</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
