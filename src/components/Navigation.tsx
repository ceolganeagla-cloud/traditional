type Props={currentView:string;onNavigate:(v:any)=>void}
export default function Navigation({currentView,onNavigate}:Props){
 const Btn=(id:string,lbl:string)=>(<button onClick={()=>onNavigate(id)} className={`py-2 ${currentView===id?'text-green-400 font-semibold':'text-slate-300'}`}>{lbl}</button>);
 return (<nav className='fixed bottom-0 left-0 right-0 bg-black border-t border-slate-700 grid grid-cols-5 text-center'>
  {Btn('book','Book')}{Btn('tunebook','Tune Book')}{Btn('songs','Songs')}{Btn('learn','Learn')}{Btn('search','Search')}
 </nav>)}
