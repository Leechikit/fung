const path = require("path");
const fs = require('fs');
const exec = require('../lib/exec');
const deleteFolder = require('../lib/deleteFolder');
const copyFolder = require('../lib/copyFolder');
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
            deleteFolder(gitDir);
            copyFolder(currDir, gitDir);
            exec(`git push ${repertory} :${branchName}`)
                .then((stdout) => {
                    console.log('推送成功')
                })
                .catch((err) => {
                    console.log(err);
                });
        });
}