(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
      return;
    }
    fn();
  }

  function bindImageState() {
    document.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-hidden');
        var box = image.closest('.poster-frame, .hero-image-shell, .detail-poster, .ranking-thumb');
        if (box) {
          box.classList.add('is-empty');
        }
      });
    });
  }

  function bindNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var links = document.querySelector('[data-nav-links]');
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  function bindHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', function () {
      window.clearInterval(timer);
    });

    slider.addEventListener('mouseleave', start);
    start();
  }

  function bindSearchPage() {
    var page = document.querySelector('[data-search-page]');
    var input = document.querySelector('[data-search-page-input]');
    if (!page || !input) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;
    var localInput = page.querySelector('[data-filter-keyword]');
    if (localInput) {
      localInput.value = query;
      localInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function bindFilters() {
    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
      var section = panel.parentElement;
      var container = section.querySelector('[data-card-container]');
      var empty = section.querySelector('[data-empty-state]');
      if (!container) {
        return;
      }
      var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
      var keyword = panel.querySelector('[data-filter-keyword]');
      var region = panel.querySelector('[data-filter-region]');
      var type = panel.querySelector('[data-filter-type]');
      var sort = panel.querySelector('[data-filter-sort]');

      function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
      }

      function apply() {
        var key = normalize(keyword && keyword.value);
        var regionValue = region ? region.value : '全部';
        var typeValue = type ? type.value : '全部';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.dataset.title,
            card.dataset.tags,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year
          ].join(' '));
          var matchKey = !key || haystack.indexOf(key) !== -1;
          var matchRegion = regionValue === '全部' || card.dataset.regionGroup === regionValue;
          var matchType = typeValue === '全部' || card.dataset.type === typeValue;
          var show = matchKey && matchRegion && matchType;
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });

        if (sort) {
          var sorted = cards.slice().sort(function (a, b) {
            if (sort.value === 'title') {
              return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
            }
            if (sort.value === 'views') {
              return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
            }
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
          });
          sorted.forEach(function (card) {
            container.appendChild(card);
          });
        }

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [keyword, region, type, sort].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function bindPlayers() {
    document.querySelectorAll('.player-shell').forEach(function (shell) {
      var video = shell.querySelector('video[data-stream]');
      var button = shell.querySelector('[data-player-target]');
      if (!video || !button) {
        return;
      }
      var loaded = false;
      var hls;

      function setSourceAndPlay() {
        var stream = video.getAttribute('data-stream');
        if (!stream) {
          return;
        }
        button.classList.add('is-hidden');
        if (loaded) {
          video.play().catch(function () {});
          return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                hls.destroy();
              }
            }
          });
          return;
        }
        video.src = stream;
        video.play().catch(function () {});
      }

      button.addEventListener('click', setSourceAndPlay);
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          setSourceAndPlay();
        }
      });
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          button.classList.remove('is-hidden');
        }
      });
      window.addEventListener('pagehide', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    bindImageState();
    bindNavigation();
    bindHeroSlider();
    bindFilters();
    bindSearchPage();
    bindPlayers();
  });
})();
