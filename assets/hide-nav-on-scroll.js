(function () {
  var nav = document.querySelector("[data-hide-on-scroll], .site-top, .shell > .nav");
  if (!nav) {
    return;
  }

  var start = Number(nav.getAttribute("data-hide-start") || 80);
  var threshold = Number(nav.getAttribute("data-hide-threshold") || 8);
  var lastY = window.scrollY || 0;
  var ticking = false;

  function showNav() {
    nav.classList.remove("is-hidden");
  }

  function updateNav() {
    var currentY = Math.max(window.scrollY || 0, 0);
    var delta = currentY - lastY;

    if (currentY <= start || delta < -threshold) {
      showNav();
    } else if (delta > threshold && currentY > start) {
      nav.classList.add("is-hidden");
    }

    lastY = currentY;
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", function () {
    lastY = Math.max(window.scrollY || 0, 0);
    if (lastY <= start) {
      showNav();
    }
  });
  nav.addEventListener("focusin", showNav);
})();
