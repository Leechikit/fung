const _ = require('lodash');
const path = require("path");
const fs = require('fs');
const exec = require('../lib/exec');
const emptyFolder = require('../lib/emptyFolder');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');

exports.register = function (commander) {
    commander
        .command('remote [repertory]')
        .description('设置远程仓库')
        .action(option => {
            if(!fs.existsSync(gitDir)){
                fs.mkdirSync(gitDir);
            }
            emptyFolder(gitDir);
            
            // 写入仓库地址
            fs.writeFile(repertoryFile, new Buffer(option), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('写入成功');
                }
            });
            exec(`git clone ${option} ${gitDir}`);
            
        })
}