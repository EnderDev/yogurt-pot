const yogurt = require('./src/bundle.js');

const bundle = new yogurt({
  name: 'main',
  base: '/demo',
  output: '/out',
  log: {
    showBundledFiles: true,
  },
  tasks: [{
    name: 'done',
    command: 'node out/main-file.js'
  }, {
    name: 'are-we-there-yet',
    command: 'node out/multi_layer_folders.js'
  }]
});

bundle.start();
