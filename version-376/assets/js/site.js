document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var setSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    };
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        setSlide(itemIndex);
      });
    });
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5600);
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
  forms.forEach(function (form) {
    var scope = form.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    if (!cards.length) {
      cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    }
    var keyword = form.querySelector('[data-filter-keyword]');
    var year = form.querySelector('[data-filter-year]');
    var genre = form.querySelector('[data-filter-genre]');
    var empty = scope.querySelector('[data-empty-tip]');

    var normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };

    var apply = function () {
      var key = normalize(keyword && keyword.value);
      var selectedYear = normalize(year && year.value);
      var selectedGenre = normalize(genre && genre.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.region,
          card.dataset.category
        ].join(' '));
        var matchedKeyword = !key || text.indexOf(key) !== -1;
        var matchedYear = !selectedYear || normalize(card.dataset.year) === selectedYear;
        var matchedGenre = !selectedGenre || normalize(card.dataset.genre).indexOf(selectedGenre) !== -1;
        var shown = matchedKeyword && matchedYear && matchedGenre;
        card.style.display = shown ? '' : 'none';
        if (shown) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    ['input', 'change'].forEach(function (eventName) {
      form.addEventListener(eventName, apply);
    });

    form.addEventListener('reset', function () {
      window.setTimeout(apply, 0);
    });
  });
});
