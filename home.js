
  (window.Webflow = window.Webflow || []).push(function () {
    const el = document.querySelector('.swiper.is-instagram');
    if (!el) return;

    new Swiper(el, {
      loop: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 16,

      // Autoplay indstillinger
      autoplay: {
        delay: 3500,              // tid hver slide vises (ms)
        disableOnInteraction: false
      },
      speed: 700,                 // overgangshastighed (ms)
      pauseOnMouseEnter: true,    // stop når musen er over (desktop)

      // Slå drag/tryk-swipe fra
      allowTouchMove: false,

      // Fjern disse hvis du ikke har elementerne i DOM’en
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
      },
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev')
      },

      // Responsivt antal synlige kort (tilpas efter smag)
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });
  });

  (function() {
    var deadline = '2021-09-28 00:00';
  
    function pad(num, size) {
        var s = "0" + num;
        return s.substr(s.length-size);
    }
  
    function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date()),
          seconds = Math.floor((t / 1000) % 60),
          minutes = Math.floor((t / 1000 / 60) % 60),
          hours = Math.floor((t / (1000 * 60 * 60)) % 24),
          days = Math.floor(t / (1000 * 60 * 60 * 24));
  
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }
  
    function clock(id, endtime) {
      var days = document.getElementById(id + '-days')
          hours = document.getElementById(id + '-hours'),
          minutes = document.getElementById(id + '-minutes'),
          seconds = document.getElementById(id + '-seconds');
  
      var timeinterval = setInterval(function() {
        var t = getTimeRemaining(endtime);
  
        if (t.total <= 0){
          clearInterval(timeinterval);
        } else {
    days.innerHTML = pad(t.days, 2);
    hours.innerHTML = pad(t.hours, 2);
    minutes.innerHTML = pad(t.minutes, 2);
    seconds.innerHTML = pad(t.seconds, 2);
    }
      }, 1000);
    }
  
    clock('js-clock', deadline);
  })();
