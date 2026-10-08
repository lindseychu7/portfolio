document.addEventListener('DOMContentLoaded', () => {
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  const SITE_PASSWORD = 'nycdesigner';
  const gate = document.getElementById('passwordGate');
  if (gate) {
    const form = document.getElementById('passwordForm');
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('passwordError');

    if (sessionStorage.getItem('site-unlocked') === 'true') {
      gate.hidden = true;
    } else {
      document.body.classList.add('is-locked');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value === SITE_PASSWORD) {
        sessionStorage.setItem('site-unlocked', 'true');
        gate.hidden = true;
        document.body.classList.remove('is-locked');
      } else {
        error.hidden = false;
        input.value = '';
        input.focus();
      }
    });
  }

  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
    });
  }

  const navDropdown = document.querySelector('.nav__dropdown');
  const navDropdownTrigger = document.querySelector('.nav__dropdown-trigger');
  if (navDropdown && navDropdownTrigger) {
    navDropdownTrigger.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 720px)').matches) {
        e.preventDefault();
        navDropdown.classList.toggle('is-open');
      }
    });
  }

  const pauseBtn = document.querySelector('.hero__pause');
  const blobs = document.querySelector('.hero__blobs');
  if (pauseBtn && blobs) {
    pauseBtn.addEventListener('click', () => {
      blobs.classList.toggle('is-paused');
      pauseBtn.textContent = blobs.classList.contains('is-paused') ? '▶' : '⏸';
    });
  }

  function openAccordionPanel(item, panel) {
    item.open = true;
    requestAnimationFrame(() => {
      item.classList.add('is-open');
    });
  }
  function closeAccordionPanel(item, panel) {
    item.classList.remove('is-open');
    panel.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'grid-template-rows') return;
      item.open = false;
      panel.removeEventListener('transitionend', handler);
    });
  }
  document.querySelectorAll('.accordion').forEach((group) => {
    const items = Array.from(group.querySelectorAll('.accordion__item'));
    items.forEach((item) => {
      const summary = item.querySelector('.accordion__trigger');
      const panel = item.querySelector('.accordion__panel');
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = !item.open;
        if (willOpen) {
          items.forEach((other) => {
            if (other !== item && other.open) closeAccordionPanel(other, other.querySelector('.accordion__panel'));
          });
          openAccordionPanel(item, panel);
        } else {
          closeAccordionPanel(item, panel);
        }
      });
    });
  });

  document.querySelectorAll('.reveal-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-revealed');
    });
  });

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightboxImg.hidden = false;
      if (lightboxVideo) lightboxVideo.hidden = true;
      lightbox.classList.add('is-open');
      document.body.classList.add('is-locked');
    }
    function openLightboxVideo(src) {
      if (!lightboxVideo) return;
      lightboxVideo.querySelector('source').src = src;
      lightboxVideo.load();
      lightboxVideo.hidden = false;
      lightboxImg.hidden = true;
      lightbox.classList.add('is-open');
      document.body.classList.add('is-locked');
      lightboxVideo.play();
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      lightboxImg.src = '';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.querySelector('source').src = '';
        lightboxVideo.load();
      }
    }

    document.querySelectorAll('.lightbox-trigger').forEach((el) => {
      el.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 820px)').matches) return;
        if (el.tagName === 'VIDEO') {
          openLightboxVideo(el.querySelector('source').src);
        } else {
          openLightbox(el.src, el.alt);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  document.querySelectorAll('.design-system-slideshow__img').forEach((img) => {
    const images = img.dataset.images.split(',');
    let index = 0;
    let intervalId = null;
    const container = img.closest('.design-system-slideshow');

    container.addEventListener('mouseenter', () => {
      intervalId = window.setInterval(() => {
        index = (index + 1) % images.length;
        img.src = images[index];
      }, 1500);
    });

    container.addEventListener('mouseleave', () => {
      window.clearInterval(intervalId);
      index = 0;
      img.src = images[0];
    });
  });

  document.querySelectorAll('.eyesweep-video__media').forEach((video) => {
    const container = video.closest('.eyesweep-video');

    container.addEventListener('mouseenter', () => {
      video.play();
    });

    container.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  const bubblePresets = {
    default: { countMin: 10, countMax: 16, extraMin: 16, extraMax: 106, sizeMin: 8, sizeMax: 50, floatRange: 18 },
    compact: { countMin: 6, countMax: 10, extraMin: 6, extraMax: 32, sizeMin: 5, sizeMax: 21, floatRange: 8 },
    photo: { countMin: 14, countMax: 20, extraMin: 14, extraMax: 80, sizeMin: 7, sizeMax: 36, floatRange: 16 },
  };
  const bubbleColors = ['var(--lavender-50)', 'var(--lavender-200)', 'var(--lavender-400)'];

  function initBubbleHover(wrap, boundsEl, field, presetName) {
    const preset = bubblePresets[presetName] || bubblePresets.default;
    let hideTimeout = null;

    function spawnBubbles() {
      field.innerHTML = '';
      field.classList.remove('is-hidden');
      const rect = boundsEl.getBoundingClientRect();
      const halfW = rect.width / 2 + 8;
      const halfH = rect.height / 2 + 8;
      const count = preset.countMin + Math.floor(Math.random() * (preset.countMax - preset.countMin));

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const clearance = Math.sqrt(
          (halfW * Math.cos(angle)) ** 2 + (halfH * Math.sin(angle)) ** 2
        );
        const dist = clearance + preset.extraMin + Math.random() * (preset.extraMax - preset.extraMin);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = preset.sizeMin + Math.random() * (preset.sizeMax - preset.sizeMin);

        const bubble = document.createElement('span');
        bubble.className = 'bubble';
        bubble.style.setProperty('--x', x.toFixed(1) + 'px');
        bubble.style.setProperty('--y', y.toFixed(1) + 'px');
        bubble.style.setProperty('--size', size.toFixed(1) + 'px');
        const floatRange = preset.floatRange;
        bubble.style.setProperty('--fx', (Math.random() * floatRange - floatRange / 2).toFixed(1) + 'px');
        bubble.style.setProperty('--fy', (Math.random() * floatRange - floatRange / 2).toFixed(1) + 'px');
        bubble.style.setProperty('--delay', (Math.random() * 0.3).toFixed(2) + 's');
        bubble.style.setProperty('--float-duration', (2.2 + Math.random() * 1.8).toFixed(2) + 's');
        bubble.style.setProperty('--max-opacity', (0.35 + Math.random() * 0.45).toFixed(2));
        bubble.style.setProperty('--bubble-color', bubbleColors[Math.floor(Math.random() * bubbleColors.length)]);
        field.appendChild(bubble);
      }
    }

    wrap.addEventListener('mouseenter', () => {
      window.clearTimeout(hideTimeout);
      spawnBubbles();
    });

    wrap.addEventListener('mouseleave', () => {
      field.classList.add('is-hidden');
      hideTimeout = window.setTimeout(() => {
        field.innerHTML = '';
      }, 300);
    });
  }

  document.querySelectorAll('.bubble-cta').forEach((wrap) => {
    const link = wrap.querySelector('a');
    const field = wrap.querySelector('.bubble-field');
    if (!link || !field) return;
    const presetName = wrap.classList.contains('bubble-cta--compact') ? 'compact' : 'default';
    initBubbleHover(wrap, link, field, presetName);
  });

  let activeAboutTarget = null;

  function activateAboutTarget(target) {
    activeAboutTarget = target;
    document.querySelectorAll('.about-arrow').forEach((arrow) => {
      const match = arrow.dataset.target === target;
      arrow.classList.toggle('is-bold', match);
      arrow.classList.toggle('is-faded', !match);
    });
    document.querySelectorAll('.about-panel').forEach((panel) => {
      panel.classList.toggle('is-visible', panel.dataset.panel === target);
    });
    document.querySelectorAll('.about-photo-wrap').forEach((w) => {
      w.classList.toggle('is-active', w.dataset.target === target);
    });
  }

  function deactivateAboutTarget() {
    activeAboutTarget = null;
    document.querySelectorAll('.about-arrow').forEach((arrow) => {
      arrow.classList.remove('is-bold', 'is-faded');
    });
    document.querySelectorAll('.about-panel').forEach((panel) => {
      panel.classList.remove('is-visible');
    });
    document.querySelectorAll('.about-photo-wrap').forEach((w) => {
      w.classList.remove('is-active');
    });
  }

  document.querySelectorAll('.about-photo-wrap').forEach((wrap) => {
    const img = wrap.querySelector('img');
    const field = wrap.querySelector('.bubble-field');
    const target = wrap.dataset.target;
    if (img && field) initBubbleHover(wrap, img, field, 'photo');

    if (supportsHover) {
      wrap.addEventListener('mouseenter', () => activateAboutTarget(target));
      wrap.addEventListener('mouseleave', () => deactivateAboutTarget());
    } else {
      wrap.addEventListener('click', () => {
        if (activeAboutTarget === target) {
          deactivateAboutTarget();
        } else {
          activateAboutTarget(target);
        }
      });
    }
  });

  document.querySelectorAll('.mockup-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.mockup-carousel__track');
    const prevBtn = carousel.querySelector('.mockup-carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.mockup-carousel__arrow--next');
    const dotsContainer = carousel.parentElement.querySelector('.mockup-carousel__dots');
    const captionEl = carousel.parentElement.querySelector('.mockup-carousel__caption');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const images = track.dataset.images.split(',');
    const captions = track.dataset.captions ? track.dataset.captions.split(',') : [];
    const slides = [images[images.length - 1], ...images, images[0]];
    let index = 1;

    slides.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'FAA dashboard mockup';
      track.appendChild(img);
    });

    const dots = images.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mockup-carousel__dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i + 1));
      dotsContainer.appendChild(dot);
      return dot;
    });

    function updateDots() {
      const realIndex = (index - 1 + images.length) % images.length;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === realIndex));
      if (captionEl && captions[realIndex]) captionEl.textContent = captions[realIndex];
    }

    function setTrack(withTransition) {
      track.style.transition = withTransition ? '' : 'none';
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }

    function goTo(newIndex) {
      index = newIndex;
      setTrack(true);
      updateDots();
    }

    track.addEventListener('transitionend', () => {
      if (index === 0) {
        index = images.length;
        setTrack(false);
      } else if (index === images.length + 1) {
        index = 1;
        setTrack(false);
      }
    });

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    setTrack(false);
    updateDots();
  });

  if (!supportsHover) {
    document.querySelectorAll('.showcase-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const wasActive = tile.classList.contains('is-active');
        document.querySelectorAll('.showcase-tile.is-active').forEach((t) => t.classList.remove('is-active'));
        if (!wasActive) tile.classList.add('is-active');
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//.test(href)) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname && url.hash) return;

    e.preventDefault();
    document.body.classList.add('is-fading-out');
    window.setTimeout(() => {
      window.location.href = href;
    }, 100);
  });
});
