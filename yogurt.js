const yogurt = require('./src/bundle.js');

const bundle = new yogurt({
  name: 'main',
  base: '/demo'
});

bundle.start();
