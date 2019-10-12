/* eslint-disable import/no-extraneous-dependencies */
const { walk } = require('walk');
const { readdir } = require('fs-extra');
const { join, parse } = require('path');
const chalk = require('chalk');
const { fileTypes } = require('../constants/legalFileType');
const prettyBytes = require('pretty-bytes');
const moment = require("moment")
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const { spawn } = require('child_process');

const ugly = require("uglify-es");

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
    const filesToBundle = [];

    walker.on("file", function (root, fileStats, next) {
      const file = {
        name: fileStats.name,
        size: prettyBytes(fileStats.size),
        location: root.split(process.cwd())[1]
      };
      filesToBundle.push(file)
        next();
    });

    walker.on('errors', function(root, nodeStatsArray, next) {
      console.log(
        chalk.yellow(
          `\n        ⚠  Warning in ${chalk.bold(
            bundle
          )} - Unable to resolve '${root}' in directory './${parse(process.cwd()).base}'`
        )
      );
      console.log(chalk.magenta(`             🠶  No files will be bundled.`));
      console.log(chalk.red(`\n    ❌  Failed bundle for ${chalk.bold(bundle.name)}\n`));
      process.exit(0);
    });

    // eslint-disable-next-line func-names
    walker.on('end', function() {
      if(filesToBundle.length == 0) {
        console.log(chalk.yellow(`        ⚠  No files were bundled that time. Is your config correct?`));
      }
      callback(filesToBundle);
    });
  }

  start() {
    const { bundle } = this;
    const { getContents } = this;

    const time = new Date();

    console.log(chalk.cyan(`\n    ↪  Starting bundle for ${chalk.bold(bundle.name)}`));

    console.log(
      chalk.magenta(`\n        🠶  Your bundle base is at ${chalk.bold(`'${bundle.base}'`)}.
        🠶  Your output location is at ${chalk.bold(`'${bundle.output}'`)}.\n`)
    );

    getContents(bundle.name, bundle.base, files => {
      files.forEach((file, index) => {
        if (fileTypes.includes(file.name.substr(file.name.lastIndexOf('.') + 1)) == true) {

          const contents = fs.readFileSync(join(process.cwd() + file.location + '\\' + file.name), 'utf-8');

          var result = ugly.minify(contents);

          if(result.code) {

            if (!fs.existsSync(join(process.cwd() + this.bundle.output))) {
              fs.mkdirSync(join(process.cwd() + this.bundle.output));
            }

            fs.writeFile(join(process.cwd() + this.bundle.output + '\\' + file.name), result.code, function(err) {

              if(err) {
                console.log(chalk.red(`        ❌  ${err.message}`));
                console.log(chalk.red(`\n    ❌  Failed bundle for ${chalk.bold(bundle.name)}\n`));
                process.exit(0)
              }
          
              if (bundle.log && bundle.log.showBundledFiles === true) {
                console.log(chalk.magenta(`        🠶  Bundled file ${chalk.underline.bold(file.name)} (${file.size})`));
              }   

              if(index == files.length-1) {
                console.log(chalk.green(`\n    ✅  Completed bundle for ${chalk.bold(bundle.name)}, which took ${moment(time).fromNow().split(" ago")[0]}\n`));

                if(bundle.tasks) {

                  var queue = bundle.tasks;
                  var firstTask = bundle.tasks[0];

                  runTask(queue[0])

                  function runTask(task) {
                    
                      console.log(chalk.cyan(`\n    🕒  Running task ${chalk.bold(task.name)}\n`));
    
                      setTimeout(() => {
                        const child = spawn(task.command.split(" ")[0], task.command.split(" ")[1].split(" "));
  
                        queue.push(task);
      
                        child.stdout.on('data', function(data) {
                          console.log(`           ${data.toString()}`); 
                        });
    
                        child.on('close', function() {
                          console.log(chalk.green(`\n    ✅  Completed task ${chalk.bold(task.name)}`));

                          queue.shift()
                          if(queue[0] != firstTask) {
                            runTask(queue[0])
                          } else {
                            console.log("\n")
                          }

                        })
                      }, 1000);
                    
                  }
   
                }
              }

            });          
          } else {
            if(result.error) {
              result.error.message = result.error.message.replace(/«/g, "'").replace(/»/g, "'")
              console.log(chalk.red(`        ❌  ${result.error.message} ${chalk.underline.bold(`in ${file.name} on line`)} (${result.error.line}:${result.error.pos})`));
              console.log(chalk.red(`\n    ❌  Failed bundle for ${chalk.bold(bundle.name)}\n`));
              process.exit(0)
            }
          }

        } else {
          if(bundle.log && bundle.log.verbose === true) {
            console.log(chalk.gray(`        🠶  Skipped ${chalk.underline.bold(file.name)} (${file.size})`));
          }
        }
      });
    })

    
  }

  constructor(y) {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-unresolved
    console.log(chalk.bold(`\n    Yogurt Pot Bundler ${global.version}`));

    this.bundle = y;
  }
}

exports.yogurt = yogurt;
