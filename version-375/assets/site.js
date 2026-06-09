(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      siteNav.classList.toggle("is-open");
    });
  }

  const sliders = document.querySelectorAll("[data-hero-slider]");

  sliders.forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    let index = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });

    if (index < 0) {
      index = 0;
    }

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  });

  const searchScopes = document.querySelectorAll("[data-search-scope]");

  searchScopes.forEach(function (scope) {
    const input = scope.querySelector("[data-card-search]");
    const select = scope.querySelector("[data-card-sort]");
    const countLabel = scope.querySelector("[data-card-count]");
    const emptyState = scope.querySelector("[data-empty-state]");
    const grid = scope.querySelector("[data-card-grid]");

    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.category,
        card.dataset.region,
        card.dataset.genre,
        card.textContent
      ].join(" "));
    }

    function applySearch() {
      const query = input ? normalize(input.value) : "";
      let visible = 0;

      cards.forEach(function (card) {
        const matched = !query || cardText(card).includes(query);
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = visible + " 部影片";
      }

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    function sortCards() {
      if (!select) {
        return;
      }

      const value = select.value;
      const sorted = cards.slice().sort(function (a, b) {
        if (value === "year") {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        }

        if (value === "rating") {
          return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
        }

        if (value === "views") {
          return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
        }

        return normalize(a.dataset.title).localeCompare(normalize(b.dataset.title), "zh-Hans-CN");
      });

      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener("input", applySearch);
    }

    if (select) {
      select.addEventListener("change", function () {
        sortCards();
        applySearch();
      });
      sortCards();
    }

    applySearch();
  });
})();
