
/* Ceol Gan Eagla App Logic with ABCJS + Tools */
(function(){
  const pages = {
    search: document.getElementById('page-search'),
    tune: document.getElementById('page-tune'),
    songs: document.getElementById('page-songs'),
    learn: document.getElementById('page-learn'),
    tools: document.getElementById('page-tools'),
  };
  const navs = {
    search: document.getElementById('nav-search'),
    tune: document.getElementById('nav-tunes'),
    songs: document.getElementById('nav-songs'),
    learn: document.getElementById('nav-learn'),
    tools: document.getElementById('nav-tools'),
  };
  function route(name){
    Object.values(pages).forEach(p=>p.classList.add('hidden'));
    Object.values(navs).forEach(n=>n.removeAttribute('aria-current'));
    (pages[name]||pages.search).classList.remove('hidden');
    (navs[name]||navs.search).setAttribute('aria-current','page');
    window.scrollTo({top:0,behavior:'instant'});
  }
  function syncRoute(){ route((location.hash||'#search').slice(1)); }
  window.addEventListener('hashchange', syncRoute);
  syncRoute();
  document.getElementById('yy').textContent = new Date().getFullYear();

  // Data
  const TUNES=[
    {id:"roisin-dubh",title:"Róisín Dubh",type:"Air",level:"Beginner",source:"Traditional",summary:"A haunting slow air, “Dark Rosaleen.”",abc:`X:1
T:Róisín Dubh
R:air
M:3/4
L:1/8
K:Dmix
A2 | d2 c2 A2 | G2 A2 B2 | A2 F2 D2 | E4 A2 | d2 c2 A2 | G2 A2 B2 | A2 F2 D2 | E6 ||`},
    {id:"the-kesh-jig",title:"The Kesh",type:"Jig",level:"General",source:"Traditional",summary:"Session favourite jig in G.",abc:`X:1
T:The Kesh
R:jig
M:6/8
L:1/8
K:G
D|GFG BAB|gfg dBG|GFG BAB|dAG FGD|GFG BAB|gfg dBG|cAF GFE|DG F G3||`},
    {id:"the-silver-spear",title:"The Silver Spear",type:"Reel",level:"General",source:"Traditional",summary:"A well-known reel.",abc:`X:1
T:The Silver Spear
R:reel
M:4/4
L:1/8
K:D
A2 | d2 AD FA dA | d2 AD FA dA | g2 fg edef | g2 fg edB A | d2 AD FA dA | d2 AD FA dA | g2 fg edef | g2 fg e2 d2 ||`}
  ];
  const SONGS=[{id:"oro-se-do",title:"Óró Sé Do Bheatha Abhaile",tags:["traditional song","Irish","General"],blurb:"A welcoming song associated with Gráinne Mhaol.",lyrics:`Óró, sé do bheatha ‘bhaile,
Óró, sé do bheatha ‘bhaile,
Óró, sé do bheatha ‘bhaile,
Anois ar theacht an tsamhraidh.`}];

  // Search & Filters
  const q=document.getElementById('q');
  const pillsScope=[...document.querySelectorAll('#scopePills .pill')];
  const pillsKind=[...document.querySelectorAll('#kindPills .pill')];
  let scope='all', kind='All Types';
  function setPressed(group, el){ group.forEach(b=>b.setAttribute('aria-pressed','false')); el.setAttribute('aria-pressed','true'); }
  pillsScope.forEach(b=>b.addEventListener('click',()=>{ scope=b.dataset.scope; setPressed(pillsScope,b); renderSearch(); }));
  pillsKind.forEach(b=>b.addEventListener('click',()=>{ kind=b.dataset.kind; setPressed(pillsKind,b); renderSearch(); }));
  q.addEventListener('input', renderSearch);

  function match(text, term){ return text.toLowerCase().includes(term.toLowerCase()); }
  function renderSearch(){
    const term = q.value?.trim() || ''; const list = document.getElementById('results'); let items = [];
    if(scope==='all' || scope==='tunes'){
      items = items.concat(TUNES.filter(t =>
        (kind==='All Types' || t.type===kind) &&
        (!term || match(t.title,term) || match(t.summary,term) || match(t.type,term))
      ).map(t => ({ kind:'tune', id:t.id, title:t.title, meta:[t.type, t.level, t.source], blurb:t.summary })));
    }
    if(scope==='all' || scope==='songs'){
      items = items.concat(SONGS.filter(s => !term || match(s.title,term) || match(s.blurb,term))
        .map(s => ({ kind:'song', id:s.id, title:s.title, meta:s.tags, blurb:s.blurb })));
    }
    list.innerHTML = items.map(it => `
      <a class="item" href="#${it.kind==='tune'?'tune':'songs'}" data-kind="${it.kind}" data-id="${it.id}">
        <h3 style="margin:0">${it.title}</h3>
        <div class="badges">${it.meta.map(m=>`<span class="badge">${m}</span>`).join('')}</div>
        <div style="color:var(--muted)">${it.blurb||''}</div>
      </a>`).join('') || '<div style="padding:14px;color:#6b7d72">No results.</div>';
    [...list.querySelectorAll('a.item')].forEach(a=>a.addEventListener('click', ()=>{
      const kind=a.getAttribute('data-kind'), id=a.getAttribute('data-id'); openItem(kind,id);
    }));
  }
  renderSearch();

  // Tune view with ABCJS
  const tTitle = document.getElementById('t-title');
  const tBadges = document.getElementById('t-badges');
  const tBlurb = document.getElementById('t-blurb');
  const paper = document.getElementById('paper');
  const audioNote = document.getElementById('audioNote');
  let currentTune, synthControl, visualObj;

  function safeRenderAbc(elId, abc){
    try{
      if (!window.ABCJS) throw new Error("ABCJS not available");
      const res = ABCJS.renderAbc(elId, abc, { responsive:'resize', add_classes:true });
      return res && res[0];
    }catch(err){
      document.getElementById(elId).innerHTML = `<div class="note">ABCJS render error: ${err.message}</div>`;
      return null;
    }
  }

  window.openItem = function(kind, id){
    if(kind==='tune'){
      currentTune = TUNES.find(x=>x.id===id) || TUNES[0];
      tTitle.textContent = currentTune.title;
      tBlurb.textContent = currentTune.summary || '';
      tBadges.innerHTML = [`<span class="badge air">${currentTune.type}</span>`,`<span class="badge">${currentTune.level}</span>`,`<span class="badge">${currentTune.source}</span>`].join('');
      paper.innerHTML = '';
      visualObj = safeRenderAbc('paper', currentTune.abc);
      location.hash = 'tune';
    } else {
      renderSongs(); location.hash = 'songs'; setTimeout(()=>{ const el=document.getElementById(id); if(el) el.open=true; }, 60);
    }
  };

  document.getElementById('t-play').addEventListener('click', async () => {
    if (!window.ABCJS || !ABCJS.synth || !visualObj) return;
    audioNote.hidden = false;
    try{
      const synth = new ABCJS.synth.CreateSynth();
      await synth.init({ visualObj });
      const control = new ABCJS.synth.SynthController();
      const target = document.createElement('div'); target.style.margin = '10px 0'; paper.prepend(target);
      control.load(target, null, { displayLoop:false, displayRestart:false, displayPlay:false, displayProgress:true });
      await synth.prime();
      control.setTune(visualObj, false);
      control.play();
      synthControl = control;
    }catch(err){
      paper.insertAdjacentHTML('afterbegin', `<div class="note">Audio init failed: ${err.message}</div>`);
    }
  });
  document.getElementById('t-stop').addEventListener('click', ()=> synthControl && synthControl.pause());
  document.getElementById('t-print').addEventListener('click', ()=> window.print());

  // Songs
  function renderSongs(){
    const list = document.getElementById('songlist');
    list.innerHTML = SONGS.map(s => `
      <details class="item" id="${s.id}">
        <summary style="cursor:pointer"><strong>${s.title}</strong>
          <div class="badges" style="margin-top:6px">${s.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
        </summary>
        <div style="white-space:pre-wrap;margin-top:8px">${s.lyrics}</div>
      </details>`).join('');
  }
  renderSongs();

  // Tools
  const host = document.getElementById('toolhost');
  document.getElementById('studioBtn').addEventListener('click', studio);
  document.getElementById('mBtn').addEventListener('click', metronome);
  document.getElementById('rBtn').addEventListener('click', recorder);
  document.getElementById('tuneBtn').addEventListener('click', tuner);

  function studio(){
    host.innerHTML = `<h3 style="margin-top:0">ABC Studio</h3>
    <textarea id="abcsrc" style="width:100%;height:160px">X:1
T:New Tune
R:jig
M:6/8
L:1/8
K:G
D|GFG BAB|gfg dBG|</textarea>
    <div class="actions"><button class="btn play" id="renderBtn">Render</button>
    <button class="btn pdf" id="printBtn">Print / PDF</button></div>
    <div id="studioPaper" style="margin-top:10px"></div>`;
    document.getElementById('renderBtn').addEventListener('click', ()=>{
      if (!window.ABCJS) { document.getElementById('studioPaper').innerHTML = '<div class="note">ABCJS not loaded.</div>'; return; }
      ABCJS.renderAbc('studioPaper', document.getElementById('abcsrc').value, { responsive:'resize' });
    });
    document.getElementById('printBtn').addEventListener('click', ()=>window.print());
  }

  function metronome(){
    host.innerHTML = `<h3 style="margin-top:0">Metronome</h3>
    <div style="display:flex;gap:10px;align-items:center;margin:8px 0">
      <label>BPM <input id="bpm" type="number" value="96" min="30" max="220" style="width:80px"></label>
      <label>Time <select id="sig"><option>4/4</option><option selected>6/8</option></select></label>
      <button id="mToggle" class="btn play">Start</button>
    </div>
    <canvas id="rail" width="700" height="140" style="width:100%;background:#fff;border:1px solid var(--line);border-radius:14px"></canvas>`;
    const ctx = document.getElementById('rail').getContext('2d');
    const bpm = document.getElementById('bpm'); const sig = document.getElementById('sig'); const toggle = document.getElementById('mToggle');
    let audioCtx, running=false, last=0, beat=0;
    function setup(){ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); }
    function draw(progress,beats){
      const w=ctx.canvas.width,h=ctx.canvas.height; ctx.clearRect(0,0,w,h);
      const pad=30,usable=w-2*pad; ctx.strokeStyle='#cfe6d6'; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(pad,h/2); ctx.lineTo(w-pad,h/2); ctx.stroke();
      for(let i=0;i<beats;i++){ const x=pad+usable*(i/(beats-1||1)); ctx.fillStyle=i===0?'#1d7f3b':'#9fbda8'; ctx.beginPath(); ctx.arc(x,h/2,8,0,6.28); ctx.fill(); }
      const x=pad+usable*progress; ctx.fillStyle='#1d7f3b'; ctx.beginPath(); ctx.arc(x,h/2,18,0,6.28); ctx.fill();
    }
    function beats(){ return sig.value==='6/8'?6:4; }
    function tickSound(accent=false){ const o=audioCtx.createOscillator(), g=audioCtx.createGain(), t=audioCtx.currentTime; o.type='square'; o.frequency.value=accent?1760:880; g.gain.setValueAtTime(0.001,t); g.gain.exponentialRampToValueAtTime(0.4,t+0.005); g.gain.exponentialRampToValueAtTime(0.001,t+0.08); o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t+0.09); }
    function loop(t){ if(!running) return; if(!last) last=t; const spb=60/Number(bpm.value); const elapsed=(t-last)/1000; if(elapsed>=spb){ last=t; tickSound(beat%beats()===0); beat=(beat+1)%beats(); } const prog=Math.min(elapsed/(60/Number(bpm.value)),1); draw(prog,beats()); requestAnimationFrame(loop); }
    toggle.addEventListener('click', ()=>{ running=!running; toggle.textContent=running?'Stop':'Start'; toggle.className=running?'btn':'btn play'; if(running){ setup(); last=0; beat=0; requestAnimationFrame(loop);} });
  }

  function recorder(){
    host.innerHTML = `<h3 style="margin-top:0">Record Yourself</h3>
      <div class="actions"><button id="rStart" class="btn play">● Start</button><button id="rStop" class="btn">■ Stop</button>
      <a id="rDL" class="btn pdf" href="#" download="take.webm" style="pointer-events:none;opacity:.6">Download</a></div>
      <div class="note">If the mic button doesn’t work, run from a local server (http://localhost) to enable permissions.</div>
      <audio id="rPlayer" controls style="width:100%;margin-top:10px"></audio>
      <div id="rLog" style="margin-top:6px;color:var(--muted)"></div>`;
    const start = document.getElementById('rStart'), stop = document.getElementById('rStop'), player = document.getElementById('rPlayer'), dl = document.getElementById('rDL'), log = document.getElementById('rLog');
    let media, rec, chunks=[];
    start.addEventListener('click', async ()=>{
      try{
        media = await navigator.mediaDevices.getUserMedia({audio:true});
        rec = new MediaRecorder(media); chunks=[];
        rec.ondataavailable = e => chunks.push(e.data);
        rec.onstop = () => { const blob=new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob); player.src=url; dl.href=url; dl.style.opacity=1; dl.style.pointerEvents='auto'; };
        rec.start(); log.textContent='Recording…';
      }catch(e){ log.textContent='Mic error: '+e.message; }
    });
    stop.addEventListener('click', ()=>{ if(rec && rec.state!=='inactive'){ rec.stop(); log.textContent='Stopped.'; if(media){ media.getTracks().forEach(t=>t.stop()); } } });
  }

  function tuner(){
    host.innerHTML = `<h3 style="margin-top:0">Tuner</h3>
      <div class="actions"><button id="tStart" class="btn play">Start Mic</button><button id="tStop" class="btn">Stop</button></div>
      <div class="note">Mic access requires running from http://localhost in some browsers.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px">
        <div class="tri-border section"><div style="font-size:48px;font-weight:900" id="nNote">--</div><div id="nFreq" style="color:var(--muted)">0 Hz</div></div>
        <div class="tri-border section"><div>Detune (cents)</div><div id="nCents" style="font-size:36px;font-weight:800">0</div></div>
      </div>`;
    const nNote = document.getElementById('nNote'), nFreq = document.getElementById('nFreq'), nCents = document.getElementById('nCents');
    let ctx, media, src, analyser, raf;
    function autoCorrelate(buf, sr){
      let SIZE=buf.length; let rms=0; for(let i=0;i<SIZE;i++){ let v=buf[i]; rms+=v*v; } rms=Math.sqrt(rms/SIZE); if(rms<0.01) return -1;
      let c=new Array(SIZE).fill(0); for(let i=0;i<SIZE;i++) for(let j=0;j<SIZE-i;j++) c[i]+=buf[j]*buf[j+i];
      let d=0; while(c[d]>c[d+1]) d++; let maxval=-1,maxpos=-1; for(let i=d;i<SIZE;i++){ if(c[i]>maxval){ maxval=c[i]; maxpos=i; } } return sr/maxpos;
    }
    const A4=440, names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    function nf(freq){ return Math.round(12*Math.log2(freq/A4))+69; }
    function fFrom(n){ return A4*Math.pow(2,(n-69)/12); }
    function cents(freq,n){ return Math.floor(1200*Math.log2(freq/fFrom(n))); }
    document.getElementById('tStart').addEventListener('click', async ()=>{
      try{
        ctx = ctx || new (window.AudioContext||window.webkitAudioContext)();
        media = await navigator.mediaDevices.getUserMedia({audio:true});
        src = ctx.createMediaStreamSource(media); analyser=ctx.createAnalyser(); analyser.fftSize=2048; src.connect(analyser); tick();
      }catch(e){ nFreq.textContent = 'Mic error: '+e.message; }
    });
    document.getElementById('tStop').addEventListener('click', ()=>{ cancelAnimationFrame(raf); if(media){ media.getTracks().forEach(t=>t.stop()); } });
    function tick(){ raf=requestAnimationFrame(tick); let data=new Float32Array(analyser.fftSize); analyser.getFloatTimeDomainData(data); const f=autoCorrelate(data, ctx.sampleRate); if(f>0){ const n=nf(f); nNote.textContent=names[n%12]+(Math.floor(n/12)-1); nFreq.textContent=f.toFixed(1)+' Hz'; nCents.textContent=cents(f,n); } }
  }

  // default tool
  studio();

  // Hide splash after a tick
  window.addEventListener('load', ()=>{
    const sp = document.getElementById('splash');
    if (sp) setTimeout(()=> sp.classList.add('hide'), 350);
  });
})();
