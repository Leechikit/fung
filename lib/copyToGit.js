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
        var checkEnd = function (result) {
            typeof cb == 'function' && cb(result);
        }

        if (err) {
            checkEnd(1);
        }

        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)
            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    if (file != '.git') {
                        console.log('mkdir', tarPath)
                        fs.mkdir(tarPath, function (err) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            console.log('copy', tarPath)
                            copyToGit(srcPath, tarPath, config, checkEnd)
                        })
                    }
                } else {
                    console.log('copy', tarPath);
                    copyFile(srcPath, tarPath, config, checkEnd);
                }
            })
        })
        if (files.length === 0) {
            let gitkeepPath = path.join(tarDir, '.gitkeep');
            fs.open(gitkeepPath, 'a', (err, fd) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
    })
}