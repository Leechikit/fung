/**
* @name: pullBranch
* @description: pull branch from a remote repertory
* @author: leechikit
* @update: 
*/

const exec = require('child_process').exec;
const path = require("path");
const gitDir = path.resolve(__dirname, '../git');

module.exports = function pullBranch({ repertory, branch }) {
    return new Promise((resolve, reject) => {
        exec(`git checkout ${branch}`, { cwd: gitDir }, (err, stdout, stderr) => {
            if (err) return reject();
            exec(`git pull ${repertory} ${branch}`, { cwd: gitDir }, (err, stdout, stderr) => {
                return resolve();
            });
        });
    });
}