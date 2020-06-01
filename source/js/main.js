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
  // modalCall = null
  // ======================валидация телефона===================================================
  const START_INDEX = 4;
  const CLOSE_BRACE = 6;
  const FIRST_NUMBER = "7";
  let marker = '_';
  let sep = ' ';
  let startSelection = 0;
  let endSelection = 0;
  let pastePattern = ['+', '9', ' ', '(', '9', '9', '9', ')', ' ', '9', '9', '9', sep, '9', '9', sep, '9', '9'];
  let pattern = ['+', FIRST_NUMBER, ' ', '(', marker, marker, marker, ')', ' ', marker, marker, marker, sep, marker, marker, sep, marker, marker];
  let controlKeys = ["Tab", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
  let result = pattern.slice();
  let focus;
  let initialValue = pattern.join('');

  let checkValidity = function (inp) {
    if (!inp.validity.valid) {
      inp.parentElement.classList.remove('valid')
      inp.parentElement.classList.add('invalid')
    } else {
      inp.parentElement.classList.remove('invalid')
      inp.parentElement.classList.add('valid')
    }
  };

  let pasteValue = function () {
    let ctx = this
    setTimeout(function () {
      let value = Array.from(ctx.value).filter(function (item) {
        return /\d/.test(item)
      });
      value.reverse();
      let pattern = pastePattern.slice();
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== '9') continue;
        pattern[i] = value.pop() || marker;
      }
      pattern[1] = FIRST_NUMBER;
      result = pattern;
      ctx.value = pattern.join('');
      startSelection = endSelection = 0;
      checkValidity(ctx);
    })
  };

  let enterValue = function (e) {
    startSelection = this.selectionStart;
    endSelection = this.selectionEnd;
    let IsSelection = startSelection !== endSelection;
    if (!e.ctrlKey) { // всегда начинать с первого символа в скобках
      focus = this.selectionStart < START_INDEX ? this.selectionStart = START_INDEX : this.selectionStart;
    }

    let isControlKey = controlKeys.some(function (key) {
      return e.key === key
    })

    if (!isControlKey && !e.ctrlKey) {
      e.preventDefault();
      if (IsSelection) {
        let clearData = pattern.slice(startSelection, endSelection);
        result.splice(startSelection, endSelection - startSelection, ...clearData);
      }
      if (/\d/.test(e.key) && focus < result.length) {
        let index = result.indexOf(marker);
        let separator = result.indexOf(sep, this.selectionStart);

        if (index === -1) {
          for (let i = this.selectionStart; i < result.length; i++) {
            index = i;
            if (/\d/.test(result[i])) break;
          }
        }
        result[index] = e.key;
        focus = ( index === CLOSE_BRACE ) ? CLOSE_BRACE + 2 : ( separator - index === 1 ) ? index + 1 : index;

      } else {
        if (e.key === 'Backspace') {
          if (!IsSelection && result[focus - 1] !== '(') {
            let insert;
            switch (result[this.selectionStart - 1]) {
              case ' ' :
                insert = ' ';
                break;
              case ')' :
                insert = ')';
                break;
              default :
                insert = marker;
            }

            result.splice(this.selectionStart - 1, 1, insert);
            focus -= 1
          }
        }

        if (e.key === 'Delete' && !IsSelection) {
          let index = result.slice(focus).findIndex(function (item) {
            return /\d/.test(item)
          });
          if (~index) {
            result[focus + index] = marker;
          }
        }
      }

      this.value = result.join('');
      this.selectionStart = this.selectionEnd = focus + 1;

      if (!/\d/.test(e.key)) {
        this.selectionStart = this.selectionEnd = focus;
      }
    }
    checkValidity(this);
  };


  let deleteHandler = function (e) {
    if (e.target === phone) {
      phone.removeEventListener('paste', pasteValue);
      phone.removeEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.removeEventListener('input', checkContactName);
    }
    form.removeEventListener('focusout', deleteHandler);
  }

  let checkContactName = function () {
    checkValidity(contactName)
  }

  let onValidate = function (e) {
    if (e.target.name === 'phone') {
      let phone = e.target;
      phone.value = phone.value || storage[phone.name] || initialValue;
      setTimeout(function () {
        phone.selectionStart = phone.selectionEnd = focus || START_INDEX;
      });
      initialValue = '';
      phone.addEventListener('paste', pasteValue);
      phone.addEventListener('keydown', enterValue);
    }

    if (e.target.name === 'name') {
      let name = e.target;
      name.addEventListener('input', checkContactName);
    }
    this.addEventListener('focusout', deleteHandler);
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
    let value = storage[input.name] = localStorage.getItem(input.name)
    if (value) {
      input.value = value
    }
  })
  if (storage['phone']) {
    result = storage['phone'].split('')
  }

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

