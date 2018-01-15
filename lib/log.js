/**
* @name: log
* @description: show messages in terminal
* @author: leechikit
* @update: 
*/

const chalk = require('chalk');
const log = console.log;
const colors = ['red', 'green', 'yellow', 'blue', 'cyan'];
let result = {};

colors.forEach(item => {
    result[item] = val => {
        log(chalk[item](val));
    }
});

result.error = val => {
    log(chalk.bold.red('Error: %s'), val);
}

module.exports = result;