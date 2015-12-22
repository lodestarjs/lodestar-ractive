import LodeRactive from 'lodestar-ractive';
import IndexController from './controllers/IndexController';
import LoadExampleController from './controllers/LoadExampleController';
import TutorialsController from './controllers/TutorialsController';

let base ='/lodestar-ractive';

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
  },
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
    data: (localStorage.indexData ? JSON.parse(localStorage.indexData) : { 'todo': { 'items': [], 'max': 5 } }),
    template: {
      url: base || '/',
      container: '#main-page',
      notOnSame: true
    }
  }
});