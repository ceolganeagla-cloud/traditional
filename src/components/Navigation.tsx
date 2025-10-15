import { Book, Music2, GraduationCap, Search } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: 'tunebook' | 'songs' | 'learn' | 'search') => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'tunebook', icon: Book, label: 'Tunes' },
    { id: 'songs', icon: Music2, label: 'Songs' },
    { id: 'learn', icon: GraduationCap, label: 'Learn' },
    { id: 'search', icon: Search, label: 'Search' }
  ] as const;

  return (
    <nav className="fixed bottom-8 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                currentView === id
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
