
/* ==========================================
   RASHIKH & NYSHANA WEDDING WEBSITE
   COMPLETE JAVASCRIPT
========================================== */


/* ==========================================
   1. TAP TO OPEN - RING ANIMATION
========================================== */

const cover =
  document.getElementById("invitationCover") ||
  document.getElementById("cover");

const ring = document.getElementById("openRing");

if (cover && ring) {
  document.body.classList.add("locked");

  ring.addEventListener("click", () => {
    ring.disabled = true;

    // Ring zoom animation
    if (typeof ring.animate === "function") {
      ring.animate(
        [
          {
            transform: "translateX(-50%) scale(1)",
            opacity: 1
          },
          {
            transform: "translateX(-50%) scale(4)",
            opacity: 0
          }
        ],
        {
          duration: 1000,
          easing: "ease-in-out",
          fill: "forwards"
        }
      );
    }

    // Open the wedding invitation
    setTimeout(() => {
      cover.classList.add("opened");
      document.body.classList.remove("locked");

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    }, 750);
  });
}


/* ==========================================
   2. REVEAL CONTENT WHILE SCROLLING
========================================== */

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => {
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("visible");
  });
}


/* ==========================================
   3. WEDDING COUNTDOWN
========================================== */

// Wedding: 21 December 2026
// Time: 12:00 AM India Standard Time

const weddingDate = new Date("2026-12-21T00:00:00+05:30");

function updateCountdown() {
  const countdown = document.getElementById("countdown");

  if (!countdown) return;

  const difference = weddingDate.getTime() - Date.now();

  if (difference <= 0) {
    countdown.innerHTML =
      "<p>Our special day is here! ♡</p>";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor(
    (difference / 3600000) % 24
  );
  const minutes = Math.floor(
    (difference / 60000) % 60
  );
  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  const dayElement = document.getElementById("days");
  const hourElement = document.getElementById("hours");
  const minuteElement = document.getElementById("minutes");
  const secondElement = document.getElementById("seconds");

  if (dayElement) {
    dayElement.textContent = days;
  }

  if (hourElement) {
    hourElement.textContent =
      String(hours).padStart(2, "0");
  }

  if (minuteElement) {
    minuteElement.textContent =
      String(minutes).padStart(2, "0");
  }

  if (secondElement) {
    secondElement.textContent =
      String(seconds).padStart(2, "0");
  }
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* ==========================================
   4. SCRATCH & REVEAL CARDS
========================================== */

document.querySelectorAll(".scratch-canvas").forEach((canvas) => {

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let scratching = false;
  let lastPoint = null;
  let strokes = 0;
  let revealed = false;


  /* ----------------------------------------
     DRAW BURGUNDY CARD AND ROSE PETALS
  ---------------------------------------- */

  const petalImage = new Image();

petalImage.src = "Images/rose-petals.png";

petalImage.onload = () => { 
  if (!revealed && !scratching) {
    prepareCanvas();
  }
};

function prepareCanvas() {

    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.globalCompositeOperation = "source-over";


    // Burgundy background

    // Original wedding cover rose petals
    if (petalImage.complete && petalImage.naturalWidth > 0) {
      const scale = Math.max(
        rect.width / petalImage.naturalWidth,
        rect.height / petalImage.naturalHeight
      );

      const imageWidth = petalImage.naturalWidth * scale;
      const imageHeight = petalImage.naturalHeight * scale;

      ctx.drawImage(
        petalImage,
        (rect.width - imageWidth) / 2,
        (rect.height - imageHeight) / 2,
        imageWidth,
        imageHeight
      );
    }

    ctx.fillStyle = "#5b1025";

    ctx.fillRect(
      0,
      0,
      rect.width,
      rect.height
    );


    // Elegant gold border
    ctx.strokeStyle = "#c9a76a";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      8,
      8,
      rect.width - 16,
      rect.height - 16
    );


    /* DRAW ROSE PETAL */

    function drawPetal(x, y, size, rotation) {

      ctx.save();

      ctx.translate(x, y);
      ctx.rotate(rotation);

      const gradient = ctx.createLinearGradient(
        -size,
        -size,
        size,
        size
      );

      gradient.addColorStop(0, "#e27b86");
      gradient.addColorStop(0.45, "#a51e3d");
      gradient.addColorStop(1, "#480015");

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      ctx.bezierCurveTo(
        -size,
        -size * 0.8,
        -size * 0.6,
        -size * 1.7,
        0,
        -size * 2
      );

      ctx.bezierCurveTo(
        size * 0.9,
        -size * 1.3,
        size,
        -size * 0.5,
        0,
        0
      );

      ctx.fill();

      ctx.restore();
    }


// Realistic rose petals inside the scratch box
if (petalImage.complete && petalImage.naturalWidth > 0) {
  ctx.save();

  ctx.beginPath();
  ctx.rect(0, 0, rect.width, rect.height);
  ctx.clip();

  ctx.drawImage(
    petalImage,
    0,
    0,
    rect.width,
    rect.height
  );

  ctx.restore();
}

} // End of prepareCanvas

// Draw card surface
prepareCanvas();


  /* ----------------------------------------
     GET MOUSE OR FINGER POSITION
  ---------------------------------------- */

  function pointFromEvent(event) {

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }


  /* ----------------------------------------
     SCRATCH THE CARD
  ---------------------------------------- */

  function erase(point) {

    ctx.globalCompositeOperation = "destination-out";

    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
    } else {
      ctx.moveTo(point.x, point.y);
    }

    ctx.lineTo(point.x, point.y);

    ctx.stroke();

    lastPoint = point;

    strokes++;


    /* Reveal after enough scratching */

    if (strokes > 35 && !revealed) {

      revealed = true;

      canvas.style.transition = "opacity 0.7s ease";
      canvas.style.opacity = "0";

      setTimeout(() => {
        canvas.style.pointerEvents = "none";
      }, 700);

    }
  }


  /* ----------------------------------------
     START SCRATCHING
  ---------------------------------------- */

  canvas.addEventListener("pointerdown", (event) => {

    if (revealed) return;

    scratching = true;
    lastPoint = null;

    canvas.setPointerCapture(event.pointerId);

    erase(pointFromEvent(event));

  });


  /* ----------------------------------------
     CONTINUE SCRATCHING
  ---------------------------------------- */

  canvas.addEventListener("pointermove", (event) => {

    if (!scratching || revealed) return;

    erase(pointFromEvent(event));

  });


  /* ----------------------------------------
     STOP SCRATCHING
  ---------------------------------------- */

  function stopScratching() {
    scratching = false;
    lastPoint = null;
  }

  canvas.addEventListener(
    "pointerup",
    stopScratching
  );

  canvas.addEventListener(
    "pointercancel",
    stopScratching
  );

});

/* ===== WEDDING COUNTDOWN ===== */

(function () {
  const weddingDate = new Date("2026-12-21T00:00:00+05:30").getTime();

  const daysEl = document.getElementById("wDays");
  const hoursEl = document.getElementById("wHours");
  const minutesEl = document.getElementById("wMinutes");
  const secondsEl = document.getElementById("wSeconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  function updateWeddingCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, weddingDate - now);

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateWeddingCountdown();
  setInterval(updateWeddingCountdown, 1000);
})();

