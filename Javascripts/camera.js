// ---------------- DOM ----------------
const video = document.getElementById("liveVideo");
const canvas = document.getElementById("finalCanvas");
const ctx = canvas.getContext("2d");
const takePhotoBtn = document.getElementById("takePhoto");
const countdownEl = document.querySelector(".countdown-timer");

let photoStage = 0;

// Frame dimensions
const WIDTH = 1024;
const HEIGHT = 1536;
const HALF = HEIGHT / 2;

// ---------------- INIT ----------------
window.addEventListener("load", () => {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  setupCamera();
  setupEvents();
});

// ---------------- CAMERA ----------------
function setupCamera() {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 960 },
      aspectRatio: { ideal: 4 / 3 }
    },
    audio: false
  })
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => video.play();
  })
  .catch(err => {
    console.error("Camera error:", err);
    alert("Camera access failed: " + err);
  });
}

// ---------------- COUNTDOWN ----------------
function startCountdown(callback) {
  let count = 3;
  if (!countdownEl) return callback();

  // Position countdown in the active half
  countdownEl.style.top = photoStage === 0 ? "25%" : "75%";

  countdownEl.textContent = count;
  countdownEl.style.display = "flex";

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(interval);
      countdownEl.style.display = "none";
      callback();
    }
  }, 1000);
}

// ---------------- CAPTURE ----------------
function capturePhoto() {
  const yOffset = photoStage === 0 ? 0 : HALF;
  const vW = video.videoWidth;
  const vH = video.videoHeight;

  if (!vW || !vH) return;

  const targetAspect = WIDTH / HALF;
  const videoAspect = vW / vH;

  let sx, sy, sw, sh;

  if (videoAspect > targetAspect) {
    sh = vH;
    sw = Math.round(vH * targetAspect);
    sx = Math.round((vW - sw) / 2);
    sy = 0;
  } else {
    sw = vW;
    sh = Math.round(vW / targetAspect);
    sx = 0;
    sy = Math.round((vH - sh) / 2);
  }

  // ---- TEMP HALF CANVAS ----
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = WIDTH;
  tempCanvas.height = HALF;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.save();
  tempCtx.translate(WIDTH, 0);
  tempCtx.scale(-1, 1);
  tempCtx.drawImage(video, sx, sy, sw, sh, 0, 0, WIDTH, HALF);
  tempCtx.restore();

  // ---- COPY TO MAIN CANVAS ----
  ctx.drawImage(tempCanvas, 0, yOffset);

  // ---- SHOW CANVAS OVER CAPTURED HALF ----
  canvas.style.opacity = "1";

  photoStage++;

  if (photoStage === 1) {
    // Move video preview to bottom half for second shot
    video.style.top = "50%";
    takePhotoBtn.disabled = false;
  } else if (photoStage === 2) {
    finalizeStrip();
  }
}

// ---------------- FINALIZE ----------------
function finalizeStrip() {
  video.style.display = "none";
  localStorage.setItem("photoStrip", canvas.toDataURL("image/png"));
  setTimeout(() => {
    window.location.href = "final.html";
  }, 100);
}

// ---------------- EVENTS ----------------
function setupEvents() {
  takePhotoBtn.addEventListener("click", () => {
    if (photoStage > 1) return;
    takePhotoBtn.disabled = true;
    startCountdown(capturePhoto);
  });
}