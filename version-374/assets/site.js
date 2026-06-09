(function () {
    function toggleMenu() {
        var menu = document.querySelector('[data-mobile-menu]');
        if (menu) {
            menu.classList.toggle('open');
        }
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupSearchForms() {
        document.querySelectorAll('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var keyword = input ? input.value.trim() : '';
                var target = form.getAttribute('action') || './search.html';
                if (keyword) {
                    window.location.href = target + '?q=' + encodeURIComponent(keyword);
                } else {
                    window.location.href = target;
                }
            });
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-to]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-to')) || 0);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 6200);
    }

    function setupFilters() {
        var panels = document.querySelectorAll('[data-grid-filter]');
        panels.forEach(function (panel) {
            var keywordInput = panel.querySelector('[data-filter-keyword]');
            var yearSelect = panel.querySelector('[data-filter-year]');
            var typeSelect = panel.querySelector('[data-filter-type]');
            var categorySelect = panel.querySelector('[data-filter-category]');
            var resultRoot = panel.parentElement.querySelector('[data-filter-results]');
            var emptyState = panel.parentElement.querySelector('[data-empty-state]');
            var cards = resultRoot ? Array.prototype.slice.call(resultRoot.querySelectorAll('[data-movie-card]')) : [];
            var params = new URLSearchParams(window.location.search);
            var initialKeyword = params.get('q');

            if (initialKeyword && keywordInput) {
                keywordInput.value = initialKeyword;
            }

            function apply() {
                var keyword = normalize(keywordInput ? keywordInput.value : '');
                var year = yearSelect ? yearSelect.value : '';
                var type = typeSelect ? typeSelect.value : '';
                var category = categorySelect ? categorySelect.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-category'),
                        card.textContent
                    ].join(' '));
                    var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchesYear = !year || card.getAttribute('data-year') === year;
                    var matchesType = !type || card.getAttribute('data-type') === type;
                    var matchesCategory = !category || card.getAttribute('data-category') === category;
                    var showCard = matchesKeyword && matchesYear && matchesType && matchesCategory;
                    card.hidden = !showCard;
                    if (showCard) {
                        visible += 1;
                    }
                });

                if (emptyState) {
                    emptyState.hidden = visible !== 0;
                }
            }

            [keywordInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        if (menuButton) {
            menuButton.addEventListener('click', toggleMenu);
        }
        setupSearchForms();
        setupHero();
        setupFilters();
    });
})();
