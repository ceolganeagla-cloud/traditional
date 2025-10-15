import { useState, useRef } from 'react';
import { Mic, Square, Play, Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AudioRecorderProps {
  tuneId: string;
  tuneName: string;
}

export default function AudioRecorder({ tuneId, tuneName }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  function clearRecording() {
    setAudioBlob(null);
    setAudioUrl('');
    setNotes('');
  }

  async function saveRecording() {
    if (!audioBlob) return;

    setSaving(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const { error } = await supabase.from('user_recordings').insert({
          tune_id: tuneId,
          recording_data: base64Audio,
          notes: notes,
          user_id: 'anonymous'
        });

        if (error) throw error;

        alert('Recording saved successfully!');
        clearRecording();
      };
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Failed to save recording. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Practice Recorder</h3>
      <p className="text-sm text-gray-600">
        Record yourself playing "{tuneName}" to track your progress.
      </p>

      <div className="flex gap-3">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium animate-pulse"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        {audioBlob && (
          <>
            <audio src={audioUrl} controls className="flex-1" />
            <button
              onClick={clearRecording}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {audioBlob && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? What do you need to work on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              rows={3}
            />
          </div>

          <button
            onClick={saveRecording}
            disabled={saving}
            className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Recording'}
          </button>
        </div>
      )}
    </div>
  );
}
