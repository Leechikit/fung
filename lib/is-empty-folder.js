/**
* @name: isEmptyFolder
* @description: 判断目录是否为空
* @author: lizijie
* @update: 
*/
const fs = require('fs');

module.exports = function isEmptyFolder(path) {
    let result = false;
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        if(!files || !files.length){
            result = true;
        }
    }
    return result;
}