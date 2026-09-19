/* ==========================================================================
   HACKTOBERFEST 2026 - ACM MEDICAPS UNIVERSITY SHOWCASE SCRIPT
   Incorporates Three.js Shader Dissolve, Lenis Smooth Scroll, GSAP ScrollTrigger,
   Interactive Git Simulator, Ticket Pass Generator & Live Countdown Clock
   ========================================================================== */

// Register GSAP Plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   1. LENIS SMOOTH SCROLL & GSAP SYNC
   ========================================================================== */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });
}

/* ==========================================================================
   2. THREE.JS SHADER DISSOLVE EFFECT (From Attached Zip Code)
   ========================================================================== */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
    
    // Dissolve threshold increases as uProgress moves from 0 to 1
    float noiseValue = fbm(centeredUv * 15.0);
    float threshold = (1.0 - uv.y) - (1.0 - uProgress * 1.15);
    float d = threshold + noiseValue * uSpread;
    
    float pixelSize = 1.0 / uResolution.y;
    float alpha = smoothstep(-pixelSize, pixelSize, d);
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// Configuration for dissolve color (Cream dissolve #F4F1EA)
const CONFIG = {
  color: '#F4F1EA',
  spread: 0.45,
  speed: 1,
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.95, g: 0.94, b: 0.91 };
}

const canvas = document.querySelector('.hero-canvas');
const hero = document.querySelector('.hero');

if (canvas && hero && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });

  function resizeCanvas() {
    if (!hero) return;
    const width = hero.offsetWidth;
    const height = hero.offsetHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const rgb = hexToRgb(CONFIG.color);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
      },
      uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
      uSpread: { value: CONFIG.spread },
    },
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let scrollProgress = 0;

  function animateThree() {
    material.uniforms.uProgress.value = scrollProgress;
    renderer.render(scene, camera);
    requestAnimationFrame(animateThree);
  }
  animateThree();

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
      const heroHeight = hero.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = heroHeight - windowHeight;
      scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.15);
    });
  }

  window.addEventListener('resize', () => {
    material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight);
  });
}

/* ==========================================================================
   3. GSAP WORD-BY-WORD TEXT REVEAL & PARALLAX LEAVES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Word Splitter Fallback for smooth word-by-word reveal
  const splitHeading = document.getElementById('splitHeroHeading');
  if (splitHeading) {
    const text = splitHeading.innerText;
    const words = text.split(' ');
    splitHeading.innerHTML = words
      .map((word) => `<span class="word" style="opacity: 0;">${word}</span>`)
      .join(' ');

    const wordElements = splitHeading.querySelectorAll('.word');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.hero__content',
        start: 'top 35%',
        end: 'bottom 90%',
        onUpdate: (self) => {
          const progress = self.progress;
          const totalWords = wordElements.length;
          const isEnded = progress >= 0.99;

          wordElements.forEach((wordEl, index) => {
            const wordProgress = index / totalWords;
            const nextWordProgress = (index + 1) / totalWords;

            let opacity = 0;
            if (progress >= nextWordProgress) {
              opacity = 1;
            } else if (progress >= wordProgress) {
              const fadeProgress = (progress - wordProgress) / (nextWordProgress - wordProgress);
              opacity = fadeProgress;
            }

            gsap.to(wordEl, {
              opacity: opacity,
              color: 'var(--text-dark)',
              duration: 0.1,
              overwrite: true,
            });
          });
        },
      });

      // Parallax Leaf Animations
      gsap.to('.hero__twig--left', {
        y: -1500,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero__twig--right', {
        y: -2400,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  // Initialize Countdown Clock
  startCountdown();
});

/* ==========================================================================
   4. LIVE EVENT COUNTDOWN TIMER (Target: Sept 21, 2026, 18:00:00 IST)
   ========================================================================== */
function startCountdown() {
  const targetDate = new Date('2026-09-21T18:00:00+05:30').getTime();

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.getElementById('cdDays').innerText = '00';
      document.getElementById('cdHours').innerText = '00';
      document.getElementById('cdMins').innerText = '00';
      document.getElementById('cdSecs').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formatNum = (num) => String(num).padStart(2, '0');

    const cdDaysEl = document.getElementById('cdDays');
    const cdHoursEl = document.getElementById('cdHours');
    const cdMinsEl = document.getElementById('cdMins');
    const cdSecsEl = document.getElementById('cdSecs');

    if (cdDaysEl) cdDaysEl.innerText = formatNum(days);
    if (cdHoursEl) cdHoursEl.innerText = formatNum(hours);
    if (cdMinsEl) cdMinsEl.innerText = formatNum(minutes);
    if (cdSecsEl) cdSecsEl.innerText = formatNum(seconds);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   5. INTERACTIVE GIT SIMULATOR
   ========================================================================== */
const simStepsData = {
  1: [
    { text: '$ git clone https://github.com/acm-medicaps/hacktoberfest-2026.git', type: 'prompt' },
    { text: 'Cloning into \'hacktoberfest-2026\'...', type: 'response' },
    { text: 'remote: Enumerating objects: 142, done.', type: 'response' },
    { text: 'remote: Total 142 (delta 42), reused 110 (delta 30)', type: 'response' },
    { text: '✔ Repository successfully cloned to your workstation!', type: 'success' }
  ],
  2: [
    { text: '$ cd hacktoberfest-2026', type: 'prompt' },
    { text: '$ git checkout -b feature/my-first-contribution', type: 'prompt' },
    { text: 'Switched to a new branch \'feature/my-first-contribution\'', type: 'response' },
    { text: '✔ Isolated feature branch ready for local code modifications!', type: 'success' }
  ],
  3: [
    { text: '$ git status', type: 'prompt' },
    { text: 'Changes to be committed: (use "git restore --staged <file>..." to unstage)', type: 'response' },
    { text: '      modified:   CONTRIBUTORS.md', type: 'response' },
    { text: '$ git commit -m "feat: add Alex to contributors list ⭐"', type: 'prompt' },
    { text: '[feature/my-first-contribution 8f2a910] feat: add Alex to contributors list ⭐', type: 'response' },
    { text: ' 1 file changed, 2 insertions(+)', type: 'response' },
    { text: '✔ Commit recorded with descriptive history!', type: 'success' }
  ],
  4: [
    { text: '$ git push origin feature/my-first-contribution', type: 'prompt' },
    { text: 'Enumerating objects: 5, done.', type: 'response' },
    { text: 'To https://github.com/acm-medicaps/hacktoberfest-2026.git', type: 'response' },
    { text: ' * [new branch]      feature/my-first-contribution -> feature/my-first-contribution', type: 'response' },
    { text: '🎉 PULL REQUEST CREATED ON GITHUB! Welcome to Open Source!', type: 'success' }
  ]
};

function runSimStep(stepNum) {
  const stepBtns = document.querySelectorAll('.sim-step-btn');
  stepBtns.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-step') == stepNum) {
      btn.classList.add('active');
    }
  });

  const termOutput = document.getElementById('terminalOutput');
  if (!termOutput) return;

  termOutput.innerHTML = '';
  const lines = simStepsData[stepNum] || [];

  lines.forEach((line, idx) => {
    setTimeout(() => {
      const lineEl = document.createElement('div');
      lineEl.className = 'term-line';

      if (line.type === 'prompt') {
        lineEl.innerHTML = `<span class="term-prompt">$</span> ${line.text.replace('$ ', '')}`;
      } else if (line.type === 'success') {
        lineEl.className = 'term-line term-success';
        lineEl.innerText = line.text;
      } else {
        lineEl.className = 'term-line term-response';
        lineEl.innerText = line.text;
      }

      termOutput.appendChild(lineEl);
      termOutput.scrollTop = termOutput.scrollHeight;
    }, idx * 250);
  });
}

/* Modal functions removed */

/* ========================================================================
   7. SPEAKER QUESTION SUBMISSION
   ======================================================================== */
function submitSpeakerQuestion() {
  const input = document.getElementById('speakerQuestion');
  const feedback = document.getElementById('questionFeedback');

  if (!input || !input.value.trim()) {
    if (feedback) {
      feedback.style.color = '#EF4444';
      feedback.innerText = 'Please enter a question first.';
    }
    return;
  }

  if (feedback) {
    feedback.style.color = '#15803D';
    feedback.innerText = '✔ Question submitted! Harsh will address it during Q&A.';
    input.value = '';
    setTimeout(() => {
      feedback.innerText = '';
    }, 4000);
  }
}
