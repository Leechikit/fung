const inquirer = require('inquirer');
const path = require("path");
const _ = require('lodash');
const chalk = require('chalk');
const exec = require('child_process').exec;
const gitDir = path.resolve(__dirname, '../git');

exports.register = function (commander) {
    commander
        .command('build')
        .option('-b, --branch [branchName]', '分支名称')
        .description('构建项目')
        .action(option => {
            exec('git branch -r', { cwd: gitDir }, (err, stdout, stderr) => {
                if (err) throw err;
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
                } else {
                    promps.push({
                        type: 'list',
                        name: 'branches',
                        message: '请选择构建的分支',
                        choices: _.map(list, item => { return { name: item, value: item } })
                    })
                }
                inquirer.prompt(promps).then(function (answers) {
                    console.log(answers)
                })
            })
        })
}