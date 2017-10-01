/**
* @name: exec
* @description: 执行git命令
* @author: lizijie
* @update: 
*/

const path = require("path");
const exec = require('child_process').exec;
const gitDir = path.resolve(__dirname, '../git');

module.exports = function execGit(command) {
    
    return new Promise((resolve, reject) => {
        
        exec(command, { cwd: gitDir }, (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(stdout);
        });
    });

}