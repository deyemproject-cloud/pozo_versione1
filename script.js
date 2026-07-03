(function () {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!navLinks.classList.contains('open'));
  });

  navAnchors.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  // Close the mobile menu when tapping outside the navbar
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !e.target.closest('.navbar')) {
      setMenu(false);
    }
  });

  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(function (el) { observer.observe(el); });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-10% 0px -55% 0px' });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  // Staggered cocktail card entrance
  document.querySelectorAll('.cocktail .card').forEach(function (card, i) {
    card.style.setProperty('--stagger', (i * 0.04) + 's');
  });

  // Cocktail carousel arrows
  var track = document.getElementById('cocktailTrack');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  if (track && prevBtn && nextBtn) {
    var step = function () {
      var first = track.querySelector('.carousel__item');
      if (!first) return track.clientWidth * 0.8;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return first.getBoundingClientRect().width + gap;
    };
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }
})();
