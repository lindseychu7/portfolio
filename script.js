document.addEventListener('DOMContentLoaded', () => {
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

  const pauseBtn = document.querySelector('.hero__pause');
  const blobs = document.querySelector('.hero__blobs');
  if (pauseBtn && blobs) {
    pauseBtn.addEventListener('click', () => {
      blobs.classList.toggle('is-paused');
      pauseBtn.textContent = blobs.classList.contains('is-paused') ? '▶' : '⏸';
    });
  }

  const heroChar = document.getElementById('heroCharacter');
  if (heroChar) {
    const stops = [8, 47, 84]; // kitchen, park, bed (left %)
    let current = 0;
    heroChar.style.left = stops[current] + '%';

    function walk() {
      let next;
      do { next = Math.floor(Math.random() * stops.length); } while (next === current);
      const goingRight = stops[next] > stops[current];
      heroChar.classList.toggle('is-flipped', !goingRight);
      heroChar.classList.add('is-walking');
      heroChar.style.left = stops[next] + '%';
      current = next;
    }

    heroChar.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'left') return;
      heroChar.classList.remove('is-walking');
      const pause = 1800 + Math.random() * 3000;
      window.setTimeout(walk, pause);
    });

    window.setTimeout(walk, 1500);
  }
});
