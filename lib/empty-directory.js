/**
* @name: emptyDirectory
* @description: empty all file in directory
* @author: leechikit
* @update: 
*/

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = function emptyDirectory(srcPath, exception, isParent = true) {
    if (fs.existsSync(srcPath)) {
        const files = fs.readdirSync(srcPath);
        files.forEach(function (file, index) {
            const curPath = srcPath + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                if (!(exception && _.includes(exception, path.basename(curPath)))) {
                    emptyDirectory(curPath, exception, false);
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