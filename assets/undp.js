/* ACA UNDP deck engine.
   index.html sets window.DECK = {footer, slides:[{type, cls, dark, html}]}.
   type: cover | section | statement | myth | task | plain (default).
   Present: arrows/space/click move forward, left arrow back, F fullscreen, Home/End.
   Review (?review): every slide stacked in order on one scrolling page. */
(function(){
  const D = window.DECK || {slides:[]};
  const stage = document.querySelector('.stage');
  const total = D.slides.length;
  const tef = D.logo || 'assets/img/tef-logo.png';

  D.slides.forEach((s,k)=>{
    const el = document.createElement('section');
    const type = s.type || 'plain';
    el.className = ['slide', type, s.dark || type==='section' || type==='myth' ? 'dark' : '', s.cls||''].join(' ');
    el.innerHTML = s.html + (type==='cover' ? '' :
      `<div class="foot"><img src="${tef}" alt="Technological Education Foundation"><span>${D.footer||''}</span><span class="sep"></span><span class="pg">${k+1} / ${total}</span></div>`);
    stage.appendChild(el);
  });

  const slides = [...stage.querySelectorAll('.slide')];

  if (new URLSearchParams(location.search).has('review')) {
    document.body.classList.add('review');
    slides.forEach((el,k)=>{
      const item = document.createElement('div'); item.className = 'rv-item'; item.id = 's'+(k+1);
      const frame = document.createElement('div'); frame.className = 'rv-frame';
      stage.insertBefore(item, el); frame.appendChild(el); item.appendChild(frame);
      el.classList.add('active');
      const n = document.createElement('div'); n.className = 'rv-note';
      n.innerHTML = `<span class="rv-num">${k+1} / ${total}</span>`;
      item.appendChild(n);
    });
    const fitR = ()=>{ const z = Math.min(1, (innerWidth-48)/1280); document.querySelectorAll('.rv-frame').forEach(f=>f.style.zoom = z); };
    addEventListener('resize', fitR); fitR();
    return;
  }

  const prog = document.getElementById('prog');
  let i = 0;
  function fit(){
    const s = Math.min(innerWidth/1280, innerHeight/720);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  function show(n){
    i = Math.max(0, Math.min(total-1, n));
    slides.forEach((el,k)=>el.classList.toggle('active', k===i));
    prog.style.width = ((i+1)/total*100)+'%';
    history.replaceState(null,'','#'+(i+1));
  }
  addEventListener('resize', fit); fit();
  addEventListener('hashchange', ()=>{ const n=(parseInt(location.hash.slice(1))||1)-1; if(n!==i) show(n); });
  addEventListener('keydown', e=>{
    const k = e.key;
    if(k==='ArrowRight'||k==='ArrowDown'||k===' '||k==='PageDown'){e.preventDefault();show(i+1);}
    else if(k==='ArrowLeft'||k==='ArrowUp'||k==='PageUp'){e.preventDefault();show(i-1);}
    else if(k==='Home') show(0);
    else if(k==='End') show(total-1);
    else if(k.toLowerCase()==='f'){ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  });
  stage.addEventListener('click', e=>{ if(!e.target.closest('a')) show(i+1); });
  show((parseInt(location.hash.slice(1))||1)-1);
})();
