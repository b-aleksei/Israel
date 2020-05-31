"use strict";
// для поддержки forEach в IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

( function () {

  let onPopupOpener = function (overlay, classHidden, modalOpeners, buttonsClose, doAction = false) {
    /*
    Попап открывается посредством удаления класса со св-м display: none
    * overlay - див с модальным окном(попапом)
    * classHidden - клас с свойством: display: none
    * modalOpeners - массив кнопок открытия попапа
    * buttonClose - кнопка закрытия попапа
    * buttonCloseOther - дполнителная кнопка закрытия окна
    .body-lock {overflow-y: scroll; position:fixed;}
    * */

    let body = document.body
    // открытие попапа
    let openPopup = function (e) {
      if (e) {
        e.preventDefault();
      }
      overlay.classList.remove(classHidden);
      document.addEventListener("keydown", onCloseModalKey);
      overlay.addEventListener("click", onCloseModalMouse);
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
      overlay.removeEventListener("click", onCloseModalMouse);
      //  для предовращения скрола
      body.classList.remove('body-lock')
      window.scrollTo(0, body.dataset.scrollY);
      if(typeof overlay.endAction === 'function') {
        overlay.endAction() // эта функция снаружи что то делает после закрытия окна
      }
    }

    // навершиваем на каждую кнопку обработчик открытия попапа
    if (modalOpeners) {
      modalOpeners.forEach(function (button) {
        button.addEventListener("click", openPopup)
      })
    } else openPopup()
  }

  let modalOpeners = document.querySelectorAll("[data-modal-opener]");
  let classHidden = "modal--call-invisible";
  let modalCall = document.querySelector("." + classHidden);
  let modalCallClose = modalCall.querySelectorAll(".modal__close--call");
  let classHiddenSuccess = "modal--success-invisible";
  let modalSuccess = document.querySelector("." + classHiddenSuccess);
  let pageForms = document.querySelectorAll('[data-send-form]');
  let modalSuccessClose = modalSuccess.querySelectorAll(".modal__close--success, .modal__ok");

  let storage = {};
  let form = modalCall.querySelector(".modal__form");
  let inputsModal = form.querySelectorAll(".modal__input");
  let phone = form.querySelector('.modal__input-phone');
  let name = form.querySelector('.modal__input-name');

  modalCall.endAction = function () {
    form.removeEventListener("submit", submitForm);
    form.removeEventListener('focusin', onValidate);
  }

  inputsModal.forEach(function (input) {
    storage[input.name] = localStorage.getItem(input.name)
  })

  let submitForm = function (e) {
    inputsModal.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value)
    })
    modalCall.classList.add(classHidden);
    onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
    e.preventDefault();
  }

  let doAction = function () {
    form.addEventListener('focusin', onValidate);
    name.focus();
    inputsModal.forEach(function (input) {
      let value = storage[input.name]
      if (value) {
        input.value = value
      }
      input.parentElement.classList.remove('invalid');
    })
    form.addEventListener("submit", submitForm)
  }

  onPopupOpener(modalCall, classHidden, modalOpeners, modalCallClose, doAction);

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
    setTimeout(function() {
      let value = Array.from(ctx.value).filter(function(item) {
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

  let selectValue = function () {
    startSelection = this.selectionStart;
    endSelection = this.selectionEnd;
  };

  let enterValue = function (e) {
    let IsSelectionTrue = startSelection !== endSelection;
    if (!e.ctrlKey) {
      focus = this.selectionStart < START_INDEX ? this.selectionStart = START_INDEX : this.selectionStart;
    }

    let isControlKey = controlKeys.some(function (key) {
      return e.key === key
    })

    if (!isControlKey && !e.ctrlKey) {
      e.preventDefault();
      if (IsSelectionTrue && this.selectionStart !== this.selectionEnd) {
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
          if (!IsSelectionTrue && result[focus - 1] !== '(') {
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

        if (e.key === 'Delete' && !IsSelectionTrue) {
          let index = result.slice(focus).findIndex(function(item) {
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
      phone.removeEventListener('select', selectValue);
      phone.removeEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.removeEventListener('input', checkInputName);
    }
    form.removeEventListener('focusout', deleteHandler);
  }

  let checkInputName = function () {
    checkValidity(name)
  }


  let onValidate = function (e) {
    if (e.target.name === 'phone') {
      let phone = e.target;
      phone.value = phone.value || storage[phone.name] || initialValue;
      setTimeout(function() {
        phone.selectionStart = phone.selectionEnd = focus || START_INDEX;
      });
      initialValue = '';
      phone.addEventListener('paste', pasteValue);
      phone.addEventListener('select', selectValue);
      phone.addEventListener('keydown', enterValue);
    }

    if (e.target.name === 'name') {
      let name = e.target;
      name.value = storage[name.name] || name.value;
      name.addEventListener('input', checkInputName);
    }
    this.addEventListener('focusout', deleteHandler);
  }

  // валидация форм на главной странице
  pageForms.forEach(function (form) {
    let inputs = form.querySelectorAll('input:not([type=checkbox])');
    form.addEventListener('focusin', onValidate);
    form.addEventListener('submit', function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value)
      })
      onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
      e.preventDefault();
    });
  });

} )();

//=========================секция программы==================================================
(function () {

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
    let x = (isTouch) ? e.changedTouches[0].clientX : e.clientX;
    let shiftX = x - this.offsetLeft;

    let onMove = function (e) {
      let xMove = (isTouch) ? e.changedTouches[0].clientX : e.clientX;
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

})();

//========пунктир в секции conditions ====================================

(function () {

  let list = document.querySelector('.condition__list');
  let firstItem = document.querySelector('.condition__item--1');
  let lastItem = document.querySelectorAll('.condition__item');
  lastItem = lastItem[lastItem.length - 1];
  let heightFirstItem = getComputedStyle(firstItem).getPropertyValue('height')
  let heightLastItem = getComputedStyle(lastItem).getPropertyValue('height')
  let heightList = getComputedStyle(list).getPropertyValue('height')
  let lineHeight = parseInt(heightList) - parseInt(heightFirstItem)/2 - parseInt(heightLastItem)/2;
  list.style.setProperty('--line-dashed', lineHeight + 'px')

})();


//=====================slider===========================================
( function () {

  // let startSlider = function () {

  let galleryList = document.querySelector('.gallery__list');
  // let firstImg = document.querySelector('.gallery__first-img');
  // let firstImgContent = firstImg.innerHTML;
  // let template = document.querySelector('template').content;
  // template.prepend(firstImg);
  // galleryList.append(template);
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

  let slider = document.querySelector('.gallery__slider');
  let buttonForward = slider.querySelector(".slider__forward");
  let buttonBack = slider.querySelector(".slider__back");
  let slideContainer = slider.querySelector('.slider__list');
  let amountSlides = slider.querySelectorAll('.slider__item').length;
  let indicatorContainer = slider.querySelector('.slider__indicators');

  let translate = 0;
  let delaySlide;
  let intervalSlider;
  let timer;

  slider.classList.remove('no-js')

  window.onresize = function () {
    if (document.documentElement.clientWidth >= 767) {
      indicatorContainer.children[translate].classList.remove('slider__ind-color');
      translate = 0
      indicatorContainer.children[translate].classList.add('slider__ind-color');
      slideContainer.style.transform = 'translate(0)';
      buttonForward.disabled = false;
      buttonBack.disabled = true;
    }
  }

  for (let i = 0; i < amountSlides; i++) {
    indicatorContainer.insertAdjacentHTML("beforeend", '<span class="slider__ind">')
  }
  indicatorContainer.children[translate].classList.add('slider__ind-color');

  if (amountSlides > 1) {

    let moveSlide = function () {
      slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
    }

    buttonBack.disabled = true;
    //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки
    let hideArrow = function () {
      // displayCurrentSlide.textContent = translate + 1 + '';
      if (translate === 0) {
        buttonBack.disabled = true;
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
      // slideContainer.classList.remove('slider__list--auto-duration');
      let forward = this === buttonForward;
      //==================
      indicatorContainer.children[translate].classList.remove('slider__ind-color');
      //===================
      if (forward && translate < amountSlides - 1) {
        buttonBack.disabled = false;
        translate += 1;
      } else if (!forward && translate > 0) {
        buttonForward.disabled = false;
        translate -= 1;
      }
      //==================
      indicatorContainer.children[translate].classList.add('slider__ind-color');
      //=======================
      moveSlide();
      hideArrow();
      // startAutoScroll();
    };

    buttonForward.addEventListener("click", onClickSlider);
    buttonBack.addEventListener("click", onClickSlider);

  }

} )();

(function () {
  //================================для секции feedback===========================
  // let startSlider = function () {

  const DELAY_START_SLIDER = 5000;
  let timeShowSlide = 4000;
  let slider = document.querySelector('.feedback');
  let buttonForward = slider.querySelector(".slider__forward");
  let buttonBack = slider.querySelector(".slider__back");
  let slideContainer = slider.querySelector('.slider__list');
  let amountSlides = slider.querySelectorAll('.slider__item').length;

  let displayCurrentSlide =slider.querySelector('.feedback__current-slides');
  let displayTotalSlide =slider.querySelector('.feedback__total-slides');
  let autoDuration = getComputedStyle(slider).getPropertyValue('--auto-duration');
  autoDuration = parseInt(autoDuration) || 1000;
  if (typeof autoDuration === 'number') {
    timeShowSlide += autoDuration
  }

  let translate = 0;
  let delaySlide;
  let intervalSlider;
  let timer;
  //показ текущего и суммы слайдов
  displayTotalSlide.textContent = amountSlides + '';
  displayCurrentSlide.textContent = translate + 1 + '';

  if (amountSlides > 1) {

    let moveSlide = function () {
      slideContainer.style.transform = 'translate(' + translate * -100 + '%)';
    }

    buttonBack.disabled = true;
    //при просмотре последнего/первого слайда функция отключает/включает соответсвующие кнопки
    let hideArrow = function () {
      if (translate === 0) {
        buttonBack.disabled = true;
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
      if (forward && translate < amountSlides - 1) {
        buttonBack.disabled = false;
        translate += 1;
      } else if (!forward && translate > 0) {
        buttonForward.disabled = false;
        translate -= 1;
      }
      displayCurrentSlide.textContent = translate + 1 + '';
      moveSlide();
      hideArrow();
      // startAutoScroll();
    };

    buttonForward.addEventListener("click", onClickSlider);
    buttonBack.addEventListener("click", onClickSlider);

    //для автоматической прокрутки слайдов
    function scrollAuto() {
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
      }, autoDuration)
    }

    let startAutoScroll = function () {
      timer = setTimeout(function () {
        intervalSlider = setInterval(function () {
          scrollAuto();
        }, timeShowSlide);
      }, DELAY_START_SLIDER)
    };
    // startAutoScroll()
  }

})();

