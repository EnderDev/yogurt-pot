/* eslint-disable import/no-extraneous-dependencies */
const { walk } = require('walk');
const { readdir } = require('fs-extra');
const { join, parse } = require('path');
const chalk = require('chalk');
const { fileTypes } = require('../constants/legalFileType');
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
global.version = json.version;

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
  getContents(bundle, base, callback) {
    const walker = walk(join(process.cwd(), base));

    walker.on('errors', function(root, nodeStatsArray, next) {
      console.log(
        chalk.yellow(
          `\n        ⚠  Warning in ${chalk.bold(
            bundle
          )} - Unable to resolve '${root}' in directory './${parse(process.cwd()).base}'`
        )
      );
      console.log(chalk.magenta(`             🠶  No files will be bundled.`));
      process.exit(0);
    });

    // eslint-disable-next-line func-names
    walker.on('end', function() {
      console.log('all done');
    });

    // readdir(, function(e, r) {
    //   if (e) {
    //
    //   }
    //   if (!e) {
    //     callback(r);
    //   }
    // });
  }

  start() {
    const { bundle } = this;
    const { getContents } = this;

    console.log(chalk.cyan(`\n    ↪  Starting bundle for ${chalk.bold(bundle.name)}`));

    console.log(
      chalk.magenta(`\n        🠶  Your bundle base is at${chalk.bold(`'${bundle.base}'`)}.
        🠶  Your output location is at${chalk.bold(`'${bundle.output}'`)}.\n`)
    );

    getContents(bundle.name, bundle.base, files => {
      files.forEach(file => {
        if (fileTypes.includes(file.substr(file.lastIndexOf('.') + 1)) == true) {
          if (bundle.log && bundle.log.showBundledFiles === true) {
            console.log(chalk.magenta(`        🠶  Bundled file${chalk.underline.bold(file)}`));
          }
        }
      });
      console.log(chalk.green(`\n    ✅  Completed bundle for ${chalk.bold(bundle.name)}`));
    });
  }

  constructor(y) {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-unresolved
    console.log(chalk.bold(`\n    Yogurt Pot Bundler ${global.version}`));

    this.bundle = y;
  }
}

exports.yogurt = yogurt;
