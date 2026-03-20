// ================= CONSTANTS =================

const STAR_FRAMES = [
  'Assets/space-photobooth/homepage/animated-stars-home/star-1.png',
  'Assets/space-photobooth/homepage/animated-stars-home/star-2.png',
  'Assets/space-photobooth/homepage/animated-stars-home/star-3.png',
];

const PHOTOBOOTH_FRAMES = Array.from({ length: 16 }, (_, i) =>
  `Assets/space-photobooth/homepage/animated-photobooth-mock/${i + 1}.png`
);

const PHOTOBOOTH_FRAME_INTERVAL = 200;


// ================= DOM REFERENCES =================

const selectButton = document.getElementById('select-button');
const starEl = document.querySelector('.stars-mock');
const photoboothEl = document.querySelector('.photobooth-mock');
const cameraBtn = document.getElementById('menu-camera-button');
const uploadBtn = document.getElementById('menu-upload-button');
const logoEl = document.querySelector('.logo');


// ================= STAR ANIMATION =================

let starAnimating = false;
let currentStarFrame = 0;
let starAnimationTimeout = null;

function animateStars() {
  if (!starAnimating || !starEl) return;

  starEl.style.backgroundImage = `url('${STAR_FRAMES[currentStarFrame]}')`;
  currentStarFrame = (currentStarFrame + 1) % STAR_FRAMES.length;

  starAnimationTimeout = setTimeout(() => {
    requestAnimationFrame(animateStars);
  }, 200);
}

function startStarAnimation() {
  if (!starAnimating) {
    starAnimating = true;
    animateStars();
  }
}

function stopStarAnimation() {
  starAnimating = false;
  clearTimeout(starAnimationTimeout);
}


// ================= CHARACTER ANIMATION =================

const characters = [
  { el: document.querySelector('.character-mock-1'), rotation: 7.52, dir: -1 },
  { el: document.querySelector('.character-mock-2'), rotation: 7.52, dir: 1 },
  { el: document.querySelector('.character-mock-3'), rotation: 7.52, dir: -1 },
];

let characterAnimating = false;
let characterTimeouts = [];

function animateCharacter(index) {
  if (!characterAnimating) return;
  const character = characters[index];
  if (!character.el) return;

  character.el.style.transform = `rotate(${character.rotation * character.dir}deg)`;
  character.dir *= -1;

  characterTimeouts[index] = setTimeout(() => {
    requestAnimationFrame(() => animateCharacter(index));
  }, 200);
}

function startCharacterAnimation() {
  if (characterAnimating) return;
  characterAnimating = true;
  characters.forEach((_, i) => animateCharacter(i));
}

function stopCharacterAnimation() {
  characterAnimating = false;
  characterTimeouts.forEach(clearTimeout);
  characters.forEach(c => {
    if (c.el) c.el.style.transform = 'rotate(0deg)';
  });
}


// ================= PHOTOSTRIP ANIMATION =================

const photostrip = {
  el: document.querySelector('.photostrip-mock'),
  rotation: 16.52,
  current: 0,
};

let photostripTimeout = null;

function animatePhotostrip() {
  if (!characterAnimating || !photostrip.el) return;

  photostrip.el.style.transform = `rotate(${photostrip.current}deg)`;
  photostrip.current =
    photostrip.current === photostrip.rotation ? 0 : photostrip.rotation;

  photostripTimeout = setTimeout(() => {
    requestAnimationFrame(animatePhotostrip);
  }, 300);
}

function startPhotostripAnimation() {
  if (characterAnimating) animatePhotostrip();
}

function stopPhotostripAnimation() {
  clearTimeout(photostripTimeout);
  if (photostrip.el) photostrip.el.style.transform = 'rotate(0deg)';
}


// ================= MAIN PHOTOBOOTH FRAME ANIMATION =================

const loadedFrames = PHOTOBOOTH_FRAMES.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

let currentFrame = 0;
let direction = 1;
let lastFrameTime = 0;

function animatePhotobooth(timestamp) {
  if (!photoboothEl) return;

  if (timestamp - lastFrameTime >= PHOTOBOOTH_FRAME_INTERVAL) {
    const frame = loadedFrames[currentFrame];

    if (frame.complete) {
      photoboothEl.style.backgroundImage = `url('${frame.src}')`;

      currentFrame += direction;
      if (currentFrame === 0 || currentFrame === loadedFrames.length - 1) {
        direction *= -1;
      }

      lastFrameTime = timestamp;
    }
  }

  requestAnimationFrame(animatePhotobooth);
}

requestAnimationFrame(animatePhotobooth);


// ================= SAFE NAVIGATION =================

function addSafeNavigation(button, url, id) {
  if (!button) return;

  button.addEventListener('click', e => {
    if (typeof gtag === 'function') {
      gtag('event', 'button_click', {
        button_id: id || button.id || 'no-id',
        button_text: button.innerText || 'no-text',
      });
    }

    e.preventDefault();
    setTimeout(() => (window.location.href = url), 100);
  });
}


// ================= BUTTON INTERACTIONS =================

if (selectButton) {
  ['mouseenter', 'mousedown'].forEach(evt =>
    selectButton.addEventListener(evt, () => {
      startStarAnimation();
      startCharacterAnimation();
      startPhotostripAnimation();
    })
  );

  ['mouseleave', 'mouseup'].forEach(evt =>
    selectButton.addEventListener(evt, () => {
      stopStarAnimation();
      stopCharacterAnimation();
      stopPhotostripAnimation();
    })
  );
}


// ================= PAGE LINKS =================

addSafeNavigation(selectButton, 'menu.html');
addSafeNavigation(cameraBtn, 'camera.html');
addSafeNavigation(uploadBtn, 'upload.html');
addSafeNavigation(logoEl, 'index.html', 'logo');