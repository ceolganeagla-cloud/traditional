import { ArrowLeft, Music } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onBack: () => void;
}

export default function Header({ currentView, onBack }: HeaderProps) {
  const showBackButton = currentView !== 'tunebook';

  const viewTitles: Record<string, string> = {
    tunebook: 'Ceol Gan Eagla',
    songs: 'Songs & Lyrics',
    learn: 'Learn Irish Music',
    search: 'Search & Browse'
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-700 via-white to-amber-500 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-green-600 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-green-800" />
            <div>
              <h1 className="text-xl font-bold text-green-900">
                {viewTitles[currentView] || 'Ceol Gan Eagla'}
              </h1>
              <p className="text-xs text-green-700">Music Without Fear</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div className="w-8 h-6 bg-green-600 rounded-sm"></div>
          <div className="w-8 h-6 bg-white border border-gray-300 rounded-sm"></div>
          <div className="w-8 h-6 bg-amber-500 rounded-sm"></div>
        </div>
      </div>
    </header>
  );
}
