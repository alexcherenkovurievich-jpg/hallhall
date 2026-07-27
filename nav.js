/* ==========================================================================
   Юго Запад Hall — мобильное меню
   Отдельный файл от animations.js: меню обязано работать всегда, в том числе
   при системной настройке «уменьшить движение», где анимации отключены.

   Без JavaScript меню остаётся раскрытым списком — ссылки доступны всегда.
   Класс .js на <html> включает свёрнутое состояние, поэтому скрытие
   появляется только тогда, когда есть чему его разворачивать.
   ========================================================================== */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  function init() {
    var header = document.querySelector(".header");
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.getElementById("site-nav");
    if (!header || !toggle || !panel) return;

    var DESKTOP = window.matchMedia("(min-width: 1024px)");

    function setOpen(open) {
      header.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }

    function close() {
      setOpen(false);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    /* Переход по якорю закрывает меню, иначе панель перекрывает цель */
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-nav-open")) {
        close();
        toggle.focus();
      }
    });

    /* Клик мимо панели */
    document.addEventListener("click", function (e) {
      if (!header.classList.contains("is-nav-open")) return;
      if (header.contains(e.target)) return;
      close();
    });

    /* На десктопе панель всегда раскрыта — сбрасываем состояние,
       чтобы после поворота экрана меню не осталось «открытым» */
    var onChange = function () {
      if (DESKTOP.matches) close();
    };
    if (typeof DESKTOP.addEventListener === "function") {
      DESKTOP.addEventListener("change", onChange);
    } else if (typeof DESKTOP.addListener === "function") {
      DESKTOP.addListener(onChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
