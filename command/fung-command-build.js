const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const exec = require('../lib/exec');
const pullBranch = require('../lib/pull-branch');
const copyToTarget = require('../lib/copy-to-target');
const formatConfig = require('../lib/format-config');
const isEmptyFolder = require('../lib/is-empty-folder');
const log = require('../lib/log');
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
        log.green(`${branchName} 构建成功`);
    }).catch((err) => {
        log.error(err);
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
                log.error('此目录不为空，无法构建项目！');
                return;
            }
            // 在本地创建远程追踪分支
            exec('git remote update')
                // 删除本地版本库上那些失效的远程追踪分支
                .then(exec.bind(null, 'git remote prune origin'))
                // 列出所有被跟踪的远程分支
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
                    log.error(err);
                });
        });
}