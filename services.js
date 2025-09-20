document.addEventListener('DOMContentLoaded', () => {
  // run after Webflow/CMS has finished binding
  const run = () => {
    let locked = false;

    function slideHasRealContent(slide) {
      // 1) real IMG (not UI icon, not placeholder, not empty binding)
      const realImg = Array.from(slide.querySelectorAll('img')).some(img => {
        if (img.classList.contains('w-dyn-bind-empty')) return false;        // CMS empty
        if (img.closest('.play-button')) return false;                       // UI play icon
        const src = (img.getAttribute('src') || '').trim();
        if (!src) return false;
        if (src.includes('/plugins/Basic/assets/placeholder')) return false; // Webflow placeholder
        if (src.toLowerCase().includes('play%20icon.svg')) return false;     // UI icon file
        return true;
      });

      if (realImg) return true;

      // 2) video / iframe with a src
      if (slide.querySelector('video[src], video source[src], iframe[src]')) return true;

      // 3) background-image set to a real URL
      const bgEl = Array.from(slide.querySelectorAll('*')).find(el => {
        const bg = getComputedStyle(el).backgroundImage;
        return bg && bg !== 'none' && !bg.includes('placeholder');
      });
      if (bgEl) return true;

      // 4) lightbox with actual items
      const lbScript = slide.querySelector('a.w-lightbox script.w-json');
      if (lbScript) {
        try {
          const data = JSON.parse(lbScript.textContent || '{}');
          if (Array.isArray(data.items) && data.items.length > 0) return true;
        } catch (e) {}
      }

      return false;
    }

    function countSlidesWithContent(slider) {
      const slides = Array.from(slider.querySelectorAll('.w-slide'))
        // ignore conditionally hidden slides (no content per CMS condition)
        .filter(s => !s.classList.contains('w-condition-invisible'));
      return slides.filter(slideHasRealContent).length;
    }

    function updateSliderUI(slider) {
      const videoBtnBlock = slider.querySelector('.video-button-block'); // your block
      const filled = countSlidesWithContent(slider);

      // Hide/show the whole button block
      if (videoBtnBlock) videoBtnBlock.style.display = filled > 1 ? '' : 'none';
      if (filled <= 1) return; // nothing else to do

      // Below: your existing UI logic (disabled states + counter)
      const dots = Array.from(slider.querySelectorAll('.w-slider-nav .w-slider-dot'));
      const active = slider.querySelector('.w-slider-nav .w-slider-dot.w-active');
      if (!active || dots.length === 0) return;

      const i = dots.indexOf(active);
      const backBtn = slider.querySelector('.back-button');
      const nextBtn = slider.querySelector('.next-button');
      const counter = slider.querySelector('.slider-counter');

      if (backBtn) {
        const atStart = i === 0;
        backBtn.classList.toggle('disabled', atStart);
        backBtn.style.pointerEvents = atStart ? 'none' : 'auto';
        backBtn.style.opacity = atStart ? '0.4' : '1';
      }

      if (nextBtn) {
        const atEnd = i === dots.length - 1;
        nextBtn.classList.toggle('disabled', atEnd);
        nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        nextBtn.style.opacity = atEnd ? '0.4' : '1';
      }

      if (counter) counter.textContent = `${i + 1}/${dots.length}`;
    }

    document.body.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('.next-button:not(.disabled)');
      const prevBtn = e.target.closest('.back-button:not(.disabled)');
      if (!nextBtn && !prevBtn) return;

      const slider = (nextBtn || prevBtn).closest('.w-slider');
      if (!slider) return;

      // block nav if there isn't at least 2 filled slides
      if (countSlidesWithContent(slider) <= 1) return;

      e.preventDefault();
      e.stopPropagation();

      if (locked) return;
      locked = true;

      const dots = Array.from(slider.querySelectorAll('.w-slider-nav .w-slider-dot'));
      const active = slider.querySelector('.w-slider-nav .w-slider-dot.w-active');
      if (!active) { locked = false; return; }

      const i = dots.indexOf(active);
      const targetIndex =
        nextBtn && i < dots.length - 1 ? i + 1 :
        prevBtn && i > 0 ? i - 1 : undefined;

      if (targetIndex !== undefined) dots[targetIndex].click();

      const duration = parseInt(slider.getAttribute('data-duration'), 10) || 500;
      setTimeout(() => { locked = false; updateSliderUI(slider); }, duration + 100);
    });

    // initial setup for all sliders on the page
    document.querySelectorAll('.w-slider').forEach(updateSliderUI);
  };

  window.Webflow = window.Webflow || [];
  window.Webflow.push(run);
});