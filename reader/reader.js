/**
 * Another ALICE — Static Reader
 * Loads story-data.json and renders an illustrated reading experience.
 */

(function () {
  'use strict';

  let storyData = null;
  let currentSection = -1; // -1 = title, 0..n = chapters, n+1 = epilogue
  let totalSections = 0;

  // ---- DOM refs ----
  const titleScreen = document.getElementById('title-screen');
  const tocScreen = document.getElementById('toc-screen');
  const readerScreen = document.getElementById('reader-screen');
  const beginBtn = document.getElementById('begin-btn');
  const tocBtn = document.getElementById('toc-btn');
  const tocList = document.getElementById('toc-list');
  const tocEpilogueLink = document.getElementById('toc-epilogue-link');
  const chapterContent = document.getElementById('chapter-content');
  const chapterIndicator = document.getElementById('chapter-indicator');
  const progressCircle = document.getElementById('progress-circle');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const readerHeader = document.getElementById('reader-header');

  // ---- Load data ----
  async function init() {
    const resp = await fetch('story-data.json');
    storyData = await resp.json();
    totalSections = storyData.chapters.length + 1; // +1 for epilogue

    buildTOC();
    bindEvents();
    restoreProgress();
  }

  function buildTOC() {
    storyData.chapters.forEach((ch, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="toc-title">${ch.title}</span>`;
      li.addEventListener('click', () => goToSection(i));
      tocList.appendChild(li);
    });
    tocEpilogueLink.addEventListener('click', () => goToSection(storyData.chapters.length));
  }

  function bindEvents() {
    beginBtn.addEventListener('click', () => showTOC());
    tocBtn.addEventListener('click', () => showTOC());
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (readerScreen.classList.contains('active')) {
          e.preventDefault();
          navigate(1);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (readerScreen.classList.contains('active')) navigate(-1);
      }
      if (e.key === 'Escape') {
        if (readerScreen.classList.contains('active')) showTOC();
      }
    });

    // Header hide on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const st = window.scrollY;
      if (st > lastScroll && st > 100) {
        readerHeader.classList.add('hidden');
      } else {
        readerHeader.classList.remove('hidden');
      }
      lastScroll = st;
    });
  }

  // ---- Navigation ----
  function showScreen(screen) {
    [titleScreen, tocScreen, readerScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }

  function showTOC() {
    showScreen(tocScreen);
  }

  function goToSection(index) {
    currentSection = index;
    saveProgress();
    renderSection(index);
    showScreen(readerScreen);
    updateNav();
    updateProgress();
  }

  function navigate(dir) {
    const next = currentSection + dir;
    if (next < 0 || next > storyData.chapters.length) return;
    goToSection(next);
  }

  function updateNav() {
    prevBtn.disabled = currentSection <= 0;
    nextBtn.disabled = currentSection >= storyData.chapters.length; // epilogue is last

    if (currentSection < storyData.chapters.length) {
      const ch = storyData.chapters[currentSection];
      chapterIndicator.textContent = `Chapter ${ch.number}`;
    } else {
      chapterIndicator.textContent = 'Epilogue';
    }
  }

  function updateProgress() {
    const pct = (currentSection + 1) / totalSections;
    const circumference = 2 * Math.PI * 10;
    progressCircle.style.strokeDashoffset = circumference * (1 - pct);
  }

  // ---- Render ----
  function renderSection(index) {
    chapterContent.innerHTML = '';

    if (index < storyData.chapters.length) {
      renderChapter(storyData.chapters[index]);
    } else {
      renderEpilogue();
    }

    // Trigger fade-in with IntersectionObserver
    requestAnimationFrame(() => {
      observeElements();
    });
  }

  function renderChapter(chapter) {
    const images = storyData.images[String(chapter.number)] || [];

    // Chapter heading
    const heading = document.createElement('div');
    heading.className = 'chapter-heading';
    heading.innerHTML = `
      <span class="chapter-number">Chapter ${chapter.number}</span>
      <h2 class="chapter-title">${chapter.title}</h2>
      <span class="chapter-rule"></span>
    `;
    chapterContent.appendChild(heading);

    // Paragraphs with interspersed illustrations
    chapter.paragraphs.forEach((text, i) => {
      // Check if an image should appear before this paragraph
      images.forEach(img => {
        if (img.after_para === i) {
          chapterContent.appendChild(createIllustration(img));
        }
      });

      chapterContent.appendChild(createParagraph(text, false));
    });

    // Any remaining images that go after the last paragraph
    images.forEach(img => {
      if (img.after_para >= chapter.paragraphs.length) {
        chapterContent.appendChild(createIllustration(img));
      }
    });
  }

  function renderEpilogue() {
    const heading = document.createElement('div');
    heading.className = 'epilogue-heading';
    heading.innerHTML = `
      <span class="epilogue-label">Epilogue</span>
      <span class="epilogue-rule"></span>
    `;
    chapterContent.appendChild(heading);

    const images = storyData.epilogue_images || [];

    storyData.epilogue.forEach((text, i) => {
      images.forEach(img => {
        if (img.after_para === i) {
          chapterContent.appendChild(createIllustration(img));
        }
      });

      chapterContent.appendChild(createParagraph(text, true));
    });

    // End screen
    const end = document.createElement('div');
    end.className = 'end-screen';
    end.innerHTML = `
      <p class="end-title">Another ALICE</p>
      <p class="end-author">by Shawn Jordan</p>
    `;
    chapterContent.appendChild(end);
  }

  function createParagraph(text, isEpilogue) {
    const p = document.createElement('p');

    // Detect ALICE speech (ALL CAPS lines, often short)
    const isAliceSpeech = /^[A-Z\s,.'!?—\-–]+$/.test(text.trim()) && text.trim().length < 200;
    // Detect fragmented radio messages
    const isRadio = /^-\s+\w+\s+-/.test(text.trim());

    if (isAliceSpeech && !isEpilogue) {
      p.className = 'alice-speech';
      p.textContent = text.trim();
    } else if (isRadio) {
      p.className = 'radio-fragment';
      p.textContent = text.trim();
    } else {
      p.className = isEpilogue ? 'epilogue-paragraph' : 'story-paragraph';
      // Handle [add more here] flag
      if (text.includes('[add more here]')) {
        const parts = text.split('[add more here]');
        p.innerHTML = escapeHtml(parts[0]) +
          '<span class="flag-marker">[placeholder]</span>' +
          escapeHtml(parts[1] || '');
      } else {
        p.textContent = text;
      }
    }

    return p;
  }

  function createIllustration(img) {
    const container = document.createElement('div');
    container.className = 'illustration-container';
    container.innerHTML = `
      <img class="illustration" src="images/${img.file}" alt="${escapeHtml(img.alt)}" loading="lazy"
        onerror="this.parentElement.style.display='none'">
      <p class="illustration-caption">${escapeHtml(img.alt)}</p>
    `;
    return container;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Intersection Observer for fade-in ----
  function observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    chapterContent.querySelectorAll('.story-paragraph, .epilogue-paragraph, .illustration-container').forEach(el => {
      observer.observe(el);
    });
  }

  // ---- Progress persistence ----
  function saveProgress() {
    try {
      localStorage.setItem('anotheralice-section', String(currentSection));
    } catch (e) { /* ignore */ }
  }

  function restoreProgress() {
    try {
      const saved = localStorage.getItem('anotheralice-section');
      if (saved !== null) {
        // Show title screen but user can pick up where they left off
      }
    } catch (e) { /* ignore */ }
  }

  // ---- Boot ----
  init();
})();
