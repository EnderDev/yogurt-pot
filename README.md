# 📦 Yogurt Pot
> A nimble, fat-free bundler, with easy to implement APIs 

## Install
```cli
$ npm i yogurt-pot
```

## Example

```js
const { yogurt } = require('./src/bundle.js');

const bundle = new yogurt({
  name: 'main',
  base: '/demo',
  output: '/out',
  log: {
    showBundledFiles: true,
  }
});

bundle.start();
```
