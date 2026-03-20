// ================= CONSTANTS =================
const WIDTH = 1024;
const HEIGHT = 1536;
const HALF = HEIGHT / 2;

let photos = [];

document.addEventListener("DOMContentLoaded", () => {

  localStorage.removeItem("photoStrip");

  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const uploadInput = document.getElementById("uploadPhotoInput");
  const uploadBtn = document.getElementById("uploadPhoto");
  const readyBtn = document.getElementById("readyButton");
  const logo = document.querySelector(".logo");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function drawAll() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    photos.forEach((img, index) => {

      const yOffset = index === 0 ? 0 : HALF;

      const imgAspect = img.width / img.height;
      const targetAspect = WIDTH / HALF;

      let sx, sy, sw, sh;

      if (imgAspect > targetAspect) {
        sh = img.height;
        sw = img.height * targetAspect;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = img.width / targetAspect;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
    });
  }

  uploadBtn.addEventListener("click", () => {
    uploadInput.click();
  });

  uploadInput.addEventListener("change", (e) => {

    if (photos.length >= 2) return;

    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = () => {
      photos.push(img);
      drawAll();

      if (photos.length === 2) {
        readyBtn.hidden = false;
        readyBtn.disabled = false;
      }
    };

    img.src = URL.createObjectURL(file);

    uploadInput.value = "";
  });

  readyBtn.addEventListener("click", () => {
    localStorage.setItem(
      "photoStrip",
      canvas.toDataURL("image/png")
    );
    window.location.href = "final.html";
  });

  logo?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

});