"use strict"; // для поддержки forEach в IE11

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

(function () {
  var onPopupOpener = function onPopupOpener(overlay, classHidden, modalOpeners, buttonsClose) {
    var doAction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    /*
    Попап открывается посредством удаления класса со св-м display: none
    * overlay - див с модальным окном(попапом)
    * classHidden - клас с свойством: display: none
    * modalOpeners - массив кнопок открытия попапа
    * buttonClose - кнопка закрытия попапа
    * buttonCloseOther - дполнителная кнопка закрытия окна
    .body-lock {overflow-y: scroll; position:fixed;}
    * */
    var body = document.body; // открытие попапа

    var openPopup = function openPopup(e) {
      if (e) {
        e.preventDefault();
      }

      overlay.classList.remove(classHidden);
      document.addEventListener("keydown", onCloseModalKey);
      overlay.addEventListener("click", onCloseModalMouse);
      if (doAction) doAction(); //  для предотвращения скрола

      body.dataset.scrollY = self.pageYOffset; // сохраним значение скролла

      body.classList.add('body-lock');
      body.style.top = body.dataset.scrollY + 'px';
    }; //  Обработчик на оверлее для закрытия попапа по клику на нем или на соотв. кнопки


    var onCloseModalMouse = function onCloseModalMouse(e) {
      e.stopPropagation();
      var isButtonClose = Array.from(buttonsClose).some(function (button) {
        return e.target === button;
      });

      if (e.target === this || isButtonClose) {
        removeHandler();
      }
    };

    var onCloseModalKey = function onCloseModalKey(e) {
      if (e.key === "Escape" && e.target.tagName !== "INPUT") {
        removeHandler();
      }
    };

    var removeHandler = function removeHandler() {
      overlay.classList.add(classHidden);
      document.removeEventListener("keydown", onCloseModalKey);
      overlay.removeEventListener("click", onCloseModalMouse); //  для предовращения скрола

      body.classList.remove('body-lock');
      window.scrollTo(0, body.dataset.scrollY);

      if (typeof overlay.endAction === 'function') {
        overlay.endAction(); // эта функция снаружи что то делает после закрытия окна
      }
    }; // навершиваем на каждую кнопку обработчик открытия попапа


    if (modalOpeners) {
      modalOpeners.forEach(function (button) {
        button.addEventListener("click", openPopup);
      });
    } else openPopup();
  };

  var modalOpeners = document.querySelectorAll("[data-modal-opener]");
  var classHidden = "modal--call-invisible";
  var modalCall = document.querySelector("." + classHidden);
  var modalCallClose = modalCall.querySelectorAll(".modal__close--call");
  var classHiddenSuccess = "modal--success-invisible";
  var modalSuccess = document.querySelector("." + classHiddenSuccess);
  var pageForms = document.querySelectorAll('[data-send-form]');
  var modalSuccessClose = modalSuccess.querySelectorAll(".modal__close--success, .modal__ok");
  var storage = {};
  var form = modalCall.querySelector(".modal__form");
  var inputsModal = form.querySelectorAll(".modal__input");
  var phone = form.querySelector('.modal__input-phone');
  var name = form.querySelector('.modal__input-name');

  modalCall.endAction = function () {
    form.removeEventListener("submit", submitForm);
    form.removeEventListener('focusin', onValidate);
  };

  inputsModal.forEach(function (input) {
    storage[input.name] = localStorage.getItem(input.name);
  });

  var submitForm = function submitForm(e) {
    inputsModal.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value);
    });
    modalCall.classList.add(classHidden);
    onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
    e.preventDefault();
  };

  var doAction = function doAction() {
    form.addEventListener('focusin', onValidate);
    name.focus();
    inputsModal.forEach(function (input) {
      var value = storage[input.name];

      if (value) {
        input.value = value;
      }

      input.parentElement.classList.remove('invalid');
    });
    form.addEventListener("submit", submitForm);
  };

  onPopupOpener(modalCall, classHidden, modalOpeners, modalCallClose, doAction); // ======================валидация телефона===================================================

  var START_INDEX = 4;
  var CLOSE_BRACE = 6;
  var FIRST_NUMBER = "7";
  var marker = '_';
  var sep = ' ';
  var startSelection = 0;
  var endSelection = 0;
  var pastePattern = ['+', '9', ' ', '(', '9', '9', '9', ')', ' ', '9', '9', '9', sep, '9', '9', sep, '9', '9'];
  var pattern = ['+', FIRST_NUMBER, ' ', '(', marker, marker, marker, ')', ' ', marker, marker, marker, sep, marker, marker, sep, marker, marker];
  var controlKeys = ["Tab", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
  var result = pattern.slice();
  var focus;
  var initialValue = pattern.join('');

  var checkValidity = function checkValidity(inp) {
    if (!inp.validity.valid) {
      inp.parentElement.classList.remove('valid');
      inp.parentElement.classList.add('invalid');
    } else {
      inp.parentElement.classList.remove('invalid');
      inp.parentElement.classList.add('valid');
    }
  };

  var pasteValue = function pasteValue() {
    var ctx = this;
    setTimeout(function () {
      var value = Array.from(ctx.value).filter(function (item) {
        return /\d/.test(item);
      });
      value.reverse();
      var pattern = pastePattern.slice();

      for (var i = 0; i < pattern.length; i++) {
        if (pattern[i] !== '9') continue;
        pattern[i] = value.pop() || marker;
      }

      pattern[1] = FIRST_NUMBER;
      result = pattern;
      ctx.value = pattern.join('');
      startSelection = endSelection = 0;
      checkValidity(ctx);
    });
  };

  var selectValue = function selectValue() {
    startSelection = this.selectionStart;
    endSelection = this.selectionEnd;
  };

  var enterValue = function enterValue(e) {
    var IsSelectionTrue = startSelection !== endSelection;

    if (!e.ctrlKey) {
      focus = this.selectionStart < START_INDEX ? this.selectionStart = START_INDEX : this.selectionStart;
    }

    var isControlKey = controlKeys.some(function (key) {
      return e.key === key;
    });

    if (!isControlKey && !e.ctrlKey) {
      e.preventDefault();

      if (IsSelectionTrue && this.selectionStart !== this.selectionEnd) {
        var _result;

        var clearData = pattern.slice(startSelection, endSelection);

        (_result = result).splice.apply(_result, [startSelection, endSelection - startSelection].concat(_toConsumableArray(clearData)));
      }

      if (/\d/.test(e.key) && focus < result.length) {
        var index = result.indexOf(marker);
        var separator = result.indexOf(sep, this.selectionStart);

        if (index === -1) {
          for (var i = this.selectionStart; i < result.length; i++) {
            index = i;
            if (/\d/.test(result[i])) break;
          }
        }

        result[index] = e.key;
        focus = index === CLOSE_BRACE ? CLOSE_BRACE + 2 : separator - index === 1 ? index + 1 : index;
      } else {
        if (e.key === 'Backspace') {
          if (!IsSelectionTrue && result[focus - 1] !== '(') {
            var insert;

            switch (result[this.selectionStart - 1]) {
              case ' ':
                insert = ' ';
                break;

              case ')':
                insert = ')';
                break;

              default:
                insert = marker;
            }

            result.splice(this.selectionStart - 1, 1, insert);
            focus -= 1;
          }
        }

        if (e.key === 'Delete' && !IsSelectionTrue) {
          var _index = result.slice(focus).findIndex(function (item) {
            return /\d/.test(item);
          });

          if (~_index) {
            result[focus + _index] = marker;
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

  var deleteHandler = function deleteHandler(e) {
    if (e.target === phone) {
      phone.removeEventListener('paste', pasteValue);
      phone.removeEventListener('select', selectValue);
      phone.removeEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.removeEventListener('input', checkInputName);
    }

    form.removeEventListener('focusout', deleteHandler);
  };

  var checkInputName = function checkInputName() {
    checkValidity(name);
  };

  var onValidate = function onValidate(e) {
    if (e.target.name === 'phone') {
      var _phone = e.target;
      _phone.value = _phone.value || storage[_phone.name] || initialValue;
      setTimeout(function () {
        _phone.selectionStart = _phone.selectionEnd = focus || START_INDEX;
      });
      initialValue = '';

      _phone.addEventListener('paste', pasteValue);

      _phone.addEventListener('select', selectValue);

      _phone.addEventListener('keydown', enterValue);
    }

    if (e.target.name === 'name') {
      var _name = e.target;
      _name.value = storage[_name.name] || _name.value;

      _name.addEventListener('input', checkInputName);
    }

    this.addEventListener('focusout', deleteHandler);
  }; // валидация форм на главной странице


  pageForms.forEach(function (form) {
    var inputs = form.querySelectorAll('input:not([type=checkbox])');
    form.addEventListener('focusin', onValidate);
    form.addEventListener('submit', function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value);
      });
      onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
      e.preventDefault();
    });
  });
})(); //=========================секция программы==================================================


(function () {
  var tabs = document.querySelector('.programs__captions');
  var initialLeft = tabs.offsetLeft;
  var isTouch = false;
  var touch = 'mousedown';
  var touchMove = 'mousemove';
  var touchUp = 'mouseup';

  if ('ontouchstart' in window) {
    isTouch = true;
    touch = 'touchstart';
    touchMove = 'touchmove';
    touchUp = 'touchend';
  }

  tabs.addEventListener(touch, function (e) {
    var screen = document.documentElement.clientWidth;
    var difference = screen - this.offsetWidth;
    var x = isTouch ? e.changedTouches[0].clientX : e.clientX;
    var shiftX = x - this.offsetLeft;

    var onMove = function onMove(e) {
      var xMove = isTouch ? e.changedTouches[0].clientX : e.clientX;
      var left = xMove - shiftX;

      if (left < difference) {
        left = difference;
      }

      if (left > initialLeft) {
        left = initialLeft;
      }

      tabs.style.left = left + 'px';
    };

    document.addEventListener(touchMove, onMove);

    var onMouseUp = function onMouseUp() {
      document.removeEventListener(touchMove, onMove);
      document.removeEventListener(touchUp, onMouseUp);
    };

    document.addEventListener(touchUp, onMouseUp);
  });
})(); //========пунктир в секции conditions ====================================


(function () {
  var list = document.querySelector('.condition__list');
  var firstItem = document.querySelector('.condition__item--1');
  var lastItem = document.querySelectorAll('.condition__item');
  lastItem = lastItem[lastItem.length - 1];
  var heightFirstItem = getComputedStyle(firstItem).getPropertyValue('height');
  var heightLastItem = getComputedStyle(lastItem).getPropertyValue('height');
  var heightList = getComputedStyle(list).getPropertyValue('height');
  var lineHeight = parseInt(heightList) - parseInt(heightFirstItem) / 2 - parseInt(heightLastItem) / 2;
  list.style.setProperty('--line-dashed', lineHeight + 'px');
})(); //=====================slider===========================================


(function () {
  // let startSlider = function () {
  var galleryList = document.querySelector('.gallery__list'); // let firstImg = document.querySelector('.gallery__first-img');
  // let firstImgContent = firstImg.innerHTML;
  // let template = document.querySelector('template').content;
  // template.prepend(firstImg);
  // galleryList.append(template);

  galleryList.insertAdjacentHTML("beforeend", '  <li class="gallery__item gallery__item--1 slider__item">\n' + '    <picture>\n' + '      <source type="image/webp" media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.webp 1x, img/mobile/1_m@2x.webp 2x">\n' + '      <source media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.jpg 1x, img/mobile/1_m@2x.jpg 2x">\n' + '      <source type="image/webp" srcset="img/desktop/1@1x.webp 1x, img/desktop/1@2x.webp 2x">\n' + '      <img src="img/desktop/1@1x.png" srcset="img/desktop/1@2x.png 2x" width="482"\n' + '           height="732" alt="фоновое изображение">\n' + '    </picture>\n' + '  </li>');
  var slider = document.querySelector('.gallery__slider');
  var buttonForward = slider.querySelector(".slider__forward");
  var buttonBack = slider.querySelector(".slider__back");
  var slideContainer = slider.querySelector('.slider__list');
  var amountSlides = slider.querySelectorAll('.slider__item').length;
  var indicatorContainer = slider.querySelector('.slider__indicators');
  var translate = 0;
  var delaySlide;
  var intervalSlider;
  var timer;
  slider.classList.remove('no-js');

  window.onresize = function () {
    if (document.documentElement.clientWidth >= 767) {
      indicatorContainer.children[translate].classList.remove('slider__ind-color');
      translate = 0;
      indicatorContainer.children[translate].classList.add('slider__ind-color');
      slideContainer.style.transform = 'translate(0)';
      buttonForward.disabled = false;
      buttonBack.disabled = true;
    }
  };

  for (var i = 0; i < amountSlides; i++) {
    indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">');
  }

  indicatorContainer.children[translate].classList.add('slider__ind-color');

  if (amountSlides > 1) {
    var moveSlide = function moveSlide() {
      slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
    };

    buttonBack.disabled = true; //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки

    var hideArrow = function hideArrow() {
      // displayCurrentSlide.textContent = translate + 1 + '';
      if (translate === 0) {
        buttonBack.disabled = true;
      } else if (translate === amountSlides - 1) {
        buttonForward.disabled = true;
      } else {
        buttonBack.disabled = buttonForward.disabled = false;
      }
    }; // для ручного переключения сладов


    var onClickSlider = function onClickSlider() {
      clearTimeout(timer);
      clearTimeout(delaySlide);
      clearInterval(intervalSlider);
      slideContainer.classList.add('slider__list--click-duration'); // slideContainer.classList.remove('slider__list--auto-duration');

      var forward = this === buttonForward; //==================

      indicatorContainer.children[translate].classList.remove('slider__ind-color'); //===================

      if (forward && translate < amountSlides - 1) {
        buttonBack.disabled = false;
        translate += 1;
      } else if (!forward && translate > 0) {
        buttonForward.disabled = false;
        translate -= 1;
      } //==================


      indicatorContainer.children[translate].classList.add('slider__ind-color'); //=======================

      moveSlide();
      hideArrow(); // startAutoScroll();
    };

    buttonForward.addEventListener("click", onClickSlider);
    buttonBack.addEventListener("click", onClickSlider);
  }
})();

(function () {
  //================================для секции feedback===========================
  // let startSlider = function () {
  var DELAY_START_SLIDER = 5000;
  var timeShowSlide = 4000;
  var slider = document.querySelector('.feedback');
  var buttonForward = slider.querySelector(".slider__forward");
  var buttonBack = slider.querySelector(".slider__back");
  var slideContainer = slider.querySelector('.slider__list');
  var amountSlides = slider.querySelectorAll('.slider__item').length;
  var displayCurrentSlide = slider.querySelector('.feedback__current-slides');
  var displayTotalSlide = slider.querySelector('.feedback__total-slides');
  var autoDuration = getComputedStyle(slider).getPropertyValue('--auto-duration');
  autoDuration = parseInt(autoDuration) || 1000;

  if (typeof autoDuration === 'number') {
    timeShowSlide += autoDuration;
  }

  var translate = 0;
  var delaySlide;
  var intervalSlider;
  var timer; //показ текущего и суммы слайдов

  displayTotalSlide.textContent = amountSlides + '';
  displayCurrentSlide.textContent = translate + 1 + '';

  if (amountSlides > 1) {
    //для автоматической прокрутки слайдов
    var scrollAuto = function scrollAuto() {
      hideArrow();

      if (translate === 0) {
        translate += 1;
        displayCurrentSlide.textContent = '1';
      }

      slideContainer.classList.remove('slider__list--click-duration');
      slideContainer.classList.add('slider__list--auto-duration');
      moveSlide();
      translate -= 1;
      delaySlide = setTimeout(function () {
        slideContainer.classList.remove('slider__list--auto-duration');
        moveSlide();
        slideContainer.appendChild(slideContainer.firstElementChild);
      }, autoDuration);
    };

    var moveSlide = function moveSlide() {
      slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
    };

    buttonBack.disabled = true; //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки

    var hideArrow = function hideArrow() {
      if (translate === 0) {
        buttonBack.disabled = true;
      } else if (translate === amountSlides - 1) {
        buttonForward.disabled = true;
      } else {
        buttonBack.disabled = buttonForward.disabled = false;
      }
    }; // для ручного переключения сладов


    var onClickSlider = function onClickSlider() {
      clearTimeout(timer);
      clearTimeout(delaySlide);
      clearInterval(intervalSlider);
      slideContainer.classList.add('slider__list--click-duration');
      slideContainer.classList.remove('slider__list--auto-duration');
      var forward = this === buttonForward;

      if (forward && translate < amountSlides - 1) {
        buttonBack.disabled = false;
        translate += 1;
      } else if (!forward && translate > 0) {
        buttonForward.disabled = false;
        translate -= 1;
      }

      displayCurrentSlide.textContent = translate + 1 + '';
      moveSlide();
      hideArrow(); // startAutoScroll();
    };

    buttonForward.addEventListener("click", onClickSlider);
    buttonBack.addEventListener("click", onClickSlider);

    var startAutoScroll = function startAutoScroll() {
      timer = setTimeout(function () {
        intervalSlider = setInterval(function () {
          scrollAuto();
        }, timeShowSlide);
      }, DELAY_START_SLIDER);
    }; // startAutoScroll()

  }
})();