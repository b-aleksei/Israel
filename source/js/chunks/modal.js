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



