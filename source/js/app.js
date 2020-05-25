"use strict";

( function () {


//  data-send-form
  let body = document.body
  let modalOpeners = document.querySelectorAll("[data-modal-opener]");
  let classHidden = "modal--call-invisible";
  let modalCall = document.querySelector("." + classHidden);
  let modalCallClose = modalCall.querySelectorAll(".modal__close--call");
  let classHiddenSuccess = "modal--success-invisible";
  let modalSuccess = document.querySelector("." + classHiddenSuccess);
// let sendForm = document.querySelector('[data-send-form]');
  let modalSuccessClose = modalSuccess.querySelectorAll(".modal__close--success, .modal__ok");

  let storage = {};
  let form = modalCall.querySelector(".modal__form");
  let inputs = form.querySelectorAll(".modal__input");
  let phone = form.querySelector('.modal__input--phone');
  let name = form.querySelector('.modal__input--name');

  inputs.forEach(function (input) {
    storage[input.name] = localStorage.getItem(input.name)
  })

  let doAction = function () {
    name.focus();
    inputs.forEach(function (input) {
      let value = storage[input.name]
      if (value) {
        input.value = value
      }
      input.parentElement.classList.remove('invalid');
    })
    let submitForm = function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value)
      })
      modalCall.classList.add(classHidden);
      onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
      form.removeEventListener("submit", submitForm);
      e.preventDefault();
    }
    form.addEventListener("submit", submitForm)
  }


  let onPopupOpener = function (overlay, classHidden, modalOpeners, buttonsClose, doAction = false) {
    /*
    Попап открывается посредством удаления класса со св-м display: none
    * overlay - див с модальным окном(попапом)
    * classHidden - клас с свойством: display: none
    * modalOpeners - массив кнопок открытия попапа
    * buttonClose - кнопка закрытия попапа
    * buttonCloseOther - дполнителная кнопка закрытия окна
    * */


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
        window.scrollTo(0, body.dataset.scrollY)
    }

    // навершиваем на каждую кнопку обработчик открытия попапа
    if (modalOpeners) {
      modalOpeners.forEach(function (button) {
        button.addEventListener("click", openPopup)
      })
    } else openPopup()
  }

  onPopupOpener(modalCall, classHidden, modalOpeners, modalCallClose, doAction)


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

  let checkValidity = function () {
    if (this.validity.patternMismatch || this.value === '') {
      this.parentElement.classList.remove('valid')
      this.parentElement.classList.add('invalid')
    } else {
      this.parentElement.classList.remove('invalid')
      this.parentElement.classList.add('valid')
    }
  };

  let pasteValue = function () {
    setTimeout(function() {
      let value = Array.from(this.value).filter(function(item) {
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
      this.value = pattern.join('');
      startSelection = endSelection = 0;
      checkValidity.call(this);
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
      console.log('tre');
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
    checkValidity.call(this);
  };

  form.addEventListener('focusin', function (e) {
    if (e.target === phone) {
      phone.value = phone.value || storage[phone.name] || initialValue;
      setTimeout(function() {
        phone.selectionStart = phone.selectionEnd = focus || START_INDEX;
      });
      initialValue = '';
      phone.addEventListener('paste', pasteValue);
      phone.addEventListener('select', selectValue);
      phone.addEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.addEventListener('input', checkValidity);
      name.value = name.value || storage[name.name] || " ";
    }
  });

  form.addEventListener('focusout', function (e) {

    if (e.target === phone) {
      phone.removeEventListener('paste', pasteValue);
      phone.removeEventListener('select', selectValue);
      phone.removeEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.removeEventListener('input', checkValidity);
    }

  });

} )();
//===========================================================================
