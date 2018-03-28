/**
* @name: copyToCache
* @description: copy template in remote repertory to cache directory 
* @author: leechikit
* @update: 
*/

const fs = require('fs');
const path = require('path');
const copyFile = require('./copy-file');
const log = require('../lib/log');

function copyToCache(srcDir, tarDir, config, cb) {
    fs.readdir(srcDir, (err, files) => {
        let checkEnd = result => {
            typeof cb == 'function' && cb(result);
        }

        if (err) {
            checkEnd(1);
        }

        files.forEach(file => {
            let srcPath = path.join(srcDir, file);
            let tarPath = path.join(tarDir, file);
            fs.stat(srcPath, (err, stats) => {
                if (stats.isDirectory()) {
                    if (file != '.git') {
                        if (!fs.existsSync(tarPath)) {
                            fs.mkdirSync(tarPath);
                        }
                        copyToGit(srcPath, tarPath, config, checkEnd);
                    }
                } else {
                    copyFile(srcPath, tarPath, config, checkEnd);
                }
            });
        })
        if (files.length === 0) {
            let gitkeepPath = path.join(tarDir, '.gitkeep');
            fs.open(gitkeepPath, 'a', (err, fd) => {
                if (err) {
                    throw err;
                    return;
                }
            });
        }
    })
}

module.exports = (srcDir, tarDir, config = {}) => {
    return new Promise((resolve, reject) => {
        copyToCache(srcDir, tarDir, config, (result) => {
            if (result == 0) {
                resolve();
            } else {
                reject(result);
            }
        });
    })
}