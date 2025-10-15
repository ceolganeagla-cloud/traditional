import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TuneBook from './components/TuneBook';
import SongLibrary from './components/SongLibrary';
import Learn from './components/Learn';
import Search from './components/Search';
import { supabase, type Tune, type Song, type EducationalContent } from './lib/supabase';

type View = 'tunebook' | 'songs' | 'learn' | 'search';

function App() {
  const [currentView, setCurrentView] = useState<View>('tunebook');
  const [tunes, setTunes] = useState<Tune[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tunesResult, songsResult, contentResult] = await Promise.all([
        supabase.from('tunes').select('*').order('title'),
        supabase.from('songs').select('*').order('title'),
        supabase.from('educational_content').select('*').order('order_index')
      ]);

      if (tunesResult.data) setTunes(tunesResult.data);
      if (songsResult.data) setSongs(songsResult.data);
      if (contentResult.data) setEducationalContent(contentResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-700 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Loading Ceol Gan Eagla...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      <Header currentView={currentView} onBack={() => setCurrentView('tunebook')} />

      <main className="pb-20">
        {currentView === 'tunebook' && <TuneBook tunes={tunes} />}
        {currentView === 'songs' && <SongLibrary songs={songs} />}
        {currentView === 'learn' && <Learn content={educationalContent} />}
        {currentView === 'search' && <Search tunes={tunes} songs={songs} />}
      </main>

      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      <footer className="fixed bottom-0 left-0 right-0 bg-black text-amber-400 text-center py-2 text-xs">
        © Gearóid MacUaid – Ceol Gan Eagla 2025
      </footer>
    </div>
  );
}

export default App;
