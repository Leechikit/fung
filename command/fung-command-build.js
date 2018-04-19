const inquirer = require('inquirer');
const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const ora = require('ora');
const spinner = ora();
const exec = require('../lib/exec');
const pullBranch = require('../lib/pull-branch');
const copyToTarget = require('../lib/copy-to-target');
const formatConfig = require('../lib/format-config');
const createDirectory = require('../lib/create-directory');
const log = require('../lib/log');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
var currDir = process.cwd();

/**
* copy project
*
* @param: {String} repertory
* @return: {String} branchName
*/
async function copyProject(repertory, branchName) {
    const projectName = path.basename(currDir);
    const templateDir = path.join(gitDir, 'template');
    let result;
    await pullBranch({
        repertory,
        branch: branchName
    });
    let config = await formatConfig(gitDir, projectName);
    let prompts = config.prompts;
    if (prompts && prompts.length > 0) {
        result = await inquirer.prompt(prompts);
    }
    if (!fs.existsSync(currDir)) {
        fs.mkdirSync(currDir);
    }
    await copyToTarget(templateDir, currDir, result);
    if (config.completeMessage != void 0) {
        log.gray(config.completeMessage);
    } else {
        log.gray(`${branchName} build success`);
    }
}

exports.register = function (commander) {
    commander
        .command('build')
        .arguments('[template] [project]')
        .option('-t, --template <template>', 'prrint a template name')
        .option('-p, --project <project>', 'prrint a project name')
        .description('build a project')
        .action(async (template, project, option) => {
            const setting = _.assign({
                template: null,
                project: null,
                repertory: fs.readFileSync(repertoryFile, 'utf8')
            }, { template, project }, option);
            const isContinue = await createDirectory(currDir, setting.project);
            if (!isContinue) return;
            spinner.start('updating templates');
            if (!setting.repertory) {
                throw new Error('you need to define a remote repertory');
            }else{
                await exec(`git clone ${setting.repertory} ${gitDir}`);
            }
            // 在本地创建远程追踪分支
            await exec('git remote update');
            // 删除本地版本库上那些失效的远程追踪分支
            await exec('git remote prune origin');
            // 列出所有被跟踪的远程分支
            let stdout = await exec('git branch -r');
            spinner.succeed();
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
            if (setting.project) {
                currDir = path.join(currDir, setting.project);
            }
            if (setting.template) {
                // 参数设置的分支存在
                if (list.indexOf(setting.template) > -1) {
                    await copyProject(setting.repertory, setting.template);
                } else {
                    throw new Error('can not find this template in remote repertory');
                }
            } else {
                promps.push({
                    type: 'list',
                    name: 'template',
                    message: 'Choose one fung template',
                    choices: _.map(list, item => { return { name: item, value: item } })
                });
                const answers = await inquirer.prompt(promps);
                await copyProject(setting.repertory, answers.template);
            }
        });
}