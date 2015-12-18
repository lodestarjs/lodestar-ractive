'use strict';

var router = new LodeRactive({ DEBUG: false, useHistory: true, basePath: window.location.href.indexOf('lodestar-ractive') > -1 ? '/lodestar-ractive' : '' });

function clearCloak() {

  var elems = document.querySelectorAll('.cloak');
  [].forEach.call(elems, function (el) {
    el.classList.remove('cloak');
  });
}

function scrollTo(element, to, duration) {
  if (duration < 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function () {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

router.createRoute({
  path: '/example',
  controller: function controller() {

    clearCloak();
  },
  view: {
    el: '#examples',
    template: {
      url: '/lodestar-ractive/example',
      container: '#examples',
      notOnSame: true
    }
  },
  actions: {
    downToFirst: function downToFirst() {
      scrollTo(document.body, document.getElementById('first').offsetTop, 600);
    }
  }
});

router.createRoute({
  path: '/',
  controller: function controller() {

    clearCloak();
  },
  view: {
    el: '#main-page',
    template: {
      url: '/lodestar-ractive',
      container: '#main-page',
      notOnSame: true
    }
  },
  actions: {
    randomColor: function randomColor() {
      this.set('color', "#" + Math.random().toString(16).slice(2, 8));
    },
    downToFirst: function downToFirst() {
      scrollTo(document.body, document.getElementById('first').offsetTop, 600);
    }
  }
});