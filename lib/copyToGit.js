/**
* @name: copyToGit
* @description: 拷贝目录所有内容
* @author: lizijie
* @update: 
*/

const fs = require('fs');
const path = require('path');
const copyFile = require('./copyFile');

module.exports = function copyToGit(srcDir, tarDir, config, cb) {
    fs.readdir(srcDir, function (err, files) {
        let checkEnd = function (result) {
            typeof cb == 'function' && cb(result);
        }

        if (err) {
            checkEnd(1);
        }

        files.forEach(function (file) {
            let srcPath = path.join(srcDir, file)
            let tarPath = path.join(tarDir, file)
            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    if (file != '.git') {
                        fs.mkdir(tarPath, function (err) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            copyToGit(srcPath, tarPath, config, checkEnd);
                        })
                    }
                } else {
                    copyFile(srcPath, tarPath, config, checkEnd);
                }
            })
        })
        if (files.length === 0) {
            let gitkeepPath = path.join(tarDir, '.gitkeep');
            fs.open(gitkeepPath, 'a', (err, fd) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
    })
}