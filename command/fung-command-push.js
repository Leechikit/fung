const path = require("path");
const fs = require('fs');
const _ = require('lodash');
const exec = require('../lib/exec');
const emptyDirectory = require('../lib/empty-directory');
const copyToCache = require('../lib/copy-to-cache');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
const currDir = process.cwd();

exports.register = function (commander) {
    commander
        .command('push [branchName]')
        .option('-a, --name [branchName]', '分支名称')
        .option('-r, --remote [repertory]', '远程仓库')
        .description('推送目录')
        .action(option => {
            let repertory = option.remote || fs.readFileSync(repertoryFile, 'utf8');
            let branchName = option.branch || path.basename(currDir);
            // 在本地创建远程追踪分支
            // await exec('git remote update');
            // 删除本地版本库上那些失效的远程追踪分支
            // await exec('git remote prune origin');
            // 列出所有被跟踪的远程分支
            // let stdout = await exec('git branch -r');
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
                    emptyDirectory(gitDir, ['.git', '.gitignore']);
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