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

  let selectValue = function () {
    startSelection = this.selectionStart;
    endSelection = this.selectionEnd;
    // console.log('selectHandlerStart',startSelection);
    // console.log('selectHandlerEnd',endSelection);
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
          // console.log('Delete');
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
      phone.removeEventListener('select', selectValue);
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
      phone.addEventListener('select', selectValue);
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



