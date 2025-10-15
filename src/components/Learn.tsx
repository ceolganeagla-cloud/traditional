import { useState } from 'react';
import { GraduationCap, BookOpen, Music, MapPin, Target } from 'lucide-react';
import type { EducationalContent } from '../lib/supabase';

interface LearnProps {
  content: EducationalContent[];
}

export default function Learn({ content }: LearnProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');

  const categoryIcons: Record<string, any> = {
    notation: BookOpen,
    instruments: Music,
    styles: MapPin,
    practice: Target
  };

  const categoryColors: Record<string, string> = {
    notation: 'border-blue-600 bg-blue-50',
    instruments: 'border-green-600 bg-green-50',
    styles: 'border-amber-600 bg-amber-50',
    practice: 'border-red-600 bg-red-50'
  };

  const categories = [...new Set(content.map(item => item.category))];

  if (content.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Educational content coming soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="w-10 h-10" />
          <h2 className="text-3xl font-bold">Learn Irish Music</h2>
        </div>
        <p className="text-green-100 text-lg">
          Master the traditions, techniques, and culture of Irish music - without fear!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category] || BookOpen;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(isActive ? '' : category)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? categoryColors[category] || 'border-gray-600 bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-bold capitalize">{category}</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {content
          .filter(item => !activeCategory || item.category === activeCategory)
          .map((item) => {
            const Icon = categoryIcons[item.category] || BookOpen;
            const colorClass = categoryColors[item.category] || 'border-gray-600 bg-gray-50';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${colorClass}`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                  </div>

                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {content.filter(item => !activeCategory || item.category === activeCategory).length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>Select a category above to view learning materials.</p>
        </div>
      )}
    </div>
  );
}
