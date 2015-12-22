(function (LodeRactive) { 'use strict';

  LodeRactive = 'default' in LodeRactive ? LodeRactive['default'] : LodeRactive;

  function clearCloak() {

    let elems = document.querySelectorAll('.cloak');
    [].forEach.call(elems, function (el) {
      el.classList.remove('cloak');
    });
  }

  var TutorialsController = {

    controller: function () {

      clearCloak();

      setInterval(() => {
        this.set('time', new Date());
      }, 1000);
    }

  };

  var LoadExampleController = {

    controller: function () {},

    actions: {
      downToFirst: function () {
        scrollTo(document.body, document.getElementById('first').offsetTop, 600);
      }
    }

  };

  var IndexController = {

    controller: function () {

      clearCloak();

      window.addEventListener("beforeunload", () => {
        localStorage.indexData = JSON.stringify(this.get());
      });
    },

    actions: {
      randomColor: function () {
        this.set('color', "#" + Math.random().toString(16).slice(2, 8));
      },
      downToFirst: () => {
        scrollTo(document.body, document.querySelectorAll('.panel')[0].offsetTop, 600);
      },
      addTodo: function (event, inputVal) {
        if (inputVal.length && this.get('todo.items').length < this.get('todo.max')) {
          this.push('todo.items', { task: inputVal });
          this.set('todo.input', '');
        }
        event.original.preventDefault();
      },
      activeTab: function (event) {
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

  let base = '/lodestar-ractive';

  let router = new LodeRactive({ DEBUG: false, useHistory: true, basePath: base });

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
