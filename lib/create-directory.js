/**
* @name: createDirectory
* @description: create a new directory
* @author: leechikit
* @update: 
*/

/**
* create directory
*
* @param: {String} targetPath
* @param: {String} directoryName
*/

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

module.exports = function createDirectory(targetPath, directoryName) {
    return new Promise((resolve, reject) => {
        if (directoryName != void 0) {
            const folderPath = path.join(targetPath, directoryName);
            if (!fs.existsSync(folderPath)) {
                return resolve(true);
            } else {
                const promps = [{
                    type: 'confirm',
                    name: 'continue',
                    message: 'Target directory exists. Continue?'
                }];
                inquirer.prompt(promps).then(answers => {
                    return resolve(answers.continue);
                });
            }
        } else {
            const promps = [{
                type: 'confirm',
                name: 'continue',
                message: 'Generate project in current directory?'
            }];
            inquirer.prompt(promps).then(answers => {
                return resolve(answers.continue);
            });
        }
    });
}