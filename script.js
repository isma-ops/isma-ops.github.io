const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const viewNav = document.getElementById("view-nav");
const panes = [...document.querySelectorAll(".view-pane")];
if (viewNav) {
  viewNav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn) return;

    viewNav.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selected = btn.dataset.view;
    panes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === selected);
    });
  });
}

const glow = document.getElementById("cursor-glow");
document.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

const filterWrap = document.getElementById("tech-filters");
const cards = [...document.querySelectorAll(".tech-card")];
if (filterWrap) {
  filterWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;

    filterWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selected = btn.dataset.filter;
    cards.forEach((card) => {
      const match = selected === "all" || card.dataset.cat === selected;
      card.style.display = match ? "grid" : "none";
    });
  });
}

const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
  });
});
