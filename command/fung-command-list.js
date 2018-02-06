const _ = require('lodash');
const exec = require('../lib/exec');
const log = require('../lib/log');
const ora = require('ora');
const spinner = ora();

exports.register = function (commander) {
    commander
        .command('list')
        .description('list all templates')
        .action(async option => {
            spinner.start('updating templates');
            // 在本地创建远程追踪分支
            await exec('git remote update');
            // 删除本地版本库上那些失效的远程追踪分支
            await exec('git remote prune origin');
            // 列出所有被跟踪的远程分支
            let stdout = await exec('git branch -r');
            spinner.succeed();
            let list = String.prototype.split.call(stdout, '\n');
            let choices = [];
            list = _.chain(list)
                .map(item => {
                    return item.replace(/.*origin\/(\S+)/, "- $1");
                })
                .filter(item => {
                    return _.trim(item) != '' && item != '- master';
                })
                .uniq()
                .value();
            log.cyan(list.join('\n'));
        });
}