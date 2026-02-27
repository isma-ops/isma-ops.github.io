const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const progressEl = document.getElementById("scroll-progress");
const updateProgress = () => {
  if (!progressEl) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressEl.style.width = `${Math.max(0, Math.min(100, value))}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const viewNav = document.getElementById("view-nav");
const panes = [...document.querySelectorAll(".view-pane")];
if (viewNav) {
  viewNav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn || btn.classList.contains("active")) return;

    viewNav.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selected = btn.dataset.view;
    panes.forEach((pane) => pane.classList.toggle("active", pane.id === selected));
  });
}

const filterWrap = document.getElementById("tech-filters");
const techCards = [...document.querySelectorAll(".tech-card")];
if (filterWrap) {
  filterWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;

    filterWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selected = btn.dataset.filter;
    techCards.forEach((card) => {
      const match = selected === "all" || card.dataset.cat === selected;
      card.style.display = match ? "grid" : "none";
    });
  });
}

const glow = document.getElementById("cursor-glow");
const ring = document.getElementById("cursor-ring");
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;
let ringScale = 1;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (glow) glow.style.transform = `translate(${mx}px, ${my}px)`;
});

const stepCursor = () => {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) scale(${ringScale})`;
  requestAnimationFrame(stepCursor);
};
stepCursor();

const hoverTargets = document.querySelectorAll("button, a, .tech-card, .job");
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (ring) {
      ringScale = 1.8;
      ring.style.borderColor = "rgba(0, 169, 139, 0.9)";
    }
  });
  el.addEventListener("mouseleave", () => {
    if (ring) {
      ringScale = 1;
      ring.style.borderColor = "rgba(15, 28, 42, 0.5)";
    }
  });
});

const tiltCards = document.querySelectorAll(".tilt-card, .tech-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -5;
    const rotY = ((x / rect.width) - 0.5) * 7;
    card.style.transform = `perspective(760px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(760px) rotateX(0deg) rotateY(0deg)";
  });
});

const magneticButtons = document.querySelectorAll(".magnetic");
magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    button.style.transform = `translate(${dx * 0.12}px, ${dy * 0.2}px)`;
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const counters = document.querySelectorAll("[data-counter]");
const animateCounter = (el) => {
  const target = Number(el.dataset.counter || 0);
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    el.textContent = `${Math.floor(target * (1 - (1 - p) ** 3))}+`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.65 });
  counters.forEach((counter) => observer.observe(counter));
} else {
  counters.forEach((counter) => animateCounter(counter));
}

const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const blobs = [
    { x: 120, y: 160, r: 220, dx: 0.2, dy: 0.12, c: "rgba(0,169,139,0.2)" },
    { x: 700, y: 120, r: 180, dx: -0.16, dy: 0.14, c: "rgba(255,107,61,0.18)" },
    { x: 500, y: 500, r: 240, dx: 0.14, dy: -0.18, c: "rgba(52,121,246,0.12)" }
  ];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach((b) => {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -100 || b.x > canvas.width + 100) b.dx *= -1;
      if (b.y < -100 || b.y > canvas.height + 100) b.dy *= -1;

      const g = ctx.createRadialGradient(b.x, b.y, 10, b.x, b.y, b.r);
      g.addColorStop(0, b.c);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}
