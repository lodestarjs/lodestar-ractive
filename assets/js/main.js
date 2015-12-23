(function (LodeRactive) { 'use strict';

  LodeRactive = 'default' in LodeRactive ? LodeRactive['default'] : LodeRactive;

  function clearCloak() {

    var elems = document.querySelectorAll('.cloak');
    [].forEach.call(elems, function (el) {
      el.classList.remove('cloak');
    });
  }

  function scrollToEl(element, to, duration) {
    if (duration < 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollToEl(element, to, duration - 10);
    }, 10);
  }

  var TutorialsController = {

    controller: function controller() {}

  };

  var LoadExampleController = {

    controller: function controller() {
      var _this = this;

      clearCloak();

      setInterval(function () {
        _this.set('time', new Date());
      }, 1000);
    },

    actions: {
      downToFirst: function downToFirst() {
        scrollToEl(document.body, document.getElementById('first').offsetTop, 600);
      }
    }

  };

  var IndexController = {

    controller: function controller() {
      var _this = this;

      clearCloak();

      window.addEventListener("beforeunload", function () {
        localStorage.indexData = JSON.stringify(_this.get());
      });
    },

    actions: {
      randomColor: function randomColor() {
        this.set('color', "#" + Math.random().toString(16).slice(2, 8));
      },
      downToFirst: function downToFirst() {
        scrollToEl(document.body, document.querySelectorAll('.panel')[0].offsetTop, 600);
      },
      addTodo: function addTodo(event, inputVal) {
        if (inputVal.length && this.get('todo.items').length < this.get('todo.max')) {
          this.push('todo.items', { task: inputVal });
          this.set('todo.input', '');
        }
        event.original.preventDefault();
      },
      activeTab: function activeTab(event) {
        var active = document.querySelectorAll('.active');

        if (active.length) {
          [].forEach.call(active, function (el) {
            el.classList.remove('active');
          });
        }

        document.querySelector(event.node.hash).classList.add('active');
        event.node.classList.add('active');

        event.original.preventDefault();
        event.original.stopPropagation();
      }

    }

  };

  var base = '/lodestar-ractive';

  var router = new LodeRactive({ DEBUG: false, useHistory: true, basePath: base });

  router.createRoute({
    path: '/tutorials',
    controller: TutorialsController,
    view: {
      el: '#main-page',
      template: {
        url: base + '/tutorials',
        container: '#main-page',
        notOnSame: true
      }
    }
  });

  router.createRoute({
    path: '/load-example',
    controller: LoadExampleController,
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
    }
  });

  router.createRoute({
    path: '/',
    controller: IndexController,
    view: {
      el: '#main-page',
      data: {},
      data: localStorage.indexData ? JSON.parse(localStorage.indexData) : { 'todo': { 'items': [], 'max': 5 } },
      template: {
        url: base || '/',
        container: '#main-page',
        notOnSame: true
      }
    }
  });

})(LodeRactive);
//# sourceMappingURL=main.js.map
