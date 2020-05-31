"use strict";
//========пунктир в секции conditions ====================================

( function () {

  let list = document.querySelector('.condition__list');
  let firstItem = document.querySelector('.condition__item--1');
  let lastItem = document.querySelectorAll('.condition__item');
  lastItem = lastItem[lastItem.length - 1];
  let heightFirstItem = getComputedStyle(firstItem).getPropertyValue('height')
  let heightLastItem = getComputedStyle(lastItem).getPropertyValue('height')
  let heightList = getComputedStyle(list).getPropertyValue('height')
  let lineHeight = parseInt(heightList) - parseInt(heightFirstItem) / 2 - parseInt(heightLastItem) / 2;
  list.style.setProperty('--line-dashed', lineHeight + 'px')

} )();
