"use strict"; // для поддержки forEach в IE11

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

(function () {
  var onPopupOpener = function onPopupOpener(overlay, classHidden, modalOpeners, buttonsClose) {
    var doAction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    /*
    Попап открывается посредством удаления класса со св-м display: none
    * overlay - див с модальным окном(попапом)
    * classHidden - клас с свойством: display: none
    * modalOpeners - массив кнопок открытия попапа
    * buttonClose - кнопка закрытия попапа
    * buttonCloseOther - дполнителная кнопка закрытия окна
    .body-lock {overflow-y: scroll; position:fixed;}
    * */
    var body = document.body; // открытие попапа

    var openPopup = function openPopup(e) {
      if (e) {
        e.preventDefault();
      }

      overlay.classList.remove(classHidden);
      document.addEventListener("keydown", onCloseModalKey);
      overlay.addEventListener("click", onCloseModalMouse);
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
      overlay.removeEventListener("click", onCloseModalMouse); //  для предовращения скрола

      body.classList.remove('body-lock');
      window.scrollTo(0, body.dataset.scrollY);

      if (typeof overlay.endAction === 'function') {
        overlay.endAction(); // эта функция снаружи что то делает после закрытия окна
      }
    }; // навершиваем на каждую кнопку обработчик открытия попапа


    if (modalOpeners) {
      modalOpeners.forEach(function (button) {
        button.addEventListener("click", openPopup);
      });
    } else openPopup();
  };

  var modalOpeners = document.querySelectorAll("[data-modal-opener]");
  var classHidden = "modal--call-invisible";
  var modalCall = document.querySelector("." + classHidden);
  var modalCallClose = modalCall.querySelectorAll(".modal__close--call");
  var classHiddenSuccess = "modal--success-invisible";
  var modalSuccess = document.querySelector("." + classHiddenSuccess);
  var pageForms = document.querySelectorAll('[data-send-form]');
  var modalSuccessClose = modalSuccess.querySelectorAll(".modal__close--success, .modal__ok");
  var storage = {};
  var form = modalCall.querySelector(".modal__form");
  var inputsModal = form.querySelectorAll(".modal__input");
  var phone = form.querySelector('.modal__input--phone');
  var name = form.querySelector('.modal__input--name');

  modalCall.endAction = function () {
    form.removeEventListener("submit", submitForm);
    form.removeEventListener('focusin', onValidate);
  };

  inputsModal.forEach(function (input) {
    storage[input.name] = localStorage.getItem(input.name);
  });

  var submitForm = function submitForm(e) {
    inputsModal.forEach(function (input) {
      storage[input.name] = localStorage.setItem(input.name, input.value);
    });
    modalCall.classList.add(classHidden);
    onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
    e.preventDefault();
  };

  var doAction = function doAction() {
    form.addEventListener('focusin', onValidate);
    name.focus();
    inputsModal.forEach(function (input) {
      var value = storage[input.name];

      if (value) {
        input.value = value;
      }

      input.parentElement.classList.remove('invalid');
    });
    form.addEventListener("submit", submitForm);
  };

  onPopupOpener(modalCall, classHidden, modalOpeners, modalCallClose, doAction); // ======================валидация телефона===================================================

  var START_INDEX = 4;
  var CLOSE_BRACE = 6;
  var FIRST_NUMBER = "7";
  var marker = '_';
  var sep = ' ';
  var startSelection = 0;
  var endSelection = 0;
  var pastePattern = ['+', '9', ' ', '(', '9', '9', '9', ')', ' ', '9', '9', '9', sep, '9', '9', sep, '9', '9'];
  var pattern = ['+', FIRST_NUMBER, ' ', '(', marker, marker, marker, ')', ' ', marker, marker, marker, sep, marker, marker, sep, marker, marker];
  var controlKeys = ["Tab", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
  var result = pattern.slice();
  var focus;
  var initialValue = pattern.join('');

  var checkValidity = function checkValidity(inp) {
    if (!inp.validity.valid) {
      inp.parentElement.classList.remove('valid');
      inp.parentElement.classList.add('invalid');
    } else {
      inp.parentElement.classList.remove('invalid');
      inp.parentElement.classList.add('valid');
    }
  };

  var pasteValue = function pasteValue() {
    var ctx = this;
    setTimeout(function () {
      var value = Array.from(ctx.value).filter(function (item) {
        return /\d/.test(item);
      });
      value.reverse();
      var pattern = pastePattern.slice();

      for (var i = 0; i < pattern.length; i++) {
        if (pattern[i] !== '9') continue;
        pattern[i] = value.pop() || marker;
      }

      pattern[1] = FIRST_NUMBER;
      result = pattern;
      ctx.value = pattern.join('');
      startSelection = endSelection = 0;
      checkValidity(ctx);
    });
  };

  var selectValue = function selectValue() {
    startSelection = this.selectionStart;
    endSelection = this.selectionEnd;
  };

  var enterValue = function enterValue(e) {
    var IsSelectionTrue = startSelection !== endSelection;

    if (!e.ctrlKey) {
      focus = this.selectionStart < START_INDEX ? this.selectionStart = START_INDEX : this.selectionStart;
    }

    var isControlKey = controlKeys.some(function (key) {
      return e.key === key;
    });

    if (!isControlKey && !e.ctrlKey) {
      e.preventDefault();

      if (IsSelectionTrue && this.selectionStart !== this.selectionEnd) {
        var _result;

        var clearData = pattern.slice(startSelection, endSelection);

        (_result = result).splice.apply(_result, [startSelection, endSelection - startSelection].concat(_toConsumableArray(clearData)));
      }

      if (/\d/.test(e.key) && focus < result.length) {
        var index = result.indexOf(marker);
        var separator = result.indexOf(sep, this.selectionStart);

        if (index === -1) {
          for (var i = this.selectionStart; i < result.length; i++) {
            index = i;
            if (/\d/.test(result[i])) break;
          }
        }

        result[index] = e.key;
        focus = index === CLOSE_BRACE ? CLOSE_BRACE + 2 : separator - index === 1 ? index + 1 : index;
      } else {
        if (e.key === 'Backspace') {
          if (!IsSelectionTrue && result[focus - 1] !== '(') {
            var insert;

            switch (result[this.selectionStart - 1]) {
              case ' ':
                insert = ' ';
                break;

              case ')':
                insert = ')';
                break;

              default:
                insert = marker;
            }

            result.splice(this.selectionStart - 1, 1, insert);
            focus -= 1;
          }
        }

        if (e.key === 'Delete' && !IsSelectionTrue) {
          var _index = result.slice(focus).findIndex(function (item) {
            return /\d/.test(item);
          });

          if (~_index) {
            result[focus + _index] = marker;
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

  var deleteHandler = function deleteHandler(e) {
    if (e.target === phone) {
      phone.removeEventListener('paste', pasteValue);
      phone.removeEventListener('select', selectValue);
      phone.removeEventListener('keydown', enterValue);
    }

    if (e.target === name) {
      name.removeEventListener('input', checkInputName);
    }

    form.removeEventListener('focusout', deleteHandler);
  };

  var checkInputName = function checkInputName() {
    checkValidity(name);
  };

  var onValidate = function onValidate(e) {
    if (e.target.name === 'phone') {
      var _phone = e.target;
      _phone.value = _phone.value || storage[_phone.name] || initialValue;
      setTimeout(function () {
        _phone.selectionStart = _phone.selectionEnd = focus || START_INDEX;
      });
      initialValue = '';

      _phone.addEventListener('paste', pasteValue);

      _phone.addEventListener('select', selectValue);

      _phone.addEventListener('keydown', enterValue);
    }

    if (e.target.name === 'name') {
      var _name = e.target;
      _name.value = storage[_name.name] || _name.value;

      _name.addEventListener('input', checkInputName);
    }

    this.addEventListener('focusout', deleteHandler);
  }; // валидация форм на главной странице


  pageForms.forEach(function (form) {
    var inputs = form.querySelectorAll('input:not([type=checkbox])');
    form.addEventListener('focusin', onValidate);
    form.addEventListener('submit', function (e) {
      inputs.forEach(function (input) {
        storage[input.name] = localStorage.setItem(input.name, input.value);
      });
      onPopupOpener(modalSuccess, classHiddenSuccess, '', modalSuccessClose);
      e.preventDefault();
    });
  });
})(); //=========================секция программы==================================================


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