const _ = require('lodash');
const path = require("path");
const fs = require('fs');
const exec = require('child_process').exec;
const gitDir = path.resolve(__dirname,'../git');


exports.register = function (commander) {
    commander
        .command('remote [repertory]')
        .description('设置远程仓库')
        .action(option => {
            if (!fs.existsSync('git')) {
                fs.mkdirSync('git');
            }

            exec(`git clone ${option} ${gitDir}`, (err, stdout, stderr) => {
                if (err) throw err;

            })
        })
}