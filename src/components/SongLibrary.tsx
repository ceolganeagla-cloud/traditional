import { songs } from '../data/tunes'
export default function SongLibrary(){
 return (<div className='grid gap-4'>
  {songs.map(s=>(<section key={s.id} className='bg-slate-800/60 border border-slate-700 rounded-xl p-4'>
    <h2 className='text-base mb-2'>{s.title}</h2>
    <pre className='text-sm text-slate-300 whitespace-pre-wrap'>{s.lyrics}</pre>
  </section>))}
 </div>)}
