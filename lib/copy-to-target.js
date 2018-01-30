/**
* @name: copyToTarget
* @description: copy template in cache directory to target directory 
* @author: leechikit
* @update: 
*/

const fs = require('fs');
const path = require('path');
const copyFile = require('./copy-file');
const log = require('../lib/log');

function copyToTarget(srcDir, tarDir, config, cb) {
    fs.readdir(srcDir, function (err, files) {
        let checkEnd = function (result) {
            typeof cb == 'function' && cb(result);
        }

        if (err) {
            checkEnd(1);
        }

        files.forEach(function (file) {
            let srcPath = path.join(srcDir, file);
            let tarPath = path.join(tarDir, file);
            if (!fs.existsSync(tarPath)) {
                fs.stat(srcPath, function (err, stats) {
                    if (stats.isDirectory()) {
                        if (file != '.git') {
                            fs.mkdir(tarPath, function (err) {
                                if (err) {
                                    log.error(err);
                                    return;
                                }
                                copyToTarget(srcPath, tarPath, config, checkEnd);
                            })
                        }
                    } else {
                        if (file != 'fung-config.js' && file != '.gitkeep') {
                            copyFile(srcPath, tarPath, config, checkEnd);
                        }
                    }
                })
            }
        })
        if (files.length === 0) {
            checkEnd(2);
        }
    })
}

module.exports = (srcDir, tarDir, config = {}) => {
    return new Promise((resolve, reject) => {
        copyToTarget(srcDir, tarDir, config, (result) => {
            if (result == 0) {
                resolve();
            } else {
                reject();
            }
        });
    }).catch(err => {
        log.error(err);
    });
}