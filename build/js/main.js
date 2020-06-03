"use strict"; //=========================секция программы==================================================

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
})();

"use strict";

(function () {
  var pageForms = document.querySelectorAll('[data-send-form]');
  var storage = {};
  var form = document.querySelector(".modal__form");
  var inputsModal = form.querySelectorAll("input");
  var phone = form.querySelector('.modal__input-phone');
  var name = form.querySelector('.modal__input-name');
  var checkBox = form.querySelector('.modal__check');
  var checkBoxApply = form.querySelector('.modal__apply');
  var inputs = document.querySelectorAll('input:not([type=checkbox])');

  var openClosePopup = function openClosePopup(obj) {
    var overlay = obj.overlay,
        classHidden = obj.classHidden,
        buttonsOpener = obj.buttonsOpener,
        buttonsClose = obj.buttonsClose,
        doAction = obj.doAction,
        endAction = obj.endAction;
    var body = document.body; // открытие попапа

    var openPopup = function openPopup(e) {
      if (e) {
        e.preventDefault();
      }

      overlay.classList.remove(classHidden);
      document.addEventListener("keydown", onCloseModalKey);
      overlay.addEventListener("mousedown", onCloseModalMouse);
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
      overlay.removeEventListener("mousedown", onCloseModalMouse); //  для предовращения скрола

      body.classList.remove('body-lock');
      window.scrollTo(0, body.dataset.scrollY);

      if (endAction) {
        endAction(); // если колбэк определен вызываем его, что то сделать после закрытия окна
      }
    }; // навершиваем на каждую кнопку обработчик открытия попапа


    if (buttonsOpener) {
      buttonsOpener.forEach(function (button) {
        button.addEventListener("click", openPopup);
      });
    } else openPopup();
  };

  var submitForm = function submitForm(e) {
    inputsModal.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value);
    });
    modalCall.overlay.classList.add(modalCall.classHidden);
    openClosePopup(modalSuccess);
    e.preventDefault();
  };

  var doAction = function doAction() {
    form.addEventListener('focusin', onValidate);
    checkBoxApply.classList.remove('invalid');
    checkValidity.call(checkBox);
    name.focus();
    inputsModal.forEach(function (input) {
      input.parentElement.classList.remove('invalid');
    });
    form.addEventListener("submit", submitForm);
  };

  var endAction = function endAction() {
    form.removeEventListener("submit", submitForm);
    form.removeEventListener('focusin', onValidate);
  };

  var modalSuccess = {
    overlay: document.querySelector(".modal--success-invisible"),
    classHidden: 'modal--success-invisible',
    buttonsClose: document.querySelectorAll(".modal__close--success, .modal__ok")
  };
  var modalCall = {
    overlay: document.querySelector(".modal--call-invisible"),
    classHidden: 'modal--call-invisible',
    buttonsOpener: document.querySelectorAll("[data-modal-opener]"),
    buttonsClose: document.querySelectorAll(".modal__close--call"),
    doAction: doAction,
    endAction: endAction
  };
  openClosePopup(modalCall); // ======================валидация телефона===================================================

  var START_INDEX = 4;
  var FIRST_NUMBER = '7';
  var substrateThree = '___';
  var substrateTwo = '__';
  var delimiter = ' ';
  var regExp = /^7? ?\(?(\d{0,3})\)? ?(\d{0,3})-?(\d{0,2})-?(\d{0,2})/;
  var regE = /7.*/;
  var pln = /(?:\d\D*)$/g; // позиция последней цифры

  var controlKeys = ["Tab", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];

  var enterPhoneValue = function enterPhoneValue(e) {
    var _this = this;

    var isControlKey = controlKeys.some(function (key) {
      return e.key === key;
    });

    if (!e.ctrlKey && !isControlKey) {
      var cursor = this.selectionStart = this.selectionEnd;
      setTimeout(function () {
        var number = _this.value.match(regE) || [FIRST_NUMBER];
        var arr = Array.from(number[0]);
        var str = arr.filter(function (item) {
          return /\d/.test(item);
        });
        str = str.join('').slice(0, 11);
        _this.value = str.replace(regExp, function (m, p1, p2, p3, p4) {
          return '+' + FIRST_NUMBER + ' (' + (p1 + substrateThree).slice(0, substrateThree.length) + ') ' + (p2 + substrateThree).slice(0, substrateThree.length) + delimiter + (p3 + substrateTwo).slice(0, substrateTwo.length) + delimiter + (p4 + substrateTwo).slice(0, substrateTwo.length);
        }); // управление курсором

        var search = _this.value.search(pln);

        _this.selectionStart = _this.selectionEnd = e.key === 'Delete' ? cursor : search + 1;

        if (cursor < START_INDEX) {
          _this.selectionStart = _this.selectionEnd = START_INDEX;
        }

        checkValidity.call(_this);
      }, 1);
    }
  };

  var checkValidity = function checkValidity() {
    if (this.name === 'accept' && !this.validity.valid) {
      checkBoxApply.classList.add('invalid');
    } else if (this.name === 'accept' && this.validity.valid) {
      checkBoxApply.classList.remove('invalid');
    } else {
      if (!this.validity.valid) {
        this.parentElement.classList.remove('valid');
        this.parentElement.classList.add('invalid');
      } else {
        this.parentElement.classList.remove('invalid');
        this.parentElement.classList.add('valid');
      }
    }
  }; // обработчик события focus на форме


  var onValidate = function onValidate(e) {
    if (e.target.name === 'phone') {
      e.target.addEventListener('keydown', enterPhoneValue);
    }

    if (e.target.name === 'name') {
      e.target.addEventListener('input', checkValidity);
    }

    if (e.target.name === 'accept') {
      e.target.addEventListener('change', checkValidity);
    }

    this.addEventListener('focusout', deleteHandler);
  };

  var deleteHandler = function deleteHandler(e) {
    if (e.target.name === 'phone') {
      phone.removeEventListener('keydown', enterPhoneValue);
    }

    if (e.target.name === 'name') {
      name.removeEventListener('input', checkValidity);
    }

    if (e.target.name === 'accept') {
      e.target.removeEventListener('change', checkValidity);
    }

    form.removeEventListener('focusout', deleteHandler);
  }; // валидация форм на главной странице


  pageForms.forEach(function (form) {
    form.addEventListener('focusin', onValidate);
    form.addEventListener('submit', function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value);
      });
      openClosePopup(modalSuccess);
      e.preventDefault();
    });
  }); // всем инпутам ставим значение из localStorage

  inputs.forEach(function (input) {
    input.parentElement.classList.remove('invalid');
    input.parentElement.classList.remove('valid');
    input.value = storage[input.name] = localStorage.getItem(input.name);
  });
})();

"use strict"; //================================слайдер===========================


(function () {
  var sliderGallery = document.querySelector('.gallery__slider');
  var galleryList = sliderGallery.querySelector('.gallery__list');
  galleryList.insertAdjacentHTML("beforeend", '  <li class="gallery__item gallery__item--1 slider__item">\n' + '    <picture>\n' + '      <source type="image/webp" media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.webp 1x, img/mobile/1_m@2x.webp 2x">\n' + '      <source media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.jpg 1x, img/mobile/1_m@2x.jpg 2x">\n' + '      <source type="image/webp" srcset="img/desktop/1@1x.webp 1x, img/desktop/1@2x.webp 2x">\n' + '      <!-- 1x: 482; 2x 964px -->' + '      <img src="img/desktop/1@1x.png" srcset="img/desktop/1@2x.png 2x" width="482"\n' + '           height="732" alt="фоновое изображение">\n' + '    </picture>\n' + '  </li>');
  var indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  sliderGallery.classList.remove('no-js'); //=======================================================================

  var sliderFeedback = document.querySelector('.feedback');
  var displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  var displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  var autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');
  var listFeedback = sliderFeedback.querySelector('.feedback__list');
  var objGallery = {
    slider: document.querySelector('.gallery__slider'),
    indicator: true
  };
  var objFeedback = {
    slider: document.querySelector('.feedback'),
    DelayForStart: 5000,
    timeShowSlide: 6000,
    counter: true,
    tabIndex: true
  };

  var startSlider = function startSlider(obj) {
    var slider = obj.slider,
        DelayForStart = obj.DelayForStart,
        timeShowSlide = obj.timeShowSlide,
        counter = obj.counter,
        indicator = obj.indicator,
        tabIndex = obj.tabIndex;
    var buttonForward = slider.querySelector(".slider__forward");
    var buttonBack = slider.querySelector(".slider__back");
    var slideContainer = slider.querySelector('.slider__list');
    var amountSlides = slider.querySelectorAll('.slider__item').length;
    var translate = 0;
    var delaySlide;
    var intervalSlider;
    var timer; //показ текущего и суммы слайдов

    if (counter) {
      displayTotalSlide.textContent = amountSlides + '';
      displayCurrentSlide.textContent = translate + 1 + '';
    }

    if (indicator) {
      window.onresize = function () {
        // обработчик на изменение ширины окна
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
        // добавляем индикаторы слайдов
        indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">');
      }

      indicatorContainer.children[translate].classList.add('slider__ind-color');
    }

    var getFeedbackLink = function getFeedbackLink() {
      // вспомогательная функция, ищет элемент
      return listFeedback.children[translate].querySelector('.feedback__details');
    };

    if (amountSlides > 1) {
      //для автоматической прокрутки слайдов
      var scrollAuto = function scrollAuto() {
        slideContainer.classList.remove('slider__list--click-duration');

        if (translate === 0) {
          if (tabIndex) {
            getFeedbackLink().tabIndex = -1;
          }

          disableButton();
          translate += 1;
          displayCurrentSlide.textContent = '1';
          slideContainer.classList.add('slider__list--auto-duration');
          moveSlide();
          translate -= 1;
          delaySlide = setTimeout(appendSlide, autoDuration);
        }
      };

      // если слайдов больше чем 1
      buttonBack.disabled = true; // кнопка назад изначально отключена

      var moveSlide = function moveSlide() {
        // переместить слайд на 100% ширины
        slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
      }; //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки


      var disableButton = function disableButton() {
        if (translate === 0) {
          buttonBack.disabled = true;
          buttonForward.disabled = false;
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

        if (indicator) {
          // для индикации слайдов
          indicatorContainer.children[translate].classList.remove('slider__ind-color');
        }

        if (tabIndex) {
          // для отключения перехода на непереключеный слайд
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

      var appendSlide = function appendSlide() {
        // переместить первый слайд в конец списка
        slideContainer.classList.remove('slider__list--auto-duration');
        moveSlide();
        slideContainer.appendChild(slideContainer.firstElementChild);

        if (tabIndex && translate === 0) {
          // для отключения перехода на непереключеный слайд
          getFeedbackLink().tabIndex = 0;
        }
      };

      var startAutoScroll = function startAutoScroll() {
        timer = setTimeout(function () {
          intervalSlider = setInterval(function () {
            scrollAuto();
          }, timeShowSlide || 4000);
        }, DelayForStart);
      };

      buttonForward.addEventListener("click", onClickSlider);
      buttonBack.addEventListener("click", onClickSlider); // для запуска автоскролла

      if (typeof DelayForStart === 'number') {
        autoDuration = parseInt(autoDuration) || 1000;

        if (typeof autoDuration === 'number' && typeof timeShowSlide === 'number') {
          timeShowSlide += autoDuration;
        }

        startAutoScroll();
      }
    }
  };

  startSlider(objFeedback);
  startSlider(objGallery);
  objFeedback = null;
  objGallery = null;
})();