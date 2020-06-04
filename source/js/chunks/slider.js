"use strict";
//================================слайдер===========================
( function () {

  let sliderGallery = document.querySelector('.gallery__slider');
  let galleryList = sliderGallery.querySelector('.gallery__list');
  galleryList.insertAdjacentHTML("beforeend", '  <li class="gallery__item gallery__item--1 slider__item">\n' +
    '    <picture>\n' +
    '      <source type="image/webp" media="(max-width: 767px)"\n' +
    '              srcset="img/mobile/1_m@1x.webp 1x, img/mobile/1_m@2x.webp 2x">\n' +
    '      <source media="(max-width: 767px)"\n' +
    '              srcset="img/mobile/1_m@1x.jpg 1x, img/mobile/1_m@2x.jpg 2x">\n' +
    '      <source type="image/webp" srcset="img/desktop/1@1x.webp 1x, img/desktop/1@2x.webp 2x">\n' +
    '      <!-- 1x: 482; 2x 964px -->' +
    '      <img src="img/desktop/1@1x.png" srcset="img/desktop/1@2x.png 2x" width="482"\n' +
    '           height="732" alt="фоновое изображение">\n' +
    '    </picture>\n' +
    '  </li>');
  let amountSlides = galleryList.querySelectorAll('.slider__item').length;
  let indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  //=======================================================================
  let sliderFeedback = document.querySelector('.feedback');
  let displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  let displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  let autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');
  let listFeedback = sliderFeedback.querySelector('.feedback__list');
  let currentSlide = 0;
  let transition = 300;

  let initialLeft = galleryList.offsetLeft;
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

  sliderGallery.classList.remove('no-js');

  let startSlider = function (slider) {

    slider.addEventListener(touch, function (e) {
      // let screen = document.documentElement.clientWidth;
      let itemWidth = this.offsetWidth;
      let containerWidth = itemWidth * (this.children.length)
      let difference = itemWidth - containerWidth;
      let x = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
      let shiftX = x - this.offsetLeft;
      let ctx = this;
      let left;
      let relativeLeft;

      let onMove = function (e) {
        galleryList.style.transition = ''
        let xMove = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
        left = xMove - shiftX;
        if (left < difference) {
          left = difference
        }
        if (left > initialLeft) {
          left = initialLeft
        }

        ctx.style.left = left + 'px';
        relativeLeft = left % itemWidth;
      };
      document.addEventListener(touchMove, onMove);

      let autoTranslate = function () {
        galleryList.style.transition = transition + 'ms ease-in-out';
        indicatorContainer.children[currentSlide].classList.remove('slider__ind-color');
        // если переместили больше чем на половину слайда сдвигаем до конца автоматически
        if (relativeLeft <= itemWidth * (-50 / 100)) {
          left += -itemWidth - relativeLeft
        } else {
          left -= relativeLeft
        }
        ctx.style.left = left + 'px';
        currentSlide = Math.abs(left / itemWidth);
        indicatorContainer.children[currentSlide].classList.add('slider__ind-color');
      }

      let onMouseUp = function () {
        autoTranslate()
        document.removeEventListener(touchMove, onMove);
        document.removeEventListener(touchUp, onMouseUp);
      };
      document.addEventListener(touchUp, onMouseUp);
    });
  }

  startSlider(galleryList)
  startSlider(listFeedback)




/*    window.onresize = function () { // обработчик на изменение ширины окна
      if (document.documentElement.clientWidth >= 767) {
        indicatorContainer.children[currentSlide].classList.remove('slider__ind-color');
        currentSlide = 0
        indicatorContainer.children[currentSlide].classList.add('slider__ind-color');
        // slideContainer.style.transform = 'translate(0)';
      }
    }*/
    for (let i = 0; i < amountSlides; i++) { // добавляем индикаторы слайдов
      indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">')
    }
    indicatorContainer.children[currentSlide].classList.add('slider__ind-color');


/*

  let objGallery = {
    slider: document.querySelector('.gallery__slider'),
    indicator: true
  }

  let objFeedback = {
    slider: document.querySelector('.feedback'),
    DelayForStart: 5000,
    timeShowSlide: 6000,
    counter: true,
    tabIndex: true
  }

  let startSlider = function (obj) {

    let {
      slider, // DOM элемент слайдера
      DelayForStart, // через сколько времени запустить автоскролл(мс)
      timeShowSlide, // время показа слада
      counter, // нужен ли счетчик слайдов
      indicator, // нужен ли индикатор слайдов
      tabIndex // нужно ли отключать фокус на неактивных слайдах
    } = obj

    let buttonForward = slider.querySelector(".slider__forward");
    let buttonBack = slider.querySelector(".slider__back");
    let slideContainer = slider.querySelector('.slider__list');
    let amountSlides = slider.querySelectorAll('.slider__item').length;
    let translate = 0;
    let delaySlide;
    let intervalSlider;
    let timer;

    //показ текущего и суммы слайдов
    if (counter) {
      displayTotalSlide.textContent = amountSlides + '';
      displayCurrentSlide.textContent = translate + 1 + '';
    }

    if (indicator) {
      window.onresize = function () { // обработчик на изменение ширины окна
        if (document.documentElement.clientWidth >= 767) {
          indicatorContainer.children[translate].classList.remove('slider__ind-color');
          translate = 0
          indicatorContainer.children[translate].classList.add('slider__ind-color');
          slideContainer.style.transform = 'translate(0)';
          buttonForward.disabled = false;
          buttonBack.disabled = true;
        }
      }
      for (let i = 0; i < amountSlides; i++) { // добавляем индикаторы слайдов
        indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">')
      }
      indicatorContainer.children[translate].classList.add('slider__ind-color');
    }

    let getFeedbackLink = function () { // вспомогательная функция, ищет элемент
      return listFeedback.children[translate].querySelector('.feedback__details');
    }


    if (amountSlides > 1) { // если слайдов больше чем 1

      buttonBack.disabled = true; // кнопка назад изначально отключена

      let moveSlide = function () { // переместить слайд на 100% ширины
        slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
      }
      //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки
      let disableButton = function () {
        if (translate === 0) {
          buttonBack.disabled = true;
          buttonForward.disabled = false;
        } else if (translate === amountSlides - 1) {
          buttonForward.disabled = true;
        } else {
          buttonBack.disabled = buttonForward.disabled = false;
        }
      };
      // для ручного переключения сладов
      let onClickSlider = function () {
        clearTimeout(timer);
        clearTimeout(delaySlide);
        clearInterval(intervalSlider);
        slideContainer.classList.add('slider__list--click-duration');
        slideContainer.classList.remove('slider__list--auto-duration');
        let forward = this === buttonForward;
        if (indicator) { // для индикации слайдов
          indicatorContainer.children[translate].classList.remove('slider__ind-color');
        }
        if(tabIndex) { // для отключения перехода на непереключеный слайд
          getFeedbackLink().tabIndex = -1;
        }
        if (forward && translate < amountSlides - 1) {
          buttonBack.disabled = false;
          translate += 1;
        } else if (!forward && translate > 0) {
          buttonForward.disabled = false;
          translate -= 1;
        }
        if (indicator) {
          indicatorContainer.children[translate].classList.add('slider__ind-color');
        }
        if(tabIndex) {
          getFeedbackLink().tabIndex = 0;
        }
        if (counter) {
          displayCurrentSlide.textContent = translate + 1 + ''; // для вывода текущего слайда
        }
        moveSlide();
        disableButton();
      };

      let appendSlide = function () { // переместить первый слайд в конец списка
        slideContainer.classList.remove('slider__list--auto-duration');
        moveSlide();
        slideContainer.appendChild(slideContainer.firstElementChild);
        if(tabIndex && translate === 0) { // для отключения перехода на непереключеный слайд
          getFeedbackLink().tabIndex = 0;
        }
      }

      //для автоматической прокрутки слайдов
      function scrollAuto() {
        slideContainer.classList.remove('slider__list--click-duration');
        if (translate === 0) {
          if(tabIndex) {
            getFeedbackLink().tabIndex = -1;
          }
          disableButton();
          translate += 1;
          displayCurrentSlide.textContent = '1';
          slideContainer.classList.add('slider__list--auto-duration');
          moveSlide();
          translate -= 1;
          delaySlide = setTimeout(appendSlide, autoDuration)
        }
      }

      let startAutoScroll = function () {
        timer = setTimeout(function () {
          intervalSlider = setInterval(function () {
            scrollAuto();
          }, timeShowSlide || 4000);
        }, DelayForStart)
      };

      buttonForward.addEventListener("click", onClickSlider);
      buttonBack.addEventListener("click", onClickSlider);

      // для запуска автоскролла
      if (typeof DelayForStart === 'number') {
        autoDuration = parseInt(autoDuration) || 1000;
        if (typeof autoDuration === 'number' && typeof timeShowSlide === 'number') {
          timeShowSlide += autoDuration
        }
        startAutoScroll()
      }
    }
  }

  startSlider(objFeedback);
  startSlider(objGallery);
  objFeedback = null;
  objGallery = null;
*/

} )();

