import { useState,useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import TuneBook from './components/TuneBook'
import SongLibrary from './components/SongLibrary'
import Learn from './components/Learn'
import Search from './components/Search'

type View='book'|'tunebook'|'songs'|'learn'|'search'
export default function App(){
 const [view,setView]=useState<View>('tunebook');
 useEffect(()=>{window.scrollTo(0,0)},[view]);
 return (<div className='min-h-screen pb-24'>
  <Header currentView={view} onBack={()=>setView('tunebook')} />
  <main className='p-4 max-w-4xl mx-auto grid gap-4'>
    {view==='book'&&<div className='text-slate-400'>3D Book view coming here (see HTML build).</div>}
    {view==='tunebook'&&<TuneBook/>}
    {view==='songs'&&<SongLibrary/>}
    {view==='learn'&&<Learn/>}
    {view==='search'&&<Search/>}
  </main>
  <Navigation currentView={view} onNavigate={setView}/>
  <footer className='fixed bottom-10 left-0 right-0 text-center text-amber-400 text-xs'>© Gearóid MacUaid – Ceol Gan Eagla 2025</footer>
 </div>)}
