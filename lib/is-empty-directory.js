/**
* @name: isEmptyDirectory
* @description: is the directory empty
* @author: leechikit
* @update: 
*/
const fs = require('fs');

module.exports = function isEmptyDirectory(path) {
    let result = false;
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        if(!files || !files.length){
            result = true;
        }
    }
    return result;
}