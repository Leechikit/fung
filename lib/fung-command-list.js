const path = require("path");
const _ = require('lodash');
const exec = require('child_process').exec;
const gitDir = path.resolve(__dirname,'../git');

exports.register = function (commander) {
    commander
        .command('list')
        .description('列出所有远程仓库')
        .action(option => {
            exec('git branch -r', { cwd: gitDir }, (err, stdout, stderr) => {
                if (err) throw err;
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
                console.log(list)
            })
        })
}