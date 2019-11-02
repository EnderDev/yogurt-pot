const { yogurt, task } = require('./src/bundle.js');

const bundle = new yogurt({
  name: 'main',
  base: '/demo',
  output: '/out',
  log: {
    showBundledFiles: true
  }
});

bundle.start();