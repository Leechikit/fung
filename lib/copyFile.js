/**
* @name: copyFile
* @description: 拷贝文件
* @author: lizijie
* @update: 
*/
const fs = require('fs');
const throuh2 = require('through2');
const replace = require('./replace');

module.exports = function copyFile(srcPath, tarPath, config, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('finish', ()=>{
        typeof cb == 'function' && cb(0);
    });

    rs.pipe(throuh2(function (chunk, enc, callback) {
        this.push(replace(chunk, config));
    })).pipe(ws)
}