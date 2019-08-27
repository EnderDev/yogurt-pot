const chalk = require('chalk');

class MessageSpawn {
  constructor(options) {
    let checks = [];
    if (options.state) checks.push('✔ State');
    if (options.message) checks.push('✔ Message');

    if (checks.length == 2) {
      let state = 'ℹ ';
      let color = chalk.blue;

      if (options.state == 'fatal') {
        state = '❌ ';
        color = chalk.red;
      } else if (options.state == 'warning') {
        state = '⚠ ';
        color = chalk.yellow;
      } else if (options.state == 'success') {
        state = '✔ ';
        color = chalk.green;
      } else {
        state = options.state;
        color = options.color;
      }

      console.log(color(`\n  ${state} ${options.message}`));
    } else {
      console.log(
        chalk.red(`❌ You need to set the ${!options.state ? 'state' : 'message'} property.`)
      );
    }
  }
}

module.exports = MessageSpawn;
