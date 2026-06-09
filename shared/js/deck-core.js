(function() {
  // Ensure DATA exists before running
  if (typeof DATA === 'undefined' || !DATA.slides) {
    console.error('deck-core.js: Globals "DATA" or "DATA.slides" are not defined.');
    return;
  }

  const deck = document.getElementById('deck');
  if (!deck) {
    console.error('deck-core.js: Element "#deck" not found in HTML.');
    return;
  }

  const slides = DATA.slides;
  
  // Render function
  function render() {
    deck.innerHTML = ''; // Clear previous rendering if any
    slides.forEach((s, idx) => {
      const el = document.createElement('section');
      el.className = 'slide ' + s.type;
      
      let html = '';
      if (s.type === 'cover') {
        const categoryTag = DATA.categoryTag || '學術報告簡報 · Academic Report';
        const metaInfo = DATA.metaInfo || `資料來源｜${DATA.reportTitle}<br>製作方式｜AI 協同製作`;
        
        html += `<div class="badge"><span class="dot"></span>${categoryTag}</div>`;
        html += `<h1>${s.title}</h1>`;
        if (s.subtitle) html += `<div class="subtitle">${s.subtitle}</div>`;
        html += `<div class="rule"></div>`;
        if (s.body) html += `<div class="body">${s.body}</div>`;
        html += `<div class="meta">${metaInfo}</div>`;
      } else if (s.type === 'section') {
        html += `<div class="num">${s.num || ''}</div>`;
        html += `<h2>${s.title}</h2>`;
        html += `<div class="rule"></div>`;
      } else {
        const defaultKick = {
          content: '論述',
          toc: '導覽',
          comparison: '整合分析',
          conclusion: '總結',
          references: '引用'
        };
        const kick = defaultKick[s.type] || '論述';
        html += `<div class="kicker">${kick}</div>`;
        html += `<h2>${s.title}</h2>`;
        if (s.body) html += `<div class="body">${s.body}</div>`;
        if (s.bullets) {
          html += '<ul class="bullets">';
          s.bullets.forEach((b, i) => html += `<li style="--i:${i}">${b}</li>`);
          html += '</ul>';
        }
      }
      
      if (s.note) {
        html += `<div class="note"><span class="tag">講者備註</span><span>${s.note}</span></div>`;
      }
      
      el.innerHTML = html;
      deck.appendChild(el);
    });
  }

  render();

  let cur = 0;
  const els = Array.from(document.querySelectorAll('.slide'));
  
  const totalEl = document.getElementById('total');
  if (totalEl) totalEl.textContent = slides.length;
  
  const bar = document.getElementById('bar');
  const curEl = document.getElementById('cur');

  function show(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n));
    els.forEach((e, i) => e.classList.toggle('active', i === cur));
    
    if (curEl) curEl.textContent = cur + 1;
    if (bar) bar.style.width = ((cur) / (slides.length - 1) * 100) + '%';
    
    location.hash = cur + 1;
  }

  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }

  // Wire buttons
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (prevBtn) prevBtn.onclick = prev;
  if (nextBtn) nextBtn.onclick = next;

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      show(0);
    } else if (e.key === 'End') {
      show(slides.length - 1);
    } else if (e.key.toLowerCase() === 'f') {
      toggleFs();
    } else if (e.key.toLowerCase() === 'n') {
      document.body.classList.toggle('notes');
    } else if (e.key.toLowerCase() === 'o') {
      toggleOverview();
    }
  });

  function toggleFs() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  // Click navigation (left / right halves)
  deck.addEventListener('click', e => {
    if (e.target.closest('.navbtn')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.6) next(); 
    else if (x < 0.4) prev();
  });

  // Swipe gesture navigation
  let tx = null;
  deck.addEventListener('touchstart', e => tx = e.touches[0].clientX);
  deck.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
    tx = null;
  });

  // Overview grid overlay
  let overlay = null;
  function toggleOverview() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      return;
    }
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(8,12,20,.97);z-index:50;overflow:auto;padding:4vh 4vw;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px';
    
    slides.forEach((s, i) => {
      const c = document.createElement('button');
      c.style.cssText = 'text-align:left;background:var(--panel, #16233a);border:1px solid var(--line, #26384f);border-radius:10px;padding:14px;color:var(--ink, #eef3fb);cursor:pointer;font-family:inherit;min-height:110px';
      
      const categoryTag = (s.type === 'cover') ? 'COVER' : s.type.toUpperCase();
      c.innerHTML = `<div style="font-size:.7rem;color:var(--accent, #5ad1c4);letter-spacing:.15em">${String(i + 1).padStart(2, '0')} · ${categoryTag}</div><div style="margin-top:8px;font-size:.95rem;line-height:1.4">${s.title}</div>`;
      
      c.onclick = () => {
        show(i);
        toggleOverview();
      };
      overlay.appendChild(c);
    });
    document.body.appendChild(overlay);
  }

  // Initial show based on URL hash
  const fromHash = parseInt(location.hash.replace('#', '')) || 1;
  show(fromHash - 1);
})();
