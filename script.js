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

  // Cocktail carousel: arrows, dots, autoplay
  var carousel = document.querySelector('#cocktail .carousel');
  var track = document.getElementById('cocktailTrack');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dotsWrap = document.getElementById('carouselDots');

  if (track) {
    var items = Array.prototype.slice.call(track.querySelectorAll('.carousel__item'));
    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build one dot per slide
    var dots = [];
    if (dotsWrap) {
      items.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Vai alla foto ' + (i + 1));
        b.addEventListener('click', function () { goTo(i, true); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function leftFor(i) {
      return items[i].offsetLeft - items[0].offsetLeft;
    }
    function setActive(i) {
      current = i;
      dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
    }
    function goTo(i, user) {
      i = (i + items.length) % items.length;
      track.scrollTo({ left: leftFor(i), behavior: 'smooth' });
      setActive(i);
      if (user) restart();
    }

    // Keep the active dot in sync while the user swipes/scrolls
    var raf;
    track.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var pos = track.scrollLeft;
        var best = 0, bestDist = Infinity;
        items.forEach(function (item, i) {
          var d = Math.abs(leftFor(i) - pos);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActive(best);
      });
    }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1, true); });

    // Autoplay (respects reduced-motion; pauses on interaction / hidden tab)
    var timer = null;
    function play() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { goTo(current + 1, false); }, 4000);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); play(); }

    if (carousel) {
      carousel.addEventListener('pointerenter', stop);
      carousel.addEventListener('pointerleave', play);
      carousel.addEventListener('focusin', stop);
      carousel.addEventListener('focusout', play);
    }
    track.addEventListener('touchstart', stop, { passive: true });
    track.addEventListener('touchend', function () { restart(); }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { play(); }
    });

    setActive(0);
    play();
  }
})();
