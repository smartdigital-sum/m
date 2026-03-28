(function () {
  'use strict';

  const KidUtils = {
    shuffleArray(array) {
      const newArray = array.slice();
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },

    $(selector) {
      return document.querySelector(selector);
    },

    $$(selector) {
      return document.querySelectorAll(selector);
    },

    el(tag, attrs, children) {
      const elem = document.createElement(tag);
      if (attrs) {
        Object.entries(attrs).forEach(([key, val]) => {
          if (key === 'className') elem.className = val;
          else if (key === 'textContent') elem.textContent = val;
          else if (key.startsWith('on')) elem.addEventListener(key.slice(2).toLowerCase(), val);
          else elem.setAttribute(key, val);
        });
      }
      if (children) {
        if (typeof children === 'string') elem.innerHTML = children;
        else if (Array.isArray(children)) children.forEach(c => elem.appendChild(c));
      }
      return elem;
    },

    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 0, b: 0 };
    },

    saveScore(game, data) {
      try {
        const key = 'kidsGameScores_' + game;
        const existing = JSON.parse(localStorage.getItem(key) || '{}');
        const merged = Object.assign({}, existing, data);
        localStorage.setItem(key, JSON.stringify(merged));
      } catch (e) {}
    },

    loadScore(game) {
      try {
        return JSON.parse(localStorage.getItem('kidsGameScores_' + game) || '{}');
      } catch (e) {
        return {};
      }
    }
  };

  window.KidUtils = KidUtils;
})();
