"use strict";

( function () {

  let pageForms = document.querySelectorAll('[data-send-form]');
  let storage = {};
  let form = document.querySelector(".modal__form");
  let inputsModal = form.querySelectorAll("input");
  let phone = form.querySelector('.modal__input-phone');
  let name = form.querySelector('.modal__input-name');
  let checkBox = form.querySelector('.modal__check');
  let checkBoxApply = form.querySelector('.modal__apply');
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
    checkBoxApply.classList.remove('invalid')
    checkValidity.call(checkBox)
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
    if (this.name === 'accept' && !this.validity.valid) {
      checkBoxApply.classList.add('invalid')
    }
    else if (this.name === 'accept' && this.validity.valid) {
      checkBoxApply.classList.remove('invalid')
    }
    else {
      if (!this.validity.valid) {
        this.parentElement.classList.remove('valid')
        this.parentElement.classList.add('invalid')
      } else {
        this.parentElement.classList.remove('invalid')
        this.parentElement.classList.add('valid')
      }
    }
  };
// обработчик события focus на форме
  let onValidate = function (e) {
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
  }

  let deleteHandler = function (e) {
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
    input.parentElement.classList.remove('valid')
    input.value = storage[input.name] = localStorage.getItem(input.name)
  })

} )();




(function () {

  let anchor = document.querySelector('.header__scroll');
  let aboutTitle = document.querySelector('.about__title');

  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    aboutTitle.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  });

})();






//================================слайдер===========================
window.userMethods = {
  isDesktop: true,
  handler: {},
  screenSize: document.documentElement.clientWidth
}

window.onresize = function () { // обработчик на изменение ширины окна
  userMethods.screenSize = document.documentElement.clientWidth

  if (userMethods.screenSize <= 767) {
    userMethods.adjustResize()
        if (userMethods.isDesktop) {
    userMethods.mobileVersion()
        }
    userMethods.isDesktop = false
  }

  if (userMethods.screenSize > 767) {
    if (!userMethods.isDesktop) {
      userMethods.desktopVersion()
    }
    userMethods.isDesktop = true
  }
}

"use strict";

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
    '<p class="gallery__caption gallery__caption--1">Экскурсии по Израилю <br>и знакомство с его историей</p>\n' +
    '  </li>');
  let amountGallarySlides = galleryList.childElementCount;
  let indicatorContainer = sliderGallery.querySelector('.slider__indicators');

  let tabs = document.querySelector('.programs__captions');
  let sliderFeedback = document.querySelector('.feedback');
  let displayCurrentSlide = sliderFeedback.querySelector('.feedback__current-slides');
  let displayTotalSlide = sliderFeedback.querySelector('.feedback__total-slides');
  let feedbackList = sliderFeedback.querySelector('.feedback__list');
  let totalFeedbackSlides = feedbackList.childElementCount;
  let autoDuration = getComputedStyle(sliderFeedback).getPropertyValue('--auto-duration');

  sliderGallery.classList.remove('no-js');
// добавляем индикаторы слайдов
  while (amountGallarySlides--) {
    indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">')
  }
  indicatorContainer.children[0].classList.add('slider__ind-color');
  displayTotalSlide.textContent = totalFeedbackSlides + '';
  displayCurrentSlide.textContent = '1';


  class Slider {

    swype; // DOM элемент (тег <UL>)
    slider; // DOM элемент (тег <UL>)
    autoTranslate = false; // автодоезд слайда
    counter; // DOM элемент показывающий текущий слайд
    indicators; //DOM элемент, контейнер индикаторов
    tabIndex = false;  // [bool] нужно ли отключать фокус на неактивных слайдах
    slideWidth; // ширина одного слайда
    leftEdge; //до какого значения left двигать влево
    rightEdge; //до какого значения left двигать вправо
    buttonForward;
    buttonBack;
    DelayBeforeStart; // через сколько ms запускать автоскролл
    timeShowSlide; // время показа слайда

    startSwype() {

      let {
        swype,
        counter,
        indicators,
      } = this


      let rightEdge = this.rightEdge || swype.offsetLeft;
      let currentSlide = 0;
      let left = 0;

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

      if (indicators) {
        for (let i = 1; i < indicators.childElementCount; i++) {
          indicators.children[i].classList.remove('slider__ind-color');
        }
        indicators.children[0].classList.add('slider__ind-color');
      }

      swype.style.left = 0;
      swype.querySelectorAll('img').forEach(img => img.draggable = false)

      let onMousedown = e => {
        let slideWidth = this.slideWidth || swype.offsetWidth;
        console.log('slideWidth', slideWidth);
        let leftEdge = slideWidth - slideWidth * swype.childElementCount;
        if (swype === tabs) {
          leftEdge = userMethods.screenSize - swype.offsetWidth;
        }
        console.log('leftEdge', leftEdge);
        let x = isTouch ? e.changedTouches[0].clientX : e.clientX;
        let shiftX = x - swype.offsetLeft;
        let relativeLeft = 0;

        let onMove = e => {
          swype.classList.remove('slider__list--swype')
          let xMove = isTouch ? e.changedTouches[0].clientX : e.clientX;
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

        let onMouseUp = () => {

          if (this.autoTranslate) {
            swype.classList.add('slider__list--swype')

            if (indicators) {
              indicators.children[currentSlide].classList.remove('slider__ind-color');
            }

            if (counter) {
              counter.textContent = 1 + currentSlide + '';
            }
            // если переместили больше чем на половину слайда сдвигаем до конца автоматически
            if (relativeLeft <= slideWidth * ( -50 / 100 )) {
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

      swype.addEventListener(touch, onMousedown)

      let type = swype.getAttribute('id')
      window.userMethods.handler[type] = () => {
        swype.removeEventListener(touch, onMousedown)
      }
    }

    startSlider() {

      let {
        slider,
        counter,
        indicators,
        tabIndex,
        DelayBeforeStart,
        buttonForward,
        buttonBack
      } = this

      let timeShowSlide = this.timeShowSlide || 4000;
      let slideContainer = slider.querySelector('.slider__list');
      let amountSlides = slideContainer.childElementCount;
      let translate = 0;
      let delaySlide, intervalSlider, timer;

      let getFeedbackLink = function () { // вспомогательная функция, ищет элемент
        return slideContainer.children[translate].querySelector('.feedback__details');
      }

      if (amountSlides > 1) { // если слайдов больше чем 1

        if (translate === 0) {
          buttonBack.disabled = true;
        }

        if (counter) {
          counter.textContent = translate + 1 + '';
        }

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
          stopAutoScroll();
          slideContainer.classList.add('slider__list--click-duration');
          let forward = this === buttonForward;

          if (indicators) { // для индикации слайдов
            indicators.children[translate].classList.remove('slider__ind-color');
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
        };

        //для автоматической прокрутки слайдов
        let scrollAuto = function () {
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
            delaySlide = setTimeout(appendSlide, autoDuration)
          }
        }

        let appendSlide = function () { // переместить первый слайд в конец списка
          slideContainer.classList.remove('slider__list--auto-duration');
          moveSlide();
          slideContainer.appendChild(slideContainer.firstElementChild);
          if (tabIndex && translate === 0) { // для отключения перехода на непереключеный слайд
            getFeedbackLink().tabIndex = 0;
          }
        }

        let startAutoScroll = function () {
          timer = setTimeout(function () {
            intervalSlider = setInterval(function () {
              scrollAuto();
            }, timeShowSlide);
          }, DelayBeforeStart)
        };

        let stopAutoScroll = function () {
          clearTimeout(timer);
          clearTimeout(delaySlide);
          clearInterval(intervalSlider);
          slideContainer.classList.remove('slider__list--auto-duration');
        }

        // для запуска автоскролла
        if (typeof DelayBeforeStart === 'number') {
          autoDuration = parseInt(autoDuration) || 1000;
          if (typeof autoDuration === 'number' && typeof timeShowSlide === 'number') {
            timeShowSlide += autoDuration
          }
          startAutoScroll()
        }

        buttonForward.addEventListener("click", onClickSlider);
        buttonBack.addEventListener("click", onClickSlider);
        window.userMethods.stopAutoScroll = stopAutoScroll
        window.userMethods.removeOnClick = () => {
          buttonForward.removeEventListener("click", onClickSlider);
          buttonBack.removeEventListener("click", onClickSlider);
        }
      }
    }
  }

  class Gallery extends Slider {
    swype = galleryList;
    autoTranslate = true;
    indicators = indicatorContainer; // контейнер индикаторов
  }

  class Feedback extends Slider {
    swype = feedbackList;
    slider = sliderFeedback;
    counter = displayCurrentSlide; // текущий слайд
    buttonForward = this.slider.querySelector(".slider__forward");
    buttonBack = this.slider.querySelector(".slider__back")
    autoTranslate = true;
    tabIndex = true;
    DelayBeforeStart = 3000
  }

  class Program extends Slider {
    swype = tabs;
  }

  let feedback = new Feedback()
  let gallary = new Gallery()
  let program = new Program();

  window.userMethods.adjustResize = () => {
    feedbackList.style.left = 0;
    displayCurrentSlide.textContent = '1';
  }

  window.userMethods.mobileVersion = () => {
    if (userMethods.removeOnClick) {
      userMethods.removeOnClick();
    }
    if (Object.keys(userMethods.handler).length) {
      for (let key in userMethods.handler) {
        userMethods.handler[key]()
      }
    }
    if (userMethods.stopAutoScroll) {
      userMethods.stopAutoScroll();
    }
    program.startSwype()
    gallary.startSwype()
    feedbackList.classList.remove('slider__list--click-duration');
    feedbackList.style.transform = 'translate(0)';
    displayCurrentSlide.textContent = '1';
    feedback.buttonBack.disabled = true;
    feedback.buttonForward.disabled = true;
    feedback.startSwype()
  };

  window.userMethods.desktopVersion = () => {
    feedbackList.classList.remove('slider__list--swype');
    if (Object.keys(userMethods.handler).length) {
      for (let key in userMethods.handler) {
        userMethods.handler[key]()
      }
    }
    feedbackList.style.left = 0;
    feedbackList.style.transform = 'translate(0)';
    feedback.buttonForward.disabled = false;
    feedback.startSlider()
  }

  if (document.documentElement.clientWidth <= 767) {
    userMethods.isDesktop = false
    program.startSwype()
    gallary.startSwype()
    feedback.startSwype()
    feedback.buttonBack.disabled = true;
    feedback.buttonForward.disabled = true;
  }

  if (document.documentElement.clientWidth > 767) {
    feedback.startSlider()
  }

} )();

