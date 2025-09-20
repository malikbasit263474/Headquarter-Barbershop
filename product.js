document.addEventListener('DOMContentLoaded', function () {
  // Delegate clicks for ALL custom arrows on the site
  document.body.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('.next-button');
    var prevBtn = e.target.closest('.back-button');
    if (!nextBtn && !prevBtn) return;

    e.preventDefault();
    e.stopPropagation();

    var btn = nextBtn || prevBtn;

    // Find the nearest Webflow slider that this button belongs to
    var slider = btn.closest('.w-slider');
    if (!slider) return;

    // Click the built-in arrows inside that slider
    var arrow = slider.querySelector(nextBtn ? '.w-slider-arrow-right' : '.w-slider-arrow-left');
    if (arrow) arrow.click();
  }, { passive: false });
});
