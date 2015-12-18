import LodeRactive from 'lodestar-ractive';

let router = new LodeRactive({ DEBUG: false});

router.createRoute({
  path: '/',
  controller: () => {
    console.log('index route');
  }
});