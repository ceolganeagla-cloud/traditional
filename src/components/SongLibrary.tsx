import { useState } from 'react';
import { Music2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Song } from '../lib/supabase';

interface SongLibraryProps {
  songs: Song[];
}

export default function SongLibrary({ songs }: SongLibraryProps) {
  const [expandedSong, setExpandedSong] = useState<string | null>(null);

  if (songs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">No songs available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-700">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Irish Songs & Lyrics</h2>
        <p className="text-gray-700">
          Learn traditional Irish songs. Tap on a song to view full lyrics and background.
        </p>
      </div>

      {songs.map((song) => (
        <div
          key={song.id}
          className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:border-green-600 transition-colors"
        >
          <button
            onClick={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <Music2 className="w-6 h-6 text-green-700 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{song.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {song.type}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    {song.language}
                  </span>
                  {song.region && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {song.region}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {expandedSong === song.id ? (
              <ChevronUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
            )}
          </button>

          {expandedSong === song.id && (
            <div className="px-6 pb-6 space-y-4 border-t border-gray-200 bg-amber-50">
              {song.description && (
                <div className="pt-4">
                  <h4 className="font-bold text-gray-900 mb-2">Background</h4>
                  <p className="text-gray-700 leading-relaxed">{song.description}</p>
                </div>
              )}

              {song.artist && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Traditional Source</h4>
                  <p className="text-gray-700">{song.artist}</p>
                </div>
              )}

              {song.lyrics && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Lyrics</h4>
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                      {song.lyrics}
                    </pre>
                  </div>
                </div>
              )}

              {song.audio_url && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Listen</h4>
                  <audio src={song.audio_url} controls className="w-full" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
