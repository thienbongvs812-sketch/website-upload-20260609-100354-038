(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let activeSlide = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === activeSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      setSlide(Number(dot.dataset.slideTarget || 0));
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(activeSlide + 1);
    }, 5600);
  }

  const search = document.getElementById("movie-search");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll(".filter-grid .movie-card"));
  const resultNote = document.getElementById("result-note");
  let currentFilter = "all";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    const q = normalize(search ? search.value : "");
    let visible = 0;
    cards.forEach(function (card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.category,
        card.dataset.tags,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type
      ].join(" "));
      const matchText = !q || haystack.indexOf(q) !== -1;
      const matchCategory = currentFilter === "all" || card.dataset.category === currentFilter;
      const show = matchText && matchCategory;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        visible += 1;
      }
    });
    if (resultNote) {
      resultNote.textContent = visible > 0 ? "筛选结果" : "没有找到相关作品";
    }
  }

  if (search) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      search.value = q;
    }
    search.addEventListener("input", applyFilters);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.dataset.filter || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applyFilters();
    });
  });

  applyFilters();

  const topButton = document.querySelector(".back-to-top");
  if (topButton) {
    window.addEventListener("scroll", function () {
      topButton.classList.toggle("visible", window.scrollY > 520);
    });
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
