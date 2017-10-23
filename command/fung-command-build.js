const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const exec = require('../lib/exec');
const pullBranch = require('../lib/pullBranch');
const copyToTarget = require('../lib/copyToTarget');
const formatConfig = require('../lib/formatConfig');
const isEmptyFolder = require('../lib/isEmptyFolder');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
const currDir = process.cwd();
let promise = null;

/**
* 复制项目
*
* @param: {type} name description
* @return: {type} description
*/
function copyProject(repertory, branchName) {
    pullBranch({
        repertory,
        branch: branchName
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
        return copyToTarget(gitDir, currDir, result);
    }).then(() => {
        console.log(`${branchName} 构建成功`);
    }).catch((err) => {
        console.log(err);
    });
}

exports.register = function (commander) {
    commander
        .command('build')
        .option('-b, --branch [branchName]', '分支名称')
        .option('-r, --remote [repertory]', '远程仓库')
        .description('构建项目')
        .action(option => {
            if (!isEmptyFolder(currDir)) {
                console.log('此目录不为空，无法构建项目！');
                return;
            }
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
                        copyProject(repertory, option.branch);
                    } else {
                        promps.push({
                            type: 'list',
                            name: 'branches',
                            message: '请选择构建的分支',
                            choices: _.map(list, item => { return { name: item, value: item } })
                        });
                        inquirer.prompt(promps).then((answers) => {
                            copyProject(repertory, answers.branches);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
}