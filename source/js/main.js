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
    let leftEdge = screen - this.offsetWidth;
    let x = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
    let shiftX = x - this.offsetLeft;
    let ctx = this;

    let onMove = function (e) {
      let xMove = ( isTouch ) ? e.changedTouches[0].clientX : e.clientX;
      let left = xMove - shiftX;
      if (left < leftEdge) {
        left = leftEdge
      }
      if (left > initialLeft) {
        left = initialLeft
      }
      ctx.style.left = left + 'px';
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

