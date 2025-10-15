import { useState, useMemo } from 'react';
import { Search as SearchIcon, Music, Music2, Filter } from 'lucide-react';
import type { Tune, Song } from '../lib/supabase';

interface SearchProps {
  tunes: Tune[];
  songs: Song[];
}

export default function Search({ tunes, songs }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tunes' | 'songs'>('all');
  const [filterTuneType, setFilterTuneType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const tuneTypes = useMemo(() => {
    return [...new Set(tunes.map(t => t.type))];
  }, [tunes]);

  const filteredResults = useMemo(() => {
    let results: Array<{ type: 'tune' | 'song'; data: Tune | Song }> = [];

    if (filterType === 'all' || filterType === 'tunes') {
      const filteredTunes = tunes.filter(tune => {
        const matchesSearch =
          tune.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tune.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tune.region.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = !filterTuneType || tune.type === filterTuneType;

        return matchesSearch && matchesType;
      });

      results.push(...filteredTunes.map(tune => ({ type: 'tune' as const, data: tune })));
    }

    if (filterType === 'all' || filterType === 'songs') {
      const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchQuery.toLowerCase())
      );

      results.push(...filteredSongs.map(song => ({ type: 'song' as const, data: song })));
    }

    return results;
  }, [searchQuery, filterType, filterTuneType, tunes, songs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <SearchIcon className="w-8 h-8 text-green-700" />
          <h2 className="text-2xl font-bold text-gray-900">Search & Browse</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tunes, songs, artists, regions..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-lg"
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'tunes', 'songs'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filterType === type
                          ? 'bg-green-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {(filterType === 'all' || filterType === 'tunes') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tune Type
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilterTuneType('')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !filterTuneType
                          ? 'bg-green-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Types
                    </button>
                    {tuneTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterTuneType(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          filterTuneType === type
                            ? 'bg-green-700 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredResults.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              {searchQuery
                ? 'No results found. Try a different search term.'
                : 'Enter a search term to find tunes and songs.'}
            </p>
          </div>
        )}

        {filteredResults.map((result, index) => {
          const isTune = result.type === 'tune';
          const data = result.data;

          return (
            <div
              key={`${result.type}-${data.id}`}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-700"
            >
              <div className="flex items-start gap-4">
                {isTune ? (
                  <Music className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                ) : (
                  <Music2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{data.title}</h3>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      isTune ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isTune ? 'Tune' : 'Song'}
                    </span>

                    {isTune && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {(data as Tune).type}
                      </span>
                    )}

                    {data.artist && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {data.artist}
                      </span>
                    )}

                    {(data as Tune).region && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {(data as Tune).region}
                      </span>
                    )}
                  </div>

                  {(data as Tune).description && (
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {(data as Tune).description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResults.length > 0 && (
        <div className="text-center text-gray-600 text-sm">
          Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
