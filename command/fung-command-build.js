const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const exec = require('../lib/exec');
const pullBranch = require('../lib/pullBranch');
const copyFolder = require('../lib/copyFolder');
const formatConfig = require('../lib/formatConfig');
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
            exec('git remote update')
                .then(exec.bind(null, 'git remote prune origin'))
                .then(exec.bind(null, 'git branch -r'))
                .then((stdout) => {
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
                    promps.length > 0 && inquirer.prompt(promps).then((answers) => {
                        pullBranch({
                            repertory,
                            branch: answers.branches
                        }).then(() => {
                            let config = formatConfig(gitDir);
                            let result;
                            if (config.length > 0) {
                                result = inquirer.prompt(config)
                            } else {
                                result = Promise.resolve();
                            }
                            return result;
                        }).then((result) => {
                            copyFolder(gitDir, currDir, result);
                            //console.log(`${answers.branches} 构建成功`);
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
}