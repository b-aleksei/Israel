"use strict";

(function () {

//  data-send-form

let modalOpeners = document.querySelectorAll("[data-modal-opener]");
let classHidden = "modal--call-invisible";
let modalCall = document.querySelector("." + classHidden);
let modalCallClose = modalCall.querySelector(".modal__close--call")

  let classHiddenSuccess = "modal--success-invisible";
let modalSuccess = document.querySelector("." + classHiddenSuccess);

// let sendForm = document.querySelector('[data-send-form]');
let modalSuccessClose = modalSuccess.querySelector(".modal__close--success");
let modalSuccessCloseOk = modalSuccess.querySelector(".modal__ok");

let storage = {};
let form = modalCall.querySelector("form");
let inputs = form.querySelectorAll(".modal__input");
inputs.forEach(function (input) {
  storage[input.name] = localStorage.getItem(input.name)
})

  let doAction = function () {
    inputs.forEach(function (input) {
      let value = storage[input.name]
      if (value) {
        input.value = value
      }
    })
  let submitForm = function (e) {
    inputs.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value)
    })
    modalCall.classList.add(classHidden)
    form.removeEventListener("submit", submitForm)
    onPopupOpener(modalSuccess, classHiddenSuccess, '' , modalSuccessClose, modalSuccessCloseOk)
    e.preventDefault();
    // checkInput()
  }
    form.addEventListener("submit", submitForm)
  }


/*  let checkInput = function () {
    let conditionPhone = !this.value.match(regCheckPhone);
    let conditionEmail = !this.value.match(regCheckEmail) && this.value !== '';
    let cssClass = (this === phone || this === email) ? 'modal__input--mistake' : 'feedback__input--mistake';
    let condition = (this === phone || this === phoneFeedback) ? conditionPhone : conditionEmail;
    if (condition) {
      this.classList.add(cssClass)
    } else {
      this.classList.remove(cssClass)
    }
  }*/


  let onPopupOpener = function (overlay, classHidden, modalOpeners, buttonClose, buttonCloseOther = false, doAction = false) {
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
      if (doAction) doAction()
    }

//  закрытие модалки по клику на оверлее и соотв. кнопкам
    let onCloseModalMouse = function (e) {
      e.stopPropagation();
      if (e.target === this || e.target === buttonClose || e.target === buttonCloseOther) {
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
    }

    // навершиваем на каждую кнопку обработчик открытия попапа
    if (modalOpeners) {
      modalOpeners.forEach(function (button) {
        button.addEventListener("click", openPopup)
      })
    } else openPopup()
  }

  onPopupOpener(modalCall, classHidden, modalOpeners, modalCallClose, '', doAction)

})();
