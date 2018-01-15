const _ = require('lodash');
const path = require("path");
const fs = require('fs');
const exec = require('../lib/exec');
const log = require('../lib/log');
const emptyDirectory = require('../lib/empty-directory');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');

exports.register = function (commander) {
    commander
        .command('remote [repertory]')
        .description('define a remote repertory')
        .action(option => {
            if(!fs.existsSync(gitDir)){
                fs.mkdirSync(gitDir);
            }
            emptyDirectory(gitDir);
            
            // save repertory url
            fs.writeFile(repertoryFile, new Buffer(option), (err) => {
                if (err) {
                    log.error(err);
                } else {
                    log.green('success to define a remote repertory');
                }
            });
            exec(`git clone ${option} ${gitDir}`);
            
        })
}