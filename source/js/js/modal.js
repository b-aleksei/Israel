"use strict";

(function () {

let modal = document.querySelector(".modal");
let success = document.querySelector(".success");
let modalWrap = modal.querySelector('.modal__wrap');
let btnBye = document.querySelectorAll("a[class$='__bye']");
let formFeedback = document.querySelector(".feedback__form");
let phone = modal.querySelector("input[name=phone]");
let email = modal.querySelector("input[name=email]");
let phoneFeedback = formFeedback.querySelector("input[name=phone]");
let emailFeedback = formFeedback.querySelector("input[name=email]");
let btnCloseModal = modal.querySelector(".modal__close");
let btnCloseSuccess = success.querySelector(".success__close");
let form = modal.querySelector("form");
let storagePhone = "";
let storageEmail = "";
let regCheckPhone = /^\+\d\s?\d{10}/;
let regCheckEmail = /([A-z0-9_.-]+)@([A-z0-9_.-]+).([A-z]{2,8})/;

let closeModalKey = function (e) {
  if (e.key === 'Escape') {
    modal.classList.remove("modal--block");
    document.removeEventListener("keydown", closeModalKey);
    modal.removeEventListener("mousedown", closeModalMouse);
  }
}

let closeSuccessKey = function (e) {
  if (e.key === 'Escape') {
    success.classList.remove("success--block");
    document.removeEventListener("keydown", closeSuccessKey);
    success.removeEventListener("mousedown", closeSuccessMouse);
  }
}

let closeModalMouse = function (e) {
  e.stopPropagation()
  if (e.target === this || e.target === btnCloseModal) {
    modal.classList.remove("modal--block");
    modalWrap.classList.remove("modal--error");
    modal.removeEventListener("mousedown", closeModalMouse);
    document.removeEventListener("keydown", closeModalKey);
    phone.removeEventListener('input', checkInput);
    email.removeEventListener('input', checkInput);
  }
}

let closeSuccessMouse = function (e) {
  e.stopPropagation()
  if (e.target === this || e.target === btnCloseSuccess) {
    success.classList.remove("success--block");
    success.removeEventListener("mousedown", closeSuccessMouse);
    document.removeEventListener("keydown", closeSuccessKey);
    phone.removeEventListener('input', checkInput);
    email.removeEventListener('input', checkInput);
  }
}
let checkInput = function () {
  let conditionPhone = !this.value.match(regCheckPhone);
  let conditionEmail = !this.value.match(regCheckEmail) && this.value !== '';
  let cssClass = (this === phone || this === email) ? 'modal__input--mistake' : 'feedback__input--mistake';
  let condition = (this === phone || this === phoneFeedback) ? conditionPhone : conditionEmail;
  if (condition) {
    this.classList.add(cssClass)
  } else {
    this.classList.remove(cssClass)
  }
}

let successSend = function (inp1, inp2) {
  if (inp2.value) {
    localStorage.setItem("email", inp2.value);
  }
  localStorage.setItem("phone", inp1.value);
  modal.classList.remove("modal--block");
  success.classList.add("success--block");
  document.addEventListener("keydown", closeSuccessKey);
  success.addEventListener("mousedown", closeSuccessMouse);
}

storageEmail = localStorage.getItem("email");
storagePhone = localStorage.getItem("phone");

if (storagePhone) {
  phone.value = storagePhone;
  phoneFeedback.value = storagePhone;
}
if (storageEmail !== 'undefined') {
  email.value = storageEmail;
  emailFeedback.value = storageEmail;
}

phoneFeedback.addEventListener('input', checkInput);
emailFeedback.addEventListener('input', checkInput);

try {
  btnBye.forEach(item => {
    item.addEventListener("click", function (evt) {
      evt.preventDefault();
      modal.classList.add("modal--block");
      phone.focus();
      phone.addEventListener('input', checkInput);
      email.addEventListener('input', checkInput);
      document.addEventListener("keydown", closeModalKey);
      modal.addEventListener("mousedown", closeModalMouse);
    });
  })
} catch (e) {
  console.log(e)
}

form.addEventListener("submit", function (evt) {
  successSend(phone, email);
  evt.preventDefault();
});

formFeedback.addEventListener("submit", function (evt) {
  successSend(phone, email);
  evt.preventDefault();
});

})();

