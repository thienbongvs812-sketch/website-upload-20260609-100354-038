(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var jumpForm = document.querySelector('[data-search-jump]');

  if (jumpForm) {
    jumpForm.addEventListener('submit', function (event) {
      var input = jumpForm.querySelector('input[name="q"]');
      var keyword = input ? input.value.trim() : '';

      if (keyword) {
        event.preventDefault();
        window.location.href = './library.html?q=' + encodeURIComponent(keyword);
      }
    });
  }

  var filterForm = document.querySelector('[data-filter-form]');

  if (filterForm) {
    var searchInput = filterForm.querySelector('[data-search-filter]');
    var yearSelect = filterForm.querySelector('[data-year-filter]');
    var regionSelect = filterForm.querySelector('[data-region-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q') || '';

    if (searchInput && keyword) {
      searchInput.value = keyword;
    }

    function applyFilters() {
      var searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var yearValue = yearSelect ? yearSelect.value : '';
      var regionValue = regionSelect ? regionSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matched = true;

        if (searchValue && text.indexOf(searchValue) === -1) {
          matched = false;
        }

        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }

        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [searchInput, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-cover');
    var streamUrl = box.getAttribute('data-stream');
    var hlsInstance = null;

    function beginPlay() {
      if (!video || !streamUrl) {
        return;
      }

      box.classList.add('is-playing');

      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        }
      } else if (!video.getAttribute('src')) {
        video.setAttribute('src', streamUrl);
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          box.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', beginPlay);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          beginPlay();
        }
      });
    }
  });
})();
