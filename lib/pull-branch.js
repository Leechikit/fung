/**
* @name: pullBranch
* @description: pull branch from a remote repertory
* @author: leechikit
* @update: 
*/

const exec = require('child_process').exec;
const path = require("path");
const gitDir = path.resolve(__dirname, '../git');
const log = require('../lib/log');
const ora = require('ora');
const spinner = ora();

module.exports = function pullBranch({ repertory, branch }) {
    spinner.start('downing template');
    return new Promise((resolve, reject) => {
        exec(`git checkout aa`, { cwd: gitDir }, (err, stdout, stderr) => {
            if (err) {
                spinner.fail();
                return reject(err);
            }
            exec(`git pull ${repertory} ${branch}`, { cwd: gitDir }, (err, stdout, stderr) => {
                if (err) {
                    spinner.fail();
                    return reject(err);
                }
                spinner.succeed();
                return resolve();
            });
        });
    });
}