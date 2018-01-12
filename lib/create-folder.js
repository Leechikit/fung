/**
* create folder
*
* @param: {type} name description
* @return: {type} description
*/

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

module.exports = function createFolder(targetPath, folderName) {
    return new Promise((resolve, reject) => {
        if (folderName != void 0) {
            const folderPath = path.join(targetPath, folderName);
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