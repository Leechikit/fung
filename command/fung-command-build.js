const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const exec = require('child_process').exec;
const pullBranch = require('../lib/pullBranch');
const copyFolder = require('../lib/copyFolder');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
const currDir = process.cwd();

exports.register = function (commander) {
    commander
        .command('build')
        .option('-b, --branch [branchName]', '分支名称')
        .option('-r, --remote [repertory]', '远程仓库')
        .description('构建项目')
        .action(option => {
            exec('git remote update', { cwd: gitDir }, (err, stdout, stderr) => {
                if (err) throw err;
                exec('git remote prune origin', { cwd: gitDir }, (err, stdout, stderr) => {
                    if (err) throw err;
                    exec('git branch -r', { cwd: gitDir }, (err, stdout, stderr) => {
                        if (err) throw err;
                        let repertory = option.remote || fs.readFileSync(repertoryFile, 'utf8');
                        let list = String.prototype.split.call(stdout, '\n');
                        let choices = [];
                        let promps = [];
                        list = _.chain(list)
                            .map(item => {
                                return item.replace(/.*origin\/(\S+)/, "$1");
                            })
                            .filter(item => {
                                return _.trim(item) != '' && item != 'master';
                            })
                            .uniq()
                            .value();
                        // 参数设置的分支存在
                        if (list.indexOf(option.branch) > -1) {
                            pullBranch({
                                repertory,
                                branch: option.branch
                            }).then(() => {
                                copyFolder(gitDir, currDir);
                                console.log(`${option.branch} 构建成功`);
                            });
                        } else {
                            promps.push({
                                type: 'list',
                                name: 'branches',
                                message: '请选择构建的分支',
                                choices: _.map(list, item => { return { name: item, value: item } })
                            })
                        }
                        promps.length > 0 && inquirer.prompt(promps).then(function (answers) {
                            pullBranch({
                                repertory,
                                branch: answers.branches
                            }).then(() => {
                                copyFolder(gitDir, currDir);
                                console.log(`${answers.branches} 构建成功`);
                            });
                        })
                    });
                });
            });
        })
}