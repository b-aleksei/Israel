"use strict";

(function () {

let tabs = document.querySelector('.tabs__guide');
let initialLeft = tabs.offsetLeft;
let isTouch = false;
let touch = 'mousedown';
let touchMove = 'mousemove';
let touchUp = 'mouseup';
if ('ontouchstart' in window) {
 isTouch = true;
  touch = 'touchstart';
  touchMove = 'touchmove';
  touchUp = 'touchend';
}

tabs.addEventListener(touch, function (e) {
  let screen = document.documentElement.clientWidth;
  let difference = screen - this.offsetWidth;
  let x = (isTouch) ? e.changedTouches[0].clientX : e.clientX;
  let shiftX = x - this.offsetLeft;

  let onMove = function (e) {
    let xMove = (isTouch) ? e.changedTouches[0].clientX : e.clientX;
    let left = xMove - shiftX;
    if (left < difference) {
      left = difference
    }
    if (left > initialLeft) {
      left = initialLeft
    }
    tabs.style.left = left + 'px';
  };
  document.addEventListener(touchMove, onMove);

  let onMouseUp = () => {
    document.removeEventListener(touchMove, onMove);
    document.removeEventListener(touchUp, onMouseUp);
  };
  document.addEventListener(touchUp, onMouseUp);
});

})();
