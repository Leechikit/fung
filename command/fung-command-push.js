const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const exec = require('../lib/exec');
const emptyFolder = require('../lib/empty-folder');
const copyToCache = require('../lib/copy-to-cache');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
const currDir = process.cwd();

exports.register = function (commander) {
    commander
        .command('push')
        .option('-b, --branch [branchName]', '分支名称')
        .option('-r, --remote [repertory]', '远程仓库')
        .description('推送目录')
        .action(option => {
            let repertory = option.remote || fs.readFileSync(repertoryFile, 'utf8');
            let branchName = option.branch || path.basename(currDir);
            exec('git remote update')
                .then(exec.bind(null, 'git remote prune origin'))
                .then(exec.bind(null, 'git branch -r'))
                .then((stdout) => {
                    return new Promise((resolve, reject) => {
                        let list = String.prototype.split.call(stdout, '\n');
                        list = _.chain(list)
                            .map(item => {
                                return item.replace(/.*origin\/(\S+)/, "$1");
                            })
                            .filter(item => {
                                return _.trim(item) != '' && item != 'master';
                            })
                            .uniq()
                            .value();
                        if (list.indexOf(branchName) > 0) {
                            reject('此模板名称已经存在！');
                        } else {
                            resolve();
                        }
                    });
                })
                .then(exec.bind(null, 'git branch'))
                .then((stdout) => {
                    let list = String.prototype.split.call(stdout, '\n');
                    list = list.map(item => {
                        return item.replace(/\**\s*\**(\S+)/, "$1");
                    });
                    if (list.indexOf(branchName) > 0) {
                        return exec(`git checkout master`)
                                .then(exec.bind(null, `git branch -D ${branchName}`))
                    }
                })
                .then(exec.bind(null, `git checkout -b ${branchName}`))                                
                .then(() => {
                    emptyFolder(gitDir, ['.git', '.gitignore']);
                    return copyToCache(currDir, gitDir);
                })
                .then(exec.bind(null, 'git add .'))
                .then(exec.bind(null, 'git commit -m "update"'))
                .then(exec.bind(null, `git push ${repertory} ${branchName}`))
                .then((stdout) => {
                    console.log('推送成功')
                })
                .catch((err) => {
                    console.log(err);
                });
        });
}