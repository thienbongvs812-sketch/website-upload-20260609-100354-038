(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var heroes = document.querySelectorAll('[data-hero]');
  heroes.forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var index = 0;

    function show(next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    show(0);
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5000);
    }
  });

  var filterForms = document.querySelectorAll('[data-filter]');
  filterForms.forEach(function (form) {
    var input = form.querySelector('[data-filter-keyword]');
    var genre = form.querySelector('[data-filter-genre]');
    var region = form.querySelector('[data-filter-region]');
    var year = form.querySelector('[data-filter-year]');
    var scope = document.querySelector(form.getAttribute('data-filter')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('[data-empty]');

    function norm(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var keyword = norm(input && input.value);
      var genreValue = norm(genre && genre.value);
      var regionValue = norm(region && region.value);
      var yearValue = norm(year && year.value);
      var visible = 0;

      cards.forEach(function (card) {
        var okKeyword = !keyword || card.getAttribute('data-title').indexOf(keyword) > -1 || card.getAttribute('data-genre').indexOf(keyword) > -1 || card.getAttribute('data-region').indexOf(keyword) > -1;
        var okGenre = !genreValue || card.getAttribute('data-genre').indexOf(genreValue) > -1;
        var okRegion = !regionValue || card.getAttribute('data-region').indexOf(regionValue) > -1;
        var okYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var show = okKeyword && okGenre && okRegion && okYear;
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, genre, region, year].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById('moviePlayer');
  var cover = document.querySelector('[data-play-cover]');
  var button = document.querySelector('[data-play-button]');
  var hlsInstance = null;

  if (!video || !source) return;

  function attach() {
    if (video.getAttribute('data-ready') === '1') return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    video.setAttribute('data-ready', '1');
  }

  function hideCover() {
    if (cover) cover.classList.add('is-hidden');
  }

  function play() {
    attach();
    hideCover();
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      play();
    });
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', hideCover);
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) hlsInstance.destroy();
  });
}
