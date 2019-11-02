/* eslint-disable import/no-extraneous-dependencies */
const { walk } = require('walk');
const { readdir } = require('fs-extra');
const { join, parse } = require('path');
const chalk = require('chalk');
const { fileTypes } = require('../constants/legalFileType');
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const file = require('file');
const { filewalker } = require('../apis/walker');
const { minify } = require('uglify-es');
const forEach = require('async-foreach').forEach;
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
    filewalker(join(process.cwd(), base), function(err, data) {
      if (err) {
        return console.log(chalk.red(`\n        ❌  ${err.message}`));
      }

      callback(data);
    });
  }

  async start() {
    const { bundle } = this;
    const { getContents } = this;

    console.log(chalk.cyan(`\n    ↪  Starting bundle for ${chalk.bold(bundle.name)}`));

    console.log(
      chalk.magenta(`\n        🠶  Your bundle base is at${chalk.bold(`'${bundle.base}'`)}.
        🠶  Your output location is at${chalk.bold(`'${bundle.output}'`)}.\n`)
    );

    getContents(bundle.name, bundle.base, files => {
      var current = 0;
      var filesSize = 0;

      files.forEach(i => {
        if(fileTypes.includes(i.substr(i.lastIndexOf('.') + 1)) == true) {
          ++filesSize
        }
      });

      files.map(async (file) => {
        if (fileTypes.includes(file.substr(file.lastIndexOf('.') + 1)) == true) {
          var fileName = '.' + file.split(process.cwd())[1].replace(/\\/g, '/');
          var result = minify(fs.readFileSync(file, 'utf8'), {});
          if (result.error) {
            console.log(chalk.yellow(`        ⚠  Failed to bundle ${chalk.bold(fileName)}:${chalk.bold(`${result.error.line}:${result.error.pos}`)}.\n             🠶  ${result.error.message}\n`));
          }
          else {
            fs.mkdir(join(process.cwd(), bundle.output), () => {
              fs.writeFile(join(process.cwd(), bundle.output, file.split("\\").reverse()[0]), result.code, () => {
                if (bundle.log && bundle.log.showBundledFiles === true) {
                  console.log(chalk.magenta(`        🠶  Bundled file${chalk.underline.bold(fileName)}`));
                }
                ++current
              });
            });
          }
        }
      });

      /* Really crappy callback thing. */
      setInterval(() => {
        if(current == filesSize) {
          current = 0;
          if (bundle.log && bundle.log.showBundledFiles === false) {
            console.log(chalk.gray(`           Bundled ${chalk.bold(files.length)} files in total.`));
          }
          console.log(chalk.green(`\n    ✅  Completed bundle for ${chalk.bold(bundle.name)}`));
          process.exit(0)
        }
      }, 1);
    })
  }

  constructor(y) {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-unresolved
    console.log(chalk.bold(`\n  Yogurt Pot Bundler ${global.version}`));

    this.bundle = y;
  }
}

exports.yogurt = yogurt;
