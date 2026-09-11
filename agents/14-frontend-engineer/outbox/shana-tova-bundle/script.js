(() => {
  "use strict";

  const track = document.getElementById("carouselTrack");
  const toggle = document.getElementById("carouselToggle");
  const label = toggle ? toggle.querySelector(".label") : null;

  if (!track || !toggle) return;

  // Duplicate the slide set once so the CSS keyframe (translateX -50%)
  // loops seamlessly — the auto-scroll never visibly "jumps" or resets.
  const originalSlides = Array.from(track.children);
  originalSlides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  let paused = false;

  const setPaused = (next) => {
    paused = next;
    track.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-pressed", String(paused));
    if (label) label.textContent = paused ? "המשך גלילה" : "עצור גלילה";
  };

  toggle.addEventListener("click", () => setPaused(!paused));

  // Respect users who asked the OS for reduced motion — start paused.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) setPaused(true);
})();
