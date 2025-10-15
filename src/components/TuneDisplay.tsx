import { useEffect, useRef, useState } from 'react';
import { Play, Square, Mic, Download } from 'lucide-react';
import type { Tune } from '../lib/supabase';
import AudioRecorder from './AudioRecording';

interface TuneDisplayProps {
  tune: Tune;
}

export default function TuneDisplay({ tune }: TuneDisplayProps) {
  const notationRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const synthControlRef = useRef<any>(null);

  useEffect(() => {
    loadABCJS();
  }, [tune]);

  async function loadABCJS() {
    if (!notationRef.current) return;

    try {
      const ABCJS = (window as any).ABCJS;
      if (!ABCJS) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/abcjs@6.4.3/dist/abcjs-basic-min.js';
        script.async = true;
        script.onload = () => renderNotation();
        document.head.appendChild(script);
      } else {
        renderNotation();
      }
    } catch (error) {
      console.error('Error loading ABCJS:', error);
    }
  }

  function renderNotation() {
    const ABCJS = (window as any).ABCJS;
    if (!ABCJS || !notationRef.current) return;

    notationRef.current.innerHTML = '';

    try {
      const visualObj = ABCJS.renderAbc(notationRef.current, tune.abc_notation, {
        responsive: 'resize',
        staffwidth: notationRef.current.offsetWidth - 20,
        scale: 1.2,
        paddingbottom: 20,
        paddingleft: 10,
        paddingright: 10,
        paddingtop: 10
      });

      if (ABCJS.synth?.CreateSynth) {
        const synth = new ABCJS.synth.CreateSynth();
        synth.init({
          visualObj: visualObj[0],
          options: {
            program: 73,
            chordsOff: true
          }
        }).then(() => {
          synthControlRef.current = {
            synth,
            visualObj: visualObj[0]
          };
        });
      }
    } catch (error) {
      console.error('Error rendering ABC notation:', error);
    }
  }

  async function togglePlayback() {
    if (!synthControlRef.current) return;

    const { synth } = synthControlRef.current;

    if (isPlaying) {
      synth.stop();
      setIsPlaying(false);
    } else {
      try {
        await synth.prime();
        synth.start();
        setIsPlaying(true);

        setTimeout(() => {
          setIsPlaying(false);
        }, 30000);
      } catch (error) {
        console.error('Playback error:', error);
        setIsPlaying(false);
      }
    }
  }

  function downloadPDF() {
    alert('PDF download feature coming soon! In a full implementation, this would generate a PDF of the tune.');
  }

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-amber-900 pb-4">
        <h2 className="text-3xl font-bold text-green-900 mb-2">{tune.title}</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-green-700 text-white px-3 py-1 rounded-full font-medium">
            {tune.type.charAt(0).toUpperCase() + tune.type.slice(1)}
          </span>
          <span className="bg-amber-600 text-white px-3 py-1 rounded-full">
            {tune.difficulty.charAt(0).toUpperCase() + tune.difficulty.slice(1)}
          </span>
          {tune.region && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full">
              {tune.region}
            </span>
          )}
          {tune.artist && (
            <span className="text-gray-700 font-medium">
              Source: {tune.artist}
            </span>
          )}
        </div>
      </div>

      {tune.description && (
        <div className="bg-white bg-opacity-70 p-4 rounded-lg border-l-4 border-green-700">
          <p className="text-gray-800 leading-relaxed">{tune.description}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-inner" ref={notationRef}></div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={togglePlayback}
          className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
        >
          {isPlaying ? (
            <>
              <Square className="w-5 h-5" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Play
            </>
          )}
        </button>

        <button
          onClick={() => setShowRecorder(!showRecorder)}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Mic className="w-5 h-5" />
          {showRecorder ? 'Hide Recorder' : 'Record Yourself'}
        </button>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {showRecorder && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-600">
          <AudioRecorder tuneId={tune.id} tuneName={tune.title} />
        </div>
      )}
    </div>
  );
}
