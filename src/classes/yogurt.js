/* eslint-disable func-names */
const bundle = require('bundle-js');
const ugly = require('uglify-js');
const { readdir, readFile, writeFile, remove } = require('fs-extra');
const { performance } = require('perf_hooks');
const { join, parse } = require('path');
const ora = require('ora');
const rimraf = require('rimraf');
const MessageSpawn = require('../messaging/spawn');
const chalk = require('chalk');
const YogurtPot = require('../bundle.js');

const shouldBundle = ['js', 'ts', 'jsx', 'tsx', 'json'];
const shouldUglify = ['html', 'json'];

class yogurt {
  debugParsedCWD() {
    return parse(process.cwd());
  }

  debugHome() {
    return process.cwd();
  }

  /**
   * @param {(base: any) => void} base
   */
  getContents(base, callback) {
    readdir(join(this.debugHome(), base), function(e, r) {
      if (e) {
        new MessageSpawn({
          state: 'warning',
          message: `Unable to resolve '${base}' in directory './${this.debugParsedCWD().base}'`
        });
      }
      if (!e) {
        callback(r);
      }
    });
  }

  start() {
    const { y } = this;
    const { getContents } = this;

    new MessageSpawn({
      state: '↪ ',
      color: chalk.cyan,
      message: `Starting bundle for ${chalk.bold(y.name)}`
    });

    getContents(y.base, files => {
      console.log(files);
    });
  }

  constructor(y) {
    this.y = y;
  }
}

exports.yogurt = yogurt;
