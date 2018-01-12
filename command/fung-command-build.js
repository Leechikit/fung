const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const exec = require('../lib/exec');
const pullBranch = require('../lib/pull-branch');
const copyToTarget = require('../lib/copy-to-target');
const formatConfig = require('../lib/format-config');
const isEmptyFolder = require('../lib/is-empty-folder');
const createFolder = require('../lib/create-folder');
const emptyFolder = require('../lib/empty-folder');
const log = require('../lib/log');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
var currDir = process.cwd();
let promise = null;

/**
* copy project
*
* @param: {String} repertory
* @return: {String} branchName
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
        if (fs.existsSync(currDir)) {
            emptyFolder(currDir);
        } else {
            fs.mkdirSync(currDir);
        }
        return copyToTarget(gitDir, currDir, result);
    }).then(() => {
        log.green(`${branchName} build success`);
    }).catch((err) => {
        log.error(err);
    });
}

exports.register = function (commander) {
    commander
        .command('build')
        .arguments('[template] [project]')
        .option('-t, --template <template>', 'prrint a template name')
        .option('-p, --project <project>', 'prrint a project name')
        .option('-r, --remote <repertory>', 'print a remote repertory url')
        .description('build a project')
        .action((template, project, option) => {
            const config = _.assign({
                template: null,
                project: null,
                repertory: fs.readFileSync(repertoryFile, 'utf8')
            }, { template, project }, option);
            // 在本地创建远程追踪分支
            exec('git remote update')
                // 删除本地版本库上那些失效的远程追踪分支
                .then(exec.bind(null, 'git remote prune origin'))
                // 列出所有被跟踪的远程分支
                .then(exec.bind(null, 'git branch -r'))
                .then(async (stdout) => {

                    let targetDir = currDir;
                    let list = String.prototype.split.call(stdout, '\n');
                    let choices = [];
                    let promps = [];
                    const isContinue = await createFolder(currDir, config.project);
                    if (!isContinue) return;
                    list = _.chain(list)
                        .map(item => {
                            return item.replace(/.*origin\/(\S+)/, "$1");
                        })
                        .filter(item => {
                            return _.trim(item) != '' && item != 'master';
                        })
                        .uniq()
                        .value();
                    if (config.project) {
                        currDir = path.join(currDir, config.project);
                    }
                    // 参数设置的分支存在
                    if (list.indexOf(config.template) > -1) {
                        await copyProject(config.repertory, config.template);
                    } else {
                        promps.push({
                            type: 'list',
                            name: 'branches',
                            message: 'choose one fung generator',
                            choices: _.map(list, item => { return { name: item, value: item } })
                        });
                        const answers = await inquirer.prompt(promps);
                        await copyProject(config.repertory, answers.branches);
                    }
                })
                .catch((err) => {
                    log.error(err);
                });
        });
}