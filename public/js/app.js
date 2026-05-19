document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('presentationContainer');
  const progressBar = document.getElementById('progressBar');
  const slideCounter = document.getElementById('slideCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnReset = document.getElementById('btnReset');

  let currentIndex = 0;
  let direction = 'forward';
  const initializedDemos = new Set();

  function buildSlides() {
    SLIDES.forEach((slide, i) => {
      const section = document.createElement('section');
      section.className = 'slide' + (i === 0 ? ' active' : '');
      section.id = `slide-${slide.id}`;
      section.dataset.slideIndex = i;
      section.innerHTML = slide.html;
      container.appendChild(section);
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= SLIDES.length) return;
    direction = index > currentIndex ? 'forward' : 'backward';

    const slides = container.querySelectorAll('.slide');
    slides[currentIndex].classList.remove('active', 'slide-reverse');
    currentIndex = index;

    const next = slides[currentIndex];
    next.classList.remove('slide-reverse');
    if (direction === 'backward') next.classList.add('slide-reverse');
    next.classList.add('active');

    updateUI();
    initDemoIfNeeded();
  }

  function updateUI() {
    const pct = ((currentIndex + 1) / SLIDES.length) * 100;
    progressBar.style.width = `${pct}%`;
    slideCounter.textContent = `${currentIndex + 1} / ${SLIDES.length}`;
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === SLIDES.length - 1;
  }

  function initDemoIfNeeded() {
    const slide = SLIDES[currentIndex];
    if (!slide.demoInit || initializedDemos.has(slide.id)) return;

    initializedDemos.add(slide.id);

    switch (slide.demoInit) {
      case 'sqli-login':
        SQLiDemo.initLogin(document.getElementById('demo-sqli-login'));
        break;
      case 'sqli-search':
        SQLiDemo.initSearch(document.getElementById('demo-sqli-search'));
        break;
      case 'sqli-blind':
        SQLiDemo.initBlind(document.getElementById('demo-sqli-blind'));
        break;
      case 'xss-reflected':
        XSSDemo.initReflected(document.getElementById('demo-xss-reflected'));
        break;
      case 'xss-stored':
        XSSDemo.initStored(document.getElementById('demo-xss-stored'));
        break;
      case 'csrf':
        CSRFDemo.init(document.getElementById('demo-csrf'));
        break;
      case 'bruteforce':
        BruteForceDemo.init(document.getElementById('demo-bruteforce'));
        break;
      case 'exfiltration':
        ExfiltrationDemo.init(document.getElementById('demo-exfiltration'));
        break;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(SLIDES.length - 1);
    }
  });

  btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
  btnNext.addEventListener('click', () => goToSlide(currentIndex + 1));
  btnReset.addEventListener('click', async () => {
    await fetch('/api/reset-db');
    initializedDemos.clear();
    const slides = container.querySelectorAll('.slide');
    slides.forEach(s => {
      const demoContainer = s.querySelector('[id^="demo-"]');
      if (demoContainer) demoContainer.innerHTML = '';
    });
    goToSlide(currentIndex);
  });

  buildSlides();
  updateUI();
  initDemoIfNeeded();
});
