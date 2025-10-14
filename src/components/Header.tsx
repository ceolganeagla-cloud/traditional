type Props={currentView:string;onBack:()=>void}
export default function Header({currentView,onBack}:Props){
 const title=({tunebook:'Ceol Gan Eagla',songs:'Songs & Lyrics',learn:'Learn',search:'Search',book:'3D Book'})[currentView]||'Ceol Gan Eagla';
 const showBack=currentView!=='tunebook';
 return (<header className='sticky top-0 bg-black/90 backdrop-blur border-b border-slate-700 flex items-center gap-3 p-3 z-10'>
  <button onClick={onBack} hidden={!showBack} className='px-3 py-1 rounded-full border border-slate-600 bg-slate-900'>← Back</button>
  <img src='/icons/logo.svg' alt='Ceol Gan Eagla' className='w-7 h-7'/>
  <h1 className='text-sm tracking-wide'>{title}</h1>
 </header>)}
