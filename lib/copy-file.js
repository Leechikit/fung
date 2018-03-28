/**
* @name: copyFile
* @description: copy file data
* @author: leechikit
* @update: 
*/
const fs = require('fs');
const throuh2 = require('through2');
const replace = require('./replace');

module.exports = function copyFile(srcPath, tarPath, config, cb) {
    if (!fs.existsSync(tarPath)) {
        let rs = fs.createReadStream(srcPath)
        rs.on('error', (err) => {
            if (err) {
                throw new Error(`read error ${srcPath}`);
            }
            cb && cb(err)
        })

        let ws = fs.createWriteStream(tarPath)
        ws.on('error', (err) => {
            if (err) {
                throw new Error(`write error ${tarPath}`);
            }
            cb && cb(err)
        })
        ws.on('finish', () => {
            typeof cb == 'function' && cb(0);
        });

        if (config && Object.keys(config).length > 0) {
            rs.pipe(throuh2(function (chunk, enc, callback) {
                this.push(replace(chunk, config));
                callback();
            })).pipe(ws)
        } else {
            rs.pipe(ws);
        }
    }
}