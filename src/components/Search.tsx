import { useState } from 'react'
import { tunes, songs } from '../data/tunes'
export default function Search(){
 const [q,setQ]=useState('');
 const items=[...tunes.map(t=>({kind:'Tune',title:t.title})),...songs.map(s=>({kind:'Song',title:s.title}))].filter(x=>x.title.toLowerCase().includes(q.toLowerCase()));
 return (<section className='bg-slate-800/60 border border-slate-700 rounded-xl p-4'>
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search tunes or songs…' className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mb-3'/>
  <div className='grid gap-2'>
    {q && (items.length?items.map((x,i)=>(<div key={i} className='text-sm'><b>{x.kind}:</b> {x.title}</div>)):<div>No results</div>)}
  </div>
 </section>)
}
