// ================= CONNECT TO STAR CONTAINER =================
const starContainer = document.querySelector(".star-container");


// ================= STAR IMAGES =================
const starImages = [
  "../Assets/space-photobooth/camerapage/stars/star1.png",
  "../Assets/space-photobooth/camerapage/stars/star2.png",
  "../Assets/space-photobooth/camerapage/stars/star3.png",
  "../Assets/space-photobooth/camerapage/stars/star4.png",
  "../Assets/space-photobooth/camerapage/stars/star5.png"
];


// ================= CREATE STAR =================
const createStar = () => {
  if (!starContainer) return;

  const star = document.createElement("img");
  star.src = starImages[Math.floor(Math.random() * starImages.length)];
  star.classList.add("star");

  // random horizontal position
  star.style.left = Math.random() * 100 + "vw";

  // random size
  const size = 20 + Math.random() * 20;
  star.style.width = size + "px";

  // random animation duration
  const duration = 12 + Math.random() * 8;
  star.style.animationDuration = duration + "s";

  // slight random opacity after animation
  star.addEventListener("animationend", () => {
    star.style.opacity = 0.3 + Math.random() * 0.7;
  });

  starContainer.appendChild(star);

  // remove after animation completes
  setTimeout(() => star.remove(), duration * 1000);
};


// ================= CONTINUOUS STAR GENERATION =================
setInterval(createStar, 400);