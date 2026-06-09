(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-site-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = form.getAttribute('data-search-url') || './search.html';
      if (value) {
        window.location.href = target + '?q=' + encodeURIComponent(value);
      } else {
        window.location.href = target;
      }
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var container = panel.parentElement;
    var list = container ? container.querySelector('[data-sortable-list]') : null;
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];
    var queryInput = panel.querySelector('[data-filter-query]');
    var regionSelect = panel.querySelector('[data-filter-region]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var sortSelect = panel.querySelector('[data-sort-select]');
    var empty = container ? container.querySelector('[data-empty-result]') : null;

    if (!list || !cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (initialQuery && queryInput) {
      queryInput.value = initialQuery;
    }

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' '));
    }

    function applyFilters() {
      var query = normalize(queryInput ? queryInput.value : '');
      var region = normalize(regionSelect ? regionSelect.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var year = normalize(yearSelect ? yearSelect.value : '');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
        var matchesRegion = !region || normalize(card.getAttribute('data-region')).indexOf(region) !== -1;
        var matchesType = !type || normalize(card.getAttribute('data-type')).indexOf(type) !== -1;
        var matchesYear = !year || normalize(card.getAttribute('data-year')) === year;
        var visible = matchesQuery && matchesRegion && matchesType && matchesYear;
        card.classList.toggle('is-hidden', !visible);
        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    function sortCards() {
      var sortBy = sortSelect ? sortSelect.value : 'year';
      var sorted = cards.slice().sort(function (a, b) {
        if (sortBy === 'title') {
          return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-Hans-CN');
        }
        if (sortBy === 'hot') {
          return Number(b.getAttribute('data-score') || 0) - Number(a.getAttribute('data-score') || 0);
        }
        return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
      });
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      cards = sorted;
      applyFilters();
    }

    [queryInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', sortCards);
    }

    sortCards();
  });
}());
