let router = new LodeRactive({ DEBUG: false});

function clearCloak() {

  let elems = document.querySelectorAll('.cloak');
  [].forEach.call(elems, function(el) {
      el.classList.remove('cloak');
  });
}

function scrollTo(element, to, duration) {
  if (duration < 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function() {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

router.createRoute({
  path: '/',
  controller: () => {

    clearCloak();

  },
  view: {
    el: '#main-page',
    template: document.getElementById('main-page').innerHTML
  },
  actions: {
    randomColor: function() {
      this.set('color', "#" + Math.random().toString(16).slice(2, 8));
    },
    downToFirst: function() {
      scrollTo(document.body, document.getElementById('first').offsetTop, 600);
    }
  }
});