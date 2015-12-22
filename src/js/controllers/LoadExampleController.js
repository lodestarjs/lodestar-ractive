export default {

  controller: function() { },

  actions: {
    downToFirst: function() {
      scrollTo(document.body, document.getElementById('first').offsetTop, 600);
    }
  }

};