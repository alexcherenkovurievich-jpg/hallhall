/* ============================================================
   BrandPrime — скрипты
   Философия анимаций: почти не замечаешь, но без них мёртво.
   Всё плавное и медленное. Никаких вращений и отскоков.
   ============================================================ */

(function () {
  'use strict';

  // Уважаем системную настройку «меньше движения»
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ----------------------------------------------------------
     1. ФОН ШАПКИ ПРИ ПРОКРУТКЕ
     ---------------------------------------------------------- */
  var header = document.getElementById('header');

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ----------------------------------------------------------
     2. ЗАДЕРЖКИ ДЛЯ ЛЕСЕНКИ
     Элементы .reveal внутри [data-stagger] появляются друг за
     другом. Шаг задержки можно задать: data-stagger="0.12"
     ---------------------------------------------------------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseFloat(group.dataset.stagger) || 0.09;

    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', (i * step).toFixed(3) + 's');
    });
  });


  /* ----------------------------------------------------------
     3. ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ
     fade + сдвиг снизу вверх. Наблюдение снимается после
     первого срабатывания — блок появляется один раз.
     ---------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    // Старый браузер или выключенные анимации — просто показываем всё
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -12% 0px'   // срабатывает чуть раньше нижней кромки
    });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }


  /* ----------------------------------------------------------
     4. ТОЧКИ В ЭТАПАХ РАБОТЫ ЗАГОРАЮТСЯ ПО ОЧЕРЕДИ
     ---------------------------------------------------------- */
  var steps = document.querySelector('.steps');

  if (steps) {
    var stepItems = steps.querySelectorAll('.step');

    var lightUp = function () {
      stepItems.forEach(function (step, i) {
        setTimeout(function () { step.classList.add('is-lit'); }, i * 180);
      });
    };

    if (!('IntersectionObserver' in window) || reduceMotion) {
      stepItems.forEach(function (step) { step.classList.add('is-lit'); });
    } else {
      var stepsObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          lightUp();
          obs.disconnect();
        });
      }, { threshold: 0.2 });

      stepsObserver.observe(steps);
    }
  }


  /* ----------------------------------------------------------
     5. СЧЁТЧИК ЦЕН
     Цифры набегают до значения, которое уже стоит в разметке,
     поэтому без JS цена видна сразу и правильная.
     ---------------------------------------------------------- */
  var counters = document.querySelectorAll('.count');

  function runCounter(el) {
    var target = parseInt(el.textContent.replace(/\D/g, ''), 10);
    if (!target) return;

    var duration = 1100;
    var started = null;

    function frame(now) {
      if (started === null) started = now;

      var progress = Math.min((now - started) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);   // плавное торможение

      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }


  /* ----------------------------------------------------------
     6. ЗОЛОТАЯ ОБВОДКА КАРТОЧЕК ПАКЕТОВ
     Подгоняем viewBox под реальный размер карточки и считаем
     периметр — тогда штрих ровный и не растягивается.
     ---------------------------------------------------------- */
  var traces = document.querySelectorAll('.package__trace');

  function sizeTraces() {
    traces.forEach(function (svg) {
      var card = svg.parentElement;
      var w = card.offsetWidth;
      var h = card.offsetHeight;
      if (!w || !h) return;

      var rect = svg.querySelector('rect');

      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      rect.setAttribute('width', w - 1);
      rect.setAttribute('height', h - 1);
      rect.style.setProperty('--perimeter', 2 * (w + h));
    });
  }

  if (traces.length) {
    sizeTraces();

    if ('ResizeObserver' in window) {
      var traceObserver = new ResizeObserver(sizeTraces);
      traces.forEach(function (svg) { traceObserver.observe(svg.parentElement); });
    } else {
      window.addEventListener('resize', sizeTraces);
    }

    // Шрифты меняют высоту карточки уже после первого расчёта
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeTraces);
  }


  /* ----------------------------------------------------------
     7. ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ
     Запасной вариант для браузеров без scroll-behavior: smooth
     ---------------------------------------------------------- */
  var supportsSmooth = 'scrollBehavior' in document.documentElement.style;

  if (!supportsSmooth && !reduceMotion) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 88, behavior: 'smooth' });
      });
    });
  }


  /* ----------------------------------------------------------
     8. АКТИВНЫЙ ПУНКТ МЕНЮ
     ---------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, {
      // Узкая полоса у верха экрана: активна секция, которая под шапкой
      rootMargin: '-20% 0px -75% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

})();
