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
    '      <img src="img/desktop/1@1x.png" srcset="img/desktop/1@2x.png 2x" width="482"\n' +
    '           height="732" alt="фоновое изображение">\n' +
    '    </picture>\n' +
    '  </li>')
  let indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  sliderGallery.classList.remove('no-js');
  //=======================================================================
  let sliderFeedback = document.querySelector('.feedback');
  let displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  let displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  let autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');


  let objGallery = {
    slider: document.querySelector('.gallery__slider'),
    indicator: true
  }

  let objFeedback = {
    slider: document.querySelector('.feedback'),
    DelayForStart: 5000,
    timeShowSlide: 4000,
    counter: true,
  }

  let startSlider = function (obj) {

    let {
      slider,
      DelayForStart,
      timeShowSlide,
      counter,
      indicator
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
        console.log(document.documentElement.clientWidth);
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
        if (counter) {
          displayCurrentSlide.textContent = translate + 1 + ''; // для вывода текущего слайда
        }
        moveSlide();
        disableButton();
        if (DelayForStart) {
          startAutoScroll();
        }
      };

      let appendSlide = function () { // переместить первый слайд в конец списка
        slideContainer.classList.remove('slider__list--auto-duration');
        moveSlide();
        slideContainer.appendChild(slideContainer.firstElementChild);
      }

      //для автоматической прокрутки слайдов
      function scrollAuto() {
        slideContainer.classList.remove('slider__list--click-duration');
        if (translate === 0) {
          disableButton();
          translate += 1;
          displayCurrentSlide.textContent = '1';
          slideContainer.classList.add('slider__list--auto-duration');
          moveSlide();
          translate -= 1;
          delaySlide = setTimeout(appendSlide, autoDuration)
        }
        if (translate > 0) {
          while (translate > 0) {
            translate--
            appendSlide()
          }
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

} )();

