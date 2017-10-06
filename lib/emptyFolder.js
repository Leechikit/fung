/**
* @name: emptyFolder
* @description: 清空目录所有内容
* @author: lizijie
* @update: 
*/

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = function emptyFolder(srcPath, exception, isParent = true) {
    if (fs.existsSync(srcPath)) {
        files = fs.readdirSync(srcPath);
        files.forEach(function (file, index) {
            var curPath = srcPath + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                if (!(exception && _.includes(exception, path.basename(curPath)))) {
                    emptyFolder(curPath, exception, false);
                }
            } else { // delete file
                if (!(exception && _.includes(exception, file))) {
                    fs.unlinkSync(curPath);
                }
            }
        });
        if (!isParent && !(exception && _.includes(exception, path.basename(srcPath)))) {
            fs.rmdirSync(srcPath);
        }
    }
};