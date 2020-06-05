//================================слайдер===========================
window.onresize = function () { // обработчик на изменение ширины окна
  if (document.documentElement.clientWidth <= 767) {
    mobileVersion()
  } else {
    desktopVersion()
  }
}

"use strict";

(function () {

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
    '<p class="gallery__caption gallery__caption--1">Экскурсии по Израилю <br>и знакомство с его историей</p>\n' +
    '  </li>');
  let amountGallarySlides = galleryList.childElementCount;
  let indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  let leftEdgeGallary ;


  let tabs = document.querySelector('.programs__captions');
  let sliderFeedback = document.querySelector('.feedback');
  let displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  let displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  let listFeedback = sliderFeedback.querySelector('.feedback__list');
  let totalFeedbackSlides = listFeedback.childElementCount;


  let gallary = {
    slider: galleryList,
    transition: 300,
    indicator: true
  };

  let feedbackMobile = {
    slider: listFeedback,
    transition: 400,
    counter: true
  };

  let feedbackDesktop = {
    slider: sliderFeedback,
    DelayForStart: 5000,
    timeShowSlide: 6000,
    counter: true,
    tabIndex: true,
    buttonForward: sliderFeedback.querySelector(".slider__forward"),
    buttonBack: sliderFeedback.querySelector(".slider__back")
  }

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
// добавляем индикаторы слайдов
  while (amountGallarySlides--) {
    indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">')
  }
  indicatorContainer.children[0].classList.add('slider__ind-color');
  displayTotalSlide.textContent = totalFeedbackSlides + '';
  displayCurrentSlide.textContent = '1';

  let startSwype = function (obj) {

    let {
      slider,
      transition,
      counter,
      indicator
    } = obj

    let currentSlide = 0;
    let left = 0;
    let initialLeft = slider.offsetLeft;

    slider.querySelectorAll('img').forEach(img => img.draggable = false)

    slider.addEventListener(touch, function (e) {

      let itemWidth = this.offsetWidth;
      let containerWidth = itemWidth * this.childElementCount;
      let leftEdge = itemWidth - containerWidth;
      let x = isTouch ? e.changedTouches[0].clientX : e.clientX;
      let shiftX = x - this.offsetLeft;
      let ctx = this;
      let relativeLeft = 0;

      let onMove = function (e) {
        ctx.style.transition = '';
        let xMove = isTouch ? e.changedTouches[0].clientX : e.clientX;
        left = xMove - shiftX;

        if (left < leftEdge) {
          left = leftEdge;
        }

        if (left > initialLeft) {
          left = initialLeft;
        }

        ctx.style.left = left + 'px';
        relativeLeft = left % itemWidth;
      };


      let autoTranslate = function () {
        ctx.style.transition = transition + 'ms ease-in-out';

        if (indicator) {
          indicatorContainer.children[currentSlide].classList.remove('slider__ind-color');
        }

        if (counter) {
          displayCurrentSlide.textContent = 1 + currentSlide + '';
        }
        // если переместили больше чем на половину слайда сдвигаем до конца автоматически
        if (relativeLeft <= itemWidth * ( -50 / 100 )) {
          left += -itemWidth - relativeLeft;
        } else {
          left -= relativeLeft;
        }

        ctx.style.left = left + 'px';
        currentSlide = Math.round(Math.abs(left / itemWidth));

        if (indicator) {
          indicatorContainer.children[currentSlide].classList.add('slider__ind-color');
        }

        if (counter) {
          displayCurrentSlide.textContent = 1 + currentSlide + '';
        }
      };

      let onMouseUp = function () {
        autoTranslate();
        document.removeEventListener(touchMove, onMove);
        document.removeEventListener(touchUp, onMouseUp);
      };

      document.addEventListener(touchMove, onMove);
      document.addEventListener(touchUp, onMouseUp);
    });
  };

  //==================================================================================

  let startSlider = function (obj) {

    let {
      slider, // DOM элемент слайдера
      counter, // нужен ли счетчик слайдов
      indicator, // нужен ли индикатор слайдов
      tabIndex, // нужно ли отключать фокус на неактивных слайдах
      buttonForward,
      buttonBack
    } = obj

    let slideContainer = slider.querySelector('.slider__list');
    let amountSlides = slideContainer.childElementCount;
    let translate = 0;

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
        slideContainer.classList.add('slider__list--click-duration');
        let forward = this === buttonForward;
        if (indicator) { // для индикации слайдов
          indicatorContainer.children[translate].classList.remove('slider__ind-color');
        }
        if (tabIndex) { // для отключения перехода на непереключеный слайд
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
        if (tabIndex) {
          getFeedbackLink().tabIndex = 0;
        }
        if (counter) {
          displayCurrentSlide.textContent = translate + 1 + ''; // для вывода текущего слайда
        }
        moveSlide();
        disableButton();
      };

      buttonForward.addEventListener("click", onClickSlider);
      buttonBack.addEventListener("click", onClickSlider);
    }
  }

  window.mobileVersion = function () {
    startSwype(gallary);
    listFeedback.classList.remove('slider__list--click-duration');
    listFeedback.style.transform = 'translate(0)';
    listFeedback.style.left = 0;
    displayCurrentSlide.textContent = '1';
    feedbackDesktop.buttonBack.disabled = true;
    feedbackDesktop.buttonForward.disabled = true;
    startSwype(feedbackMobile);
  }

  window.desktopVersion = function () {
    listFeedback.style.left = 0;
    startSlider(feedbackDesktop);
    feedbackDesktop.buttonForward.disabled = false;
  }


  if (document.documentElement.clientWidth <= 767) {
    startSwype(gallary);
    startSwype(feedbackMobile);
  }

  if (document.documentElement.clientWidth > 767) {
    startSlider(feedbackDesktop);
  }

})();

