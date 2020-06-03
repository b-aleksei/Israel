"use strict";
//=========================секция программы==================================================
( function () {

  let tabs = document.querySelector('.programs__captions');
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
    let x = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
    let shiftX = x - this.offsetLeft;

    let onMove = function (e) {
      let xMove = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
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

    let onMouseUp = function () {
      document.removeEventListener(touchMove, onMove);
      document.removeEventListener(touchUp, onMouseUp);
    };
    document.addEventListener(touchUp, onMouseUp);
  });

} )();

"use strict";

( function () {

  let pageForms = document.querySelectorAll('[data-send-form]');
  let storage = {};
  let form = document.querySelector(".modal__form");
  let inputsModal = form.querySelectorAll(".modal__input");
  let phone = form.querySelector('.modal__input-phone');
  let name = form.querySelector('.modal__input-name');
  let contactName = document.querySelector('.contact__input--name');
  let inputs = document.querySelectorAll('input:not([type=checkbox])');

  let openClosePopup = function (obj) {

    let {
      overlay, // оверлей с модальным окном
      classHidden, // класс с dispay: none
      buttonsOpener, // кнопки открытия окна(массив)
      buttonsClose, // кнопки закрытия окна(массив)
      doAction, // что то сделать при открытии мод. окна
      endAction // что то сделать при закрытии мод. окна
    } = obj

    let body = document.body
    // открытие попапа
    let openPopup = function (e) {
      if (e) {
        e.preventDefault();
      }
      overlay.classList.remove(classHidden);
      document.addEventListener("keydown", onCloseModalKey);
      overlay.addEventListener("mousedown", onCloseModalMouse);
      if (doAction) doAction();
      //  для предотвращения скрола
      body.dataset.scrollY = self.pageYOffset // сохраним значение скролла
      body.classList.add('body-lock')
      body.style.top = body.dataset.scrollY + 'px'
    }
//  Обработчик на оверлее для закрытия попапа по клику на нем или на соотв. кнопки
    let onCloseModalMouse = function (e) {
      e.stopPropagation();
      let isButtonClose = Array.from(buttonsClose).some(function (button) {
        return e.target === button
      });
      if (e.target === this || isButtonClose) {
        removeHandler()
      }
    }

    let onCloseModalKey = function (e) {
      if (e.key === "Escape" && e.target.tagName !== "INPUT") {
        removeHandler()
      }
    }

    let removeHandler = function () {
      overlay.classList.add(classHidden);
      document.removeEventListener("keydown", onCloseModalKey);
      overlay.removeEventListener("mousedown", onCloseModalMouse);
      //  для предовращения скрола
      body.classList.remove('body-lock')
      window.scrollTo(0, body.dataset.scrollY);
      if (endAction) {
        endAction() // если колбэк определен вызываем его, что то сделать после закрытия окна
      }
    }
    // навершиваем на каждую кнопку обработчик открытия попапа
    if (buttonsOpener) {
      buttonsOpener.forEach(function (button) {
        button.addEventListener("click", openPopup)
      })
    } else openPopup()
  }


  let submitForm = function (e) {
    inputsModal.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value)
    })
    modalCall.overlay.classList.add(modalCall.classHidden);
    openClosePopup(modalSuccess)
    e.preventDefault();
  }

  let doAction = function () {
    form.addEventListener('focusin', onValidate);
    name.focus();
    inputsModal.forEach(function (input) {
      input.parentElement.classList.remove('invalid');
    })
    form.addEventListener("submit", submitForm)
  }

  let endAction = function () {
    form.removeEventListener("submit", submitForm);
    form.removeEventListener('focusin', onValidate);
  }

  let modalSuccess = {
    overlay: document.querySelector(".modal--success-invisible"),
    classHidden: 'modal--success-invisible',
    buttonsClose: document.querySelectorAll(".modal__close--success, .modal__ok"),
  }

  let modalCall = {
    overlay: document.querySelector(".modal--call-invisible"),
    classHidden: 'modal--call-invisible',
    buttonsOpener: document.querySelectorAll("[data-modal-opener]"),
    buttonsClose: document.querySelectorAll(".modal__close--call"),
    doAction,
    endAction
  }

  openClosePopup(modalCall);

  // ======================валидация телефона===================================================

  const START_INDEX = 4;
  const FIRST_NUMBER = '7';
  let substrateThree = '___';
  let substrateTwo = '__';
  let delimiter = ' ';
  let regExp = /^7? ?\(?(\d{0,3})\)? ?(\d{0,3})-?(\d{0,2})-?(\d{0,2})/;
  let regE = /7.*/
  let pln = /(?:\d\D*)$/g; // позиция последней цифры
  let controlKeys = ["Tab", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];


  let enterPhoneValue = function (e) {

    let isControlKey = controlKeys.some(function (key) {
      return e.key === key
    })

    if (!e.ctrlKey && !isControlKey) {

      let cursor = this.selectionStart = this.selectionEnd
      setTimeout(() => {
        let number = this.value.match(regE) || [FIRST_NUMBER]
        let arr = Array.from(number[0])
        let str = arr.filter(item => /\d/.test(item))
        str = str.join('').slice(0, 11)
        this.value = str.replace(regExp, (m, p1, p2, p3, p4) => {
          return '+' + FIRST_NUMBER + ' (' + ( p1 + substrateThree ).slice(0, substrateThree.length) + ') '
            + ( p2 + substrateThree ).slice(0, substrateThree.length) + delimiter
            + ( p3 + substrateTwo ).slice(0, substrateTwo.length) + delimiter
            + ( p4 + substrateTwo ).slice(0, substrateTwo.length);
        });
        // управление курсором
        let search = this.value.search(pln);
        this.selectionStart = this.selectionEnd = ( e.key === 'Delete' ) ? cursor : search + 1;
        if (cursor < START_INDEX) {
          this.selectionStart = this.selectionEnd = START_INDEX
        }
        checkValidity.call(this)
      }, 1)
    }
  };

  let checkValidity = function () {
    if (!this.validity.valid) {
      this.parentElement.classList.remove('valid')
      this.parentElement.classList.add('invalid')
    } else {
      this.parentElement.classList.remove('invalid')
      this.parentElement.classList.add('valid')
    }
  };

  let onValidate = function (e) {
    if (e.target.name === 'phone' ) {
      e.target.addEventListener('keydown', enterPhoneValue);
    }

    if (e.target.name === 'name') {
      e.target.addEventListener('input', checkValidity);
    }
    this.addEventListener('focusout', deleteHandler);
  }

  let deleteHandler = function (e) {
    if (e.target.name === 'phone') {
      phone.removeEventListener('keydown', enterPhoneValue);
    }
    if (e.target.name === 'name') {
      name.removeEventListener('input', checkValidity);
    }
    form.removeEventListener('focusout', deleteHandler);
  }

  // валидация форм на главной странице
  pageForms.forEach(function (form) {
    form.addEventListener('focusin', onValidate);
    form.addEventListener('submit', function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value)
      })
      openClosePopup(modalSuccess);
      e.preventDefault();
    });
  });

  // всем инпутам ставим значение из localStorage
  inputs.forEach(function (input) {
    input.parentElement.classList.remove('invalid')
    input.value = storage[input.name] = localStorage.getItem(input.name)
  })

} )();




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
    '  </li>')
  let indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  sliderGallery.classList.remove('no-js');
  //=======================================================================
  let sliderFeedback = document.querySelector('.feedback');
  let displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  let displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  let autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');
  let listFeedback = sliderFeedback.querySelector('.feedback__list');



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

} )();

