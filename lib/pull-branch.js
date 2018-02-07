/**
* @name: pullBranch
* @description: pull branch from a remote repertory
* @author: leechikit
* @update: 
*/

const exec = require('../lib/exec');
const path = require("path");
const gitDir = path.resolve(__dirname, '../git');
const log = require('../lib/log');
const ora = require('ora');
const spinner = ora();

module.exports = async function pullBranch({ repertory, branch }) {
    spinner.start('downing template');
    await exec(`git checkout ${branch}`);
    await exec(`git pull ${repertory} ${branch}`);
    spinner.succeed();
}