/* ────────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR — dot + ring + glowing trail
   ──────────────────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
  spawnTrail(mouseX, mouseY);
});

function animateRing() {
  const lerpFactor = 0.12;
  ringX += (mouseX - ringX) * lerpFactor;
  ringY += (mouseY - ringY) * lerpFactor;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mouseover', function(e) {
  if (e.target.closest('a, button, .skill-icon-bg, .project-card, .flip-card, .social-link, .btn, .theme-toggle')) {
    document.body.classList.add('cursor-hover');
  }
});
document.addEventListener('mouseout', function(e) {
  if (e.target.closest('a, button, .skill-icon-bg, .project-card, .flip-card, .social-link, .btn, .theme-toggle')) {
    document.body.classList.remove('cursor-hover');
  }
});

let lastTrail = 0;
function spawnTrail(x, y) {
  const now = Date.now();
  if (now - lastTrail < 55) return;
  lastTrail = now;
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.left = x + 'px';
  dot.style.top  = y + 'px';
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
}

/* ────────────────────────────────────────────────────────────────
   2. THEME TOGGLE — Dark / Light mode
   ──────────────────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});

/* ────────────────────────────────────────────────────────────────
   3. TYPEWRITER — Interactive IDE code snippets
   ──────────────────────────────────────────────────────────────── */
const ideCodeEl  = document.getElementById('ideCode');
const lineNumsEl = document.getElementById('lineNums');

const snippets = [
  [
    '<span class="tok-kw">import</span> <span class="tok-fn">React</span> <span class="tok-kw">from</span> <span class="tok-str">\'react\'</span>;',
    '',
    '<span class="tok-cmnt">// Meet Aya — Frontend Developer</span>',
    '<span class="tok-kw">const</span> <span class="tok-fn">Aya</span> <span class="tok-punct">=</span> <span class="tok-punct">()</span> <span class="tok-punct">=&gt;</span> <span class="tok-punct">{</span>',
    '  <span class="tok-kw">const</span> skills <span class="tok-punct">=</span> <span class="tok-punct">[</span>',
    '    <span class="tok-str">\'React\'</span><span class="tok-punct">,</span> <span class="tok-str">\'CSS\'</span><span class="tok-punct">,</span>',
    '    <span class="tok-str">\'JavaScript\'</span><span class="tok-punct">,</span>',
    '    <span class="tok-str">\'UI/UX Design\'</span>',
    '  <span class="tok-punct">];</span>',
    '  <span class="tok-kw">return</span> <span class="tok-tag">&lt;Portfolio</span> <span class="tok-attr">skills</span><span class="tok-punct">={</span>skills<span class="tok-punct">}</span> <span class="tok-tag">/&gt;</span><span class="tok-punct">;</span>',
    '<span class="tok-punct">};</span>',
  ],
  [
    '<span class="tok-cmnt">/* Aya\'s Design System */</span>',
    '<span class="tok-prop">:root</span> <span class="tok-punct">{</span>',
    '  <span class="tok-attr">--cyan</span><span class="tok-punct">:</span>    <span class="tok-str">#00ffd5</span><span class="tok-punct">;</span>',
    '  <span class="tok-attr">--magenta</span><span class="tok-punct">:</span> <span class="tok-str">#ff3cac</span><span class="tok-punct">;</span>',
    '  <span class="tok-attr">--passion</span><span class="tok-punct">:</span> <span class="tok-str">infinite</span><span class="tok-punct">;</span>',
    '<span class="tok-punct">}</span>',
    '',
    '<span class="tok-prop">.hero</span> <span class="tok-punct">{</span>',
    '  <span class="tok-attr">animation</span><span class="tok-punct">:</span> <span class="tok-fn">glow</span>',
    '    <span class="tok-num">3s</span> <span class="tok-str">ease-in-out</span>',
    '    <span class="tok-str">infinite alternate</span><span class="tok-punct">;</span>',
    '<span class="tok-punct">}</span>',
  ],
];

let snippetIdx = 0, lineIdx = 0, charIdx = 0, isDeleting = false, pause = false;

function buildDisplay(renderedLines, partial) {
  const all = [...renderedLines, partial + '<span class="tok-cursor"></span>'];
  ideCodeEl.innerHTML = all.join('\n');
  lineNumsEl.innerHTML = all.map((_, i) => i + 1).join('<br>');
}

function typeStep() {
  if (pause) { setTimeout(typeStep, 1800); pause = false; return; }
  const snippetLines = snippets[snippetIdx];
  if (!isDeleting) {
    const currentLine = snippetLines[lineIdx] || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentLine;
    const visibleText = tempDiv.textContent || '';
    let partial = charIdx >= visibleText.length ? currentLine : revealHTML(currentLine, charIdx);
    buildDisplay(snippetLines.slice(0, lineIdx), partial);
    charIdx++;
    if (charIdx > visibleText.length + 2) {
      charIdx = 0; lineIdx++;
      if (lineIdx >= snippetLines.length) {
        pause = true; isDeleting = true; lineIdx = snippetLines.length - 1;
        setTimeout(typeStep, 1800); return;
      }
    }
    setTimeout(typeStep, 38 + Math.random() * 30);
  } else {
    buildDisplay(snippetLines.slice(0, lineIdx), '');
    lineIdx--;
    if (lineIdx < 0) {
      isDeleting = false; lineIdx = 0; charIdx = 0;
      snippetIdx = (snippetIdx + 1) % snippets.length;
    }
    setTimeout(typeStep, 55);
  }
}

function revealHTML(html, n) {
  let count = 0, result = '', inTag = false;
  for (let i = 0; i < html.length; i++) {
    const ch = html[i];
    if (ch === '<') inTag = true;
    result += ch;
    if (ch === '>') { inTag = false; continue; }
    if (!inTag) { count++; if (count >= n) break; }
  }
  const opens  = (result.match(/<span[^>]*>/g) || []).length;
  const closes = (result.match(/<\/span>/g) || []).length;
  result += '</span>'.repeat(Math.max(0, opens - closes));
  return result;
}

setTimeout(typeStep, 800);

/* ────────────────────────────────────────────────────────────────
   4. PROJECTS — Mockup Slideshow
   ──────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const laptopSlides = document.querySelectorAll('#laptopSlides .ms-slide');
  const mobileSlides = document.querySelectorAll('#mobileSlides .ms-slide');
  const dots         = document.querySelectorAll('.ms-dot-nav');
  if (!laptopSlides.length) return;

  let current = 0;

  function goTo(i) {
    laptopSlides[current].classList.remove('active');
    mobileSlides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + laptopSlides.length) % laptopSlides.length;
    laptopSlides[current].classList.add('active');
    mobileSlides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));
  setInterval(() => goTo(current + 1), 3500);
});

/* ────────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — Intersection Observer
   ──────────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ────────────────────────────────────────────────────────────────
   6. CONTACT FORM — submit handler
   ──────────────────────────────────────────────────────────────── */
const form = document.getElementById("my-form");
async function handleSubmit(event) {
  event.preventDefault();  
  
  const status = event.target.querySelector('.btn-submit');
  const data = new FormData(event.target);

  // إرسال البيانات إلى Formspree
  fetch(event.target.action, {
    method: 'POST',
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.textContent = '✓ Message Sent!';
      status.style.background = 'linear-gradient(90deg, #00ffd5, #00c4ff)';
      form.reset();  
      setTimeout(() => {
        status.textContent = 'Send Message ✦';
        status.style.background = '';
      }, 3000);
    } else {
      status.textContent = 'Oops! Error';
      status.style.background = 'red';
    }
  }).catch(error => {
    status.textContent = 'Oops! Error';
  });
}

form.addEventListener("submit", handleSubmit);

/* ────────────────────────────────────────────────────────────────
   7. NAV LINKS — smooth active state on scroll
   ──────────────────────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
  });
}

window.addEventListener('scroll', updateNav, { passive: true });




  (function() {
    const counters = document.querySelectorAll(".about-stat-num[data-target]");
    if (!counters.length) return;
    const animateCount = (el) => {
      const target = +el.dataset.target;
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
      }, 16);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { counters.forEach(animateCount); observer.disconnect(); }
      });
    }, { threshold: 0.3 });
    const section = document.querySelector(".about-section");
    if (section) observer.observe(section);
  })();