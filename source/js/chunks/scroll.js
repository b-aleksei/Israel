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





