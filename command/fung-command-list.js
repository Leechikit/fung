const _ = require('lodash');
const exec = require('../lib/exec');
const log = require('../lib/log');

exports.register = function (commander) {
    commander
        .command('list')
        .description('列出所有远程仓库')
        .action(option => {
            exec('git remote update')
                .then(exec.bind(null, 'git remote prune origin'))
                .then(exec.bind(null, 'git branch -r'))
                .then((stdout) => {
                    let list = String.prototype.split.call(stdout, '\n');
                    let choices = [];
                    list = _.chain(list)
                        .map(item => {
                            return item.replace(/.*origin\/(\S+)/, "$1");
                        })
                        .filter(item => {
                            return _.trim(item) != '' && item != 'master';
                        })
                        .uniq()
                        .value();
                    log.cyan(list.join('\n'));
                });
        });
}