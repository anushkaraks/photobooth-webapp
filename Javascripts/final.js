// ================= CANVAS SIZE =================
const WIDTH = 1024;
const HEIGHT = 1536;


// ================= DOM ELEMENTS =================
const canvas = document.getElementById('finalCanvas');
const ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;

const addNebulaBtn  = document.getElementById('addNebula');
const addPandaBtn   = document.getElementById('addPanda');
const addPlanetBtn  = document.getElementById('addPlanet');
const addRainbowBtn = document.getElementById('addRainbow');
const addSnapBtn    = document.getElementById('addSnap');
const addSparkleBtn = document.getElementById('addSparkle');
const addStarBtn    = document.getElementById('addStar');

const downloadBtn = document.getElementById('downloadBtn');
const homeBtn = document.getElementById('homeBtn');
const resetBtn = document.getElementById('reset');


// ================= STICKER STATE =================
let stickers = [];
let dragOffset = { x: 0, y: 0 };
let selectedSticker = null;


// ================= LOAD PHOTO =================
const finalImage = new Image();
const dataURL = localStorage.getItem('photoStrip');

if (dataURL) {
  finalImage.src = dataURL;
  finalImage.onload = drawCanvas;
  localStorage.removeItem('photoStrip');
} else {
  alert("No photo found!");
}


// ================= DRAW CANVAS =================
function drawCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  if (finalImage.complete) {
    ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);
  }

  stickers.forEach(sticker => {
    ctx.drawImage(
      sticker.img,
      sticker.x,
      sticker.y,
      sticker.width,
      sticker.height
    );
  });
}


// ================= ADD STICKER =================
function addSticker(src) {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    stickers.push({
      img,
      x: WIDTH / 2 - img.width / 6,
      y: HEIGHT / 2 - img.height / 6,
      width: img.width / 2.5,
      height: img.height / 2.5,
      dragging: false
    });

    drawCanvas();
  };
}


// ================= POINTER POSITION =================
function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = e.touches?.[0]?.clientX ?? e.clientX;
  const clientY = e.touches?.[0]?.clientY ?? e.clientY;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}


// ================= DRAG LOGIC =================
function pointerDown(e) {
  const { x, y } = getPointerPos(e);

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    if (
      x >= s.x &&
      x <= s.x + s.width &&
      y >= s.y &&
      y <= s.y + s.height
    ) {
      selectedSticker = s;
      s.dragging = true;

      dragOffset.x = x - s.x;
      dragOffset.y = y - s.y;

      // bring to front
      stickers.splice(i, 1);
      stickers.push(s);

      drawCanvas();
      e.preventDefault();
      break;
    }
  }
}

function pointerMove(e) {
  if (!selectedSticker?.dragging) return;

  const { x, y } = getPointerPos(e);

  selectedSticker.x = x - dragOffset.x;
  selectedSticker.y = y - dragOffset.y;

  drawCanvas();
  e.preventDefault();
}

function pointerUp() {
  if (selectedSticker) {
    selectedSticker.dragging = false;
  }
  selectedSticker = null;
}


// ================= CANVAS EVENTS =================
canvas.addEventListener('mousedown', pointerDown);
canvas.addEventListener('mousemove', pointerMove);
canvas.addEventListener('mouseup', pointerUp);
canvas.addEventListener('mouseleave', pointerUp);

canvas.addEventListener('touchstart', pointerDown);
canvas.addEventListener('touchmove', pointerMove);
canvas.addEventListener('touchend', pointerUp);
canvas.addEventListener('touchcancel', pointerUp);


// ================= STICKER BUTTONS =================
addNebulaBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/nebula.png')
);

addPandaBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/panda.png')
);

addPlanetBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/planet.png')
);

addRainbowBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/rainbow.png')
);

addSnapBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/snap.png')
);

addSparkleBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/sparkle.png')
);

addStarBtn?.addEventListener('click', () =>
  addSticker('Assets/space-photobooth/camerapage/stickers/star.png')
);


// ================= RESET =================
resetBtn?.addEventListener('click', () => {
  stickers = [];
  drawCanvas();
});


// ================= DOWNLOAD =================
downloadBtn?.addEventListener('click', () => {
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'space-photobooth.png';
    a.click();
  }, 'image/png');
});


// ================= HOME =================
homeBtn?.addEventListener('click', () => {
  window.location.href = 'index.html';
});


// ================= LOGO CLICK =================
document.querySelector('.logo')?.addEventListener('click', () => {
  window.location.href = 'index.html';
});