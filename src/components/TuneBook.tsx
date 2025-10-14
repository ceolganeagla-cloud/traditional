import { useEffect } from 'react'
import { tunes } from '../data/tunes'
export default function TuneBook(){
 useEffect(()=>{tunes.forEach(t=>{const id=`abc-${t.id}`; // @ts-ignore
  if(window.ABCJS) window.ABCJS.renderAbc(id,t.abc,{responsive:'resize'});});},[]);
 return (<div className='grid gap-4'>
  {tunes.map(t=>(<section key={t.id} className='bg-slate-800/60 border border-slate-700 rounded-xl p-4 shadow'>
    <h2 className='text-base mb-2'>{t.title}<span className='inline-block text-xs border border-slate-600 rounded-full px-2 py-0.5 ml-2'>{t.type}</span></h2>
    <div id={`abc-${t.id}`} className='overflow-auto bg-slate-900/60 border border-slate-700 rounded-lg p-2'/>
  </section>))}
 </div>)}
