"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

(function () {
  var anchor = document.querySelector('.header__scroll');
  var aboutTitle = document.querySelector('.about__title');
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    aboutTitle.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
})(); //================================слайдер===========================


window.userMethods = {
  isDesktop: true,
  handler: {},
  screenSize: document.documentElement.clientWidth
};

window.onresize = function () {
  // обработчик на изменение ширины окна
  userMethods.screenSize = document.documentElement.clientWidth;

  if (userMethods.screenSize <= 767) {
    userMethods.adjustResize();

    if (userMethods.isDesktop) {
      userMethods.mobileVersion();
    }

    userMethods.isDesktop = false;
  }

  if (userMethods.screenSize > 767) {
    if (!userMethods.isDesktop) {
      userMethods.desktopVersion();
    }

    userMethods.isDesktop = true;
  }
};

"use strict";

(function () {
  var sliderGallery = document.querySelector('.gallery__slider');
  var galleryList = sliderGallery.querySelector('.gallery__list');
  galleryList.insertAdjacentHTML("beforeend", '  <li class="gallery__item gallery__item--1 slider__item">\n' + '    <picture>\n' + '      <source type="image/webp" media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.webp 1x, img/mobile/1_m@2x.webp 2x">\n' + '      <source media="(max-width: 767px)"\n' + '              srcset="img/mobile/1_m@1x.jpg 1x, img/mobile/1_m@2x.jpg 2x">\n' + '      <source type="image/webp" srcset="img/desktop/1@1x.webp 1x, img/desktop/1@2x.webp 2x">\n' + '      <!-- 1x: 482; 2x 964px -->' + '      <img src="img/desktop/1@1x.png" srcset="img/desktop/1@2x.png 2x" width="482"\n' + '           height="732" alt="фоновое изображение">\n' + '    </picture>\n' + '<p class="gallery__caption gallery__caption--1">Экскурсии по Израилю <br>и знакомство с его историей</p>\n' + '  </li>');
  var amountGallarySlides = galleryList.childElementCount;
  var indicatorContainer = sliderGallery.querySelector('.slider__indicators');
  var tabs = document.querySelector('.programs__captions');
  var sliderFeedback = document.querySelector('.feedback');
  var displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  var displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  var feedbackList = sliderFeedback.querySelector('.feedback__list');
  var totalFeedbackSlides = feedbackList.childElementCount;
  var autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');
  sliderGallery.classList.remove('no-js'); // добавляем индикаторы слайдов

  while (amountGallarySlides--) {
    indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">');
  }

  indicatorContainer.children[0].classList.add('slider__ind-color');
  displayTotalSlide.textContent = totalFeedbackSlides + '';
  displayCurrentSlide.textContent = '1';

  var Slider = /*#__PURE__*/function () {
    function Slider() {
      _classCallCheck(this, Slider);

      _defineProperty(this, "swype", void 0);

      _defineProperty(this, "slider", void 0);

      _defineProperty(this, "autoTranslate", false);

      _defineProperty(this, "counter", void 0);

      _defineProperty(this, "indicators", void 0);

      _defineProperty(this, "tabIndex", false);

      _defineProperty(this, "slideWidth", void 0);

      _defineProperty(this, "leftEdge", void 0);

      _defineProperty(this, "rightEdge", void 0);

      _defineProperty(this, "buttonForward", void 0);

      _defineProperty(this, "buttonBack", void 0);

      _defineProperty(this, "DelayBeforeStart", void 0);

      _defineProperty(this, "timeShowSlide", void 0);
    }

    _createClass(Slider, [{
      key: "startSwype",
      // время показа слайда
      value: function startSwype() {
        var _this2 = this;

        var swype = this.swype,
            counter = this.counter,
            indicators = this.indicators;
        var rightEdge = this.rightEdge || swype.offsetLeft;
        var currentSlide = 0;
        var left = 0;
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

        if (indicators) {
          for (var i = 1; i < indicators.childElementCount; i++) {
            indicators.children[i].classList.remove('slider__ind-color');
          }

          indicators.children[0].classList.add('slider__ind-color');
        }

        swype.style.left = 0;
        swype.querySelectorAll('img').forEach(function (img) {
          return img.draggable = false;
        });

        var onMousedown = function onMousedown(e) {
          var slideWidth = _this2.slideWidth || swype.offsetWidth;
          console.log('slideWidth', slideWidth);
          var leftEdge = slideWidth - slideWidth * swype.childElementCount;

          if (swype === tabs) {
            leftEdge = userMethods.screenSize - swype.offsetWidth;
          }

          console.log('leftEdge', leftEdge);
          var x = isTouch ? e.changedTouches[0].clientX : e.clientX;
          var shiftX = x - swype.offsetLeft;
          var relativeLeft = 0;

          var onMove = function onMove(e) {
            swype.classList.remove('slider__list--swype');
            var xMove = isTouch ? e.changedTouches[0].clientX : e.clientX;
            left = xMove - shiftX;

            if (left < leftEdge) {
              left = leftEdge;
            }

            if (left > rightEdge) {
              left = rightEdge;
            }

            swype.style.left = left + 'px';
            relativeLeft = left % slideWidth;
          };

          var onMouseUp = function onMouseUp() {
            if (_this2.autoTranslate) {
              swype.classList.add('slider__list--swype');

              if (indicators) {
                indicators.children[currentSlide].classList.remove('slider__ind-color');
              }

              if (counter) {
                counter.textContent = 1 + currentSlide + '';
              } // если переместили больше чем на половину слайда сдвигаем до конца автоматически


              if (relativeLeft <= slideWidth * (-50 / 100)) {
                left += -slideWidth - relativeLeft;
              } else {
                left -= relativeLeft;
              }

              swype.style.left = left + 'px';
              currentSlide = Math.round(Math.abs(left / slideWidth));

              if (indicators) {
                indicators.children[currentSlide].classList.add('slider__ind-color');
              }

              if (counter) {
                counter.textContent = 1 + currentSlide + '';
              }
            }

            document.removeEventListener(touchMove, onMove);
            document.removeEventListener(touchUp, onMouseUp);
          };

          document.addEventListener(touchMove, onMove);
          document.addEventListener(touchUp, onMouseUp);
        };

        swype.addEventListener(touch, onMousedown);
        var type = swype.getAttribute('id');

        window.userMethods.handler[type] = function () {
          swype.removeEventListener(touch, onMousedown);
        };
      }
    }, {
      key: "startSlider",
      value: function startSlider() {
        var slider = this.slider,
            counter = this.counter,
            indicators = this.indicators,
            tabIndex = this.tabIndex,
            DelayBeforeStart = this.DelayBeforeStart,
            buttonForward = this.buttonForward,
            buttonBack = this.buttonBack;
        var timeShowSlide = this.timeShowSlide || 4000;
        var slideContainer = slider.querySelector('.slider__list');
        var amountSlides = slideContainer.childElementCount;
        var translate = 0;
        var delaySlide, intervalSlider, timer;

        var getFeedbackLink = function getFeedbackLink() {
          // вспомогательная функция, ищет элемент
          return slideContainer.children[translate].querySelector('.feedback__details');
        };

        if (amountSlides > 1) {
          // если слайдов больше чем 1
          if (translate === 0) {
            buttonBack.disabled = true;
          }

          if (counter) {
            counter.textContent = translate + 1 + '';
          }

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
            stopAutoScroll();
            slideContainer.classList.add('slider__list--click-duration');
            var forward = this === buttonForward;

            if (indicators) {
              // для индикации слайдов
              indicators.children[translate].classList.remove('slider__ind-color');
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

            if (indicators) {
              indicators.children[translate].classList.add('slider__ind-color');
            }

            if (tabIndex) {
              getFeedbackLink().tabIndex = 0;
            }

            if (counter) {
              counter.textContent = translate + 1 + ''; // для вывода текущего слайда
            }

            moveSlide();
            disableButton();
          }; //для автоматической прокрутки слайдов


          var scrollAuto = function scrollAuto() {
            slideContainer.classList.remove('slider__list--click-duration');

            if (translate === 0) {
              if (tabIndex) {
                getFeedbackLink().tabIndex = -1;
              }

              disableButton();
              translate += 1;

              if (counter) {
                counter.textContent = '1';
              }

              slideContainer.classList.add('slider__list--auto-duration');
              moveSlide();
              translate -= 1;
              delaySlide = setTimeout(appendSlide, autoDuration);
            }
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
              }, timeShowSlide);
            }, DelayBeforeStart);
          };

          var stopAutoScroll = function stopAutoScroll() {
            clearTimeout(timer);
            clearTimeout(delaySlide);
            clearInterval(intervalSlider);
            slideContainer.classList.remove('slider__list--auto-duration');
          }; // для запуска автоскролла


          if (typeof DelayBeforeStart === 'number') {
            autoDuration = parseInt(autoDuration) || 1000;

            if (typeof autoDuration === 'number' && typeof timeShowSlide === 'number') {
              timeShowSlide += autoDuration;
            }

            startAutoScroll();
          }

          buttonForward.addEventListener("click", onClickSlider);
          buttonBack.addEventListener("click", onClickSlider);
          window.userMethods.stopAutoScroll = stopAutoScroll;

          window.userMethods.removeOnClick = function () {
            buttonForward.removeEventListener("click", onClickSlider);
            buttonBack.removeEventListener("click", onClickSlider);
          };
        }
      }
    }]);

    return Slider;
  }();

  var Gallery = /*#__PURE__*/function (_Slider) {
    _inherits(Gallery, _Slider);

    var _super = _createSuper(Gallery);

    function Gallery() {
      var _this3;

      _classCallCheck(this, Gallery);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this3 = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this3), "swype", galleryList);

      _defineProperty(_assertThisInitialized(_this3), "autoTranslate", true);

      _defineProperty(_assertThisInitialized(_this3), "indicators", indicatorContainer);

      return _this3;
    } // контейнер индикаторов


    return Gallery;
  }(Slider);

  var Feedback = /*#__PURE__*/function (_Slider2) {
    _inherits(Feedback, _Slider2);

    var _super2 = _createSuper(Feedback);

    function Feedback() {
      var _this4;

      _classCallCheck(this, Feedback);

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this4 = _super2.call.apply(_super2, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this4), "swype", feedbackList);

      _defineProperty(_assertThisInitialized(_this4), "slider", sliderFeedback);

      _defineProperty(_assertThisInitialized(_this4), "counter", displayCurrentSlide);

      _defineProperty(_assertThisInitialized(_this4), "buttonForward", _this4.slider.querySelector(".slider__forward"));

      _defineProperty(_assertThisInitialized(_this4), "buttonBack", _this4.slider.querySelector(".slider__back"));

      _defineProperty(_assertThisInitialized(_this4), "autoTranslate", true);

      _defineProperty(_assertThisInitialized(_this4), "tabIndex", true);

      _defineProperty(_assertThisInitialized(_this4), "DelayBeforeStart", 3000);

      return _this4;
    }

    return Feedback;
  }(Slider);

  var Program = /*#__PURE__*/function (_Slider3) {
    _inherits(Program, _Slider3);

    var _super3 = _createSuper(Program);

    function Program() {
      var _this5;

      _classCallCheck(this, Program);

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _this5 = _super3.call.apply(_super3, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this5), "swype", tabs);

      return _this5;
    }

    return Program;
  }(Slider);

  var feedback = new Feedback();
  var gallary = new Gallery();
  var program = new Program();

  window.userMethods.adjustResize = function () {
    feedbackList.style.left = 0;
    displayCurrentSlide.textContent = '1';
  };

  window.userMethods.mobileVersion = function () {
    if (userMethods.removeOnClick) {
      userMethods.removeOnClick();
    }

    if (Object.keys(userMethods.handler).length) {
      for (var key in userMethods.handler) {
        userMethods.handler[key]();
      }
    }

    if (userMethods.stopAutoScroll) {
      userMethods.stopAutoScroll();
    }

    program.startSwype();
    gallary.startSwype();
    feedbackList.classList.remove('slider__list--click-duration');
    feedbackList.style.transform = 'translate(0)';
    displayCurrentSlide.textContent = '1';
    feedback.buttonBack.disabled = true;
    feedback.buttonForward.disabled = true;
    feedback.startSwype();
  };

  window.userMethods.desktopVersion = function () {
    feedbackList.classList.remove('slider__list--swype');

    if (Object.keys(userMethods.handler).length) {
      for (var key in userMethods.handler) {
        userMethods.handler[key]();
      }
    }

    feedbackList.style.left = 0;
    feedbackList.style.transform = 'translate(0)';
    feedback.buttonForward.disabled = false;
    feedback.startSlider();
  };

  if (document.documentElement.clientWidth <= 767) {
    userMethods.isDesktop = false;
    program.startSwype();
    gallary.startSwype();
    feedback.startSwype();
    feedback.buttonBack.disabled = true;
    feedback.buttonForward.disabled = true;
  }

  if (document.documentElement.clientWidth > 767) {
    feedback.startSlider(); // setTimeout(feedback.startSlider, 1500)
  }
})();