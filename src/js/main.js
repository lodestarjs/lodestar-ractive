let base ='/lodestar-ractive';

let router = new LodeRactive({ DEBUG: false, useHistory: true, basePath: base });

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
  path: '/tutorials',
  controller: () => { },
  view: {
    el: '#main-page',
    template: {
      url: base + '/tutorials',
      container: '#main-page',
      notOnSame: true
    }
  },
});

router.createRoute({
  path: '/load-example',
  controller: function() {

    clearCloak();

    setInterval(() => {
      this.set('time', new Date());
    }, 1000);

  },
  view: {
    el: '#examples',
    template: {
      url: base + '/load-example',
      container: '#examples',
      notOnSame: true
    },
    data: {
      'time': new Date()
    }
  },
  actions: {
    downToFirst: function() {
      scrollTo(document.body, document.getElementById('first').offsetTop, 600);
    }
  }
});

router.createRoute({
  path: '/',
  controller: function() {

    clearCloak();

    window.addEventListener("beforeunload", () => {
      localStorage.indexData = JSON.stringify(this.get());
    });

  },
  view: {
    el: '#main-page',
    data: {},
    data: (localStorage.indexData ? JSON.parse(localStorage.indexData) : { 'todo': { 'items': [], 'max': 5 } }),
    template: {
      url: base || '/',
      container: '#main-page',
      notOnSame: true
    }
  },
  actions: {
    randomColor: function () {
      this.set('color', "#" + Math.random().toString(16).slice(2, 8));
    },
    downToFirst: () => {
      scrollTo(document.body, document.querySelectorAll('.panel')[0].offsetTop, 600);
    },
    addTodo: function ( event, inputVal ) {
      if ( inputVal.length && this.get('todo.items').length < this.get('todo.max') ) {
        this.push( 'todo.items', { task: inputVal } );
        this.set('todo.input', '');
      }
      event.original.preventDefault();
    },
    activeTab: function( event ) {
      var active = document.querySelectorAll('.active');

      if ( active.length ) {
        [].forEach.call(active, function(el) {
          el.classList.remove('active');
        });
      }

      document.querySelector(event.node.hash).classList.add('active');
      event.node.classList.add('active');

      event.original.preventDefault();
      event.original.stopPropagation();
    }
  }
});