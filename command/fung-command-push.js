const path = require("path");
const fs = require('fs');
const exec = require('../lib/exec');
const emptyFolder = require('../lib/emptyFolder');
const copyToGit = require('../lib/copyToGit');
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
            exec(`git checkout -b ${branchName}`)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        emptyFolder(gitDir, ['.git', '.gitignore']);
                        copyToGit(currDir, gitDir, [], (result) => {
                            if (result == 0) {
                                resolve();
                            } else {
                                reject(result);
                            }
                        });
                    })
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