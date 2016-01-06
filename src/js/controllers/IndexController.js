import { clearCloak, scrollToEl } from '../helpers/helpers';

export default {

  controller: function() {

    clearCloak();

    window.addEventListener("beforeunload", () => {
      localStorage.indexData = JSON.stringify(this.get());
    });

  },

  actions: {
    randomColor: function () {
      this.set('color', "#" + Math.random().toString(16).slice(2, 8));
    },
    downToFirst: (event) => {
      scrollToEl(document.body, document.querySelectorAll('.panel')[0].offsetTop, 600);
      return false;
    },
    addTodo: function ( event, inputVal ) {
      if ( inputVal.length && this.get('todo.items').length < this.get('todo.max') ) {
        this.push( 'todo.items', { task: inputVal } );
        this.set('todo.input', '');
      }
      return false;
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

      return false;
    }

  }


}