/* ==========================================================================
   Юго Запад Hall — движение
   Библиотека Motion (motion.dev), UMD-сборка из vendor/motion.js.

   Принцип: страница полностью видима без JavaScript. Скрипт сам прячет
   элементы перед тем, как проявить их, — поэтому при ошибке загрузки,
   отключённом JS или системной настройке «уменьшить движение» пользователь
   видит обычную статичную страницу, а не пустые блоки.
   ========================================================================== */

(function () {
  "use strict";

  var M = window.Motion;
  if (!M) return;

  /* Системная настройка важнее любых наших намерений */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Мягкий ease-out: быстрый старт, длинное успокоение */
  var EASE = [0.22, 1, 0.36, 1];
  var SHIFT = 18; /* px — сдвиг снизу вверх при появлении */

  var toArray = function (list) {
    return Array.prototype.slice.call(list);
  };

  /* ------------------------------------------------------------------
     1. Первый экран
     ------------------------------------------------------------------ */

  function initHero() {
    var hero = document.querySelector(".hero");
    if (!hero) return;

    var items = toArray(
      hero.querySelectorAll(
        ".hero__title, .hero__lead, .hero__actions, .hero__note"
      )
    );

    if (items.length) {
      items.forEach(function (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(14px)";
        el.style.willChange = "opacity, transform";
      });

      M.animate(
        items,
        { opacity: [0, 1], y: [14, 0] },
        { duration: 0.7, ease: EASE, delay: M.stagger(0.12) }
      ).finished.then(function () {
        items.forEach(function (el) {
          el.style.willChange = "";
        });
      });
    }

    /* Параллакс фона: кадр уезжает медленнее страницы.
       Слой заранее увеличен по высоте, иначе при сдвиге сверху появилась бы
       полоса пустоты. Размеры задаются здесь, а не в CSS, — без анимации
       фон остаётся ровно на своём месте. */
    var bg = hero.querySelector(".hero__bg");
    if (bg && typeof M.scroll === "function") {
      bg.style.top = "-18%";
      bg.style.height = "136%";

      M.scroll(M.animate(bg, { y: [0, 100] }, { ease: "linear" }), {
        target: hero,
        offset: ["start start", "end start"]
      });
    }
  }

  /* ------------------------------------------------------------------
     2. Появление при скролле
     ------------------------------------------------------------------ */

  var claimed = [];

  function isCovered(el) {
    for (var i = 0; i < claimed.length; i++) {
      if (claimed[i] !== el && claimed[i].contains(el)) return true;
    }
    return false;
  }

  function hide(els) {
    els.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(" + SHIFT + "px)";
      el.style.willChange = "opacity, transform";
      claimed.push(el);
    });
  }

  /* Один раз: как только сработало — перестаём наблюдать,
     поэтому при обратной прокрутке ничего не повторяется. */
  function watch(trigger, els) {
    var fired = false;
    var stop = M.inView(
      trigger,
      function () {
        if (fired) return;
        fired = true;
        if (typeof stop === "function") stop();

        M.animate(
          els,
          { opacity: [0, 1], y: [SHIFT, 0] },
          { duration: 0.55, ease: EASE, delay: M.stagger(0.07) }
        ).finished.then(function () {
          els.forEach(function (el) {
            el.style.willChange = "";
          });
        });
      },
      { amount: 0.15, margin: "0px 0px -6% 0px" }
    );
  }

  function initReveal() {
    var pending = [];

    /* Каскад внутри ряда: соседние карточки появляются друг за другом */
    var groupSelectors = [".facts", ".gallery", ".grid", ".split", ".footer__grid"];

    groupSelectors.forEach(function (sel) {
      toArray(document.querySelectorAll(sel)).forEach(function (container) {
        if (container.closest(".hero")) return;
        var items = toArray(container.children);
        if (!items.length) return;
        hide(items);
        pending.push({ trigger: container, els: items });
      });
    });

    /* Одиночные элементы — всё, что не попало в каскад */
    var singleSelectors = [".section__head", ".lines", ".btn-row", ".ph"];

    singleSelectors.forEach(function (sel) {
      toArray(document.querySelectorAll(sel)).forEach(function (el) {
        if (el.closest(".hero")) return;
        if (isCovered(el)) return;
        hide([el]);
        pending.push({ trigger: el, els: [el] });
      });
    });

    pending.forEach(function (group) {
      watch(group.trigger, group.els);
    });
  }

  function init() {
    initHero();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
