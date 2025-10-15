import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tune } from '../lib/supabase';
import TuneDisplay from './TuneDisplay';

interface TuneBookProps {
  tunes: Tune[];
}

export default function TuneBook({ tunes }: TuneBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNextPage = () => {
    if (currentPage < tunes.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  if (tunes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">No tunes available yet. Check back soon!</p>
      </div>
    );
  }

  const currentTune = tunes[currentPage];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4 text-center text-sm text-gray-600">
        Page {currentPage + 1} of {tunes.length}
      </div>

      <div className="relative">
        <div
          className={`bg-amber-50 border-4 border-amber-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
            isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
          style={{
            backgroundImage: 'linear-gradient(to right, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.05)'
          }}
        >
          <div className="p-6 md:p-8 min-h-[600px]">
            <TuneDisplay tune={currentTune} />
          </div>
        </div>

        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-green-700 text-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-800 transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === tunes.length - 1 || isFlipping}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-green-700 text-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-800 transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 flex gap-2 justify-center overflow-x-auto pb-2">
        {tunes.map((tune, index) => (
          <button
            key={tune.id}
            onClick={() => {
              if (!isFlipping) {
                setIsFlipping(true);
                setTimeout(() => {
                  setCurrentPage(index);
                  setIsFlipping(false);
                }, 300);
              }
            }}
            className={`px-3 py-2 rounded text-xs whitespace-nowrap transition-all ${
              index === currentPage
                ? 'bg-green-700 text-white font-bold'
                : 'bg-white text-gray-700 hover:bg-green-100'
            }`}
          >
            {tune.title}
          </button>
        ))}
      </div>
    </div>
  );
}
