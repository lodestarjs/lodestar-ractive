import { clearCloak, scrollToEl } from '../helpers/helpers';

export default {

  controller: function() {

    clearCloak();

    setInterval(() => {
      this.set('time', new Date());
    }, 1000);

  },

  actions: {
    downToFirst: function() {
      scrollToEl(document.body, document.getElementById('first').offsetTop, 600);
    }
  }

};