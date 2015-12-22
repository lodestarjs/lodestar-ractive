import { clearCloak } from '../helpers/helpers';

export default {

  controller: function() {

    clearCloak();

    setInterval(() => {
      this.set('time', new Date());
    }, 1000);

  }

};