const _ = require('lodash');
const path = require("path");
const fs = require('fs');
const exec = require('../lib/exec');
const log = require('../lib/log');
const emptyDirectory = require('../lib/empty-directory');
const gitDir = path.resolve(__dirname, '../git');
const repertoryFile = path.resolve(__dirname, '../config/repertory');
const ora = require('ora');
const spinner = ora();

exports.register = function (commander) {
    commander
        .command('remote [repertory]')
        .description('define a remote repertory')
        .action(option => {
            spinner.start('saving a remote repertory');
            if(!fs.existsSync(gitDir)){
                fs.mkdirSync(gitDir);
            }
            emptyDirectory(gitDir);
            
            // save repertory url
            fs.writeFile(repertoryFile, new Buffer(option), async (err) => {
                if (err) {
                    log.error(err);
                } else {
                    await exec(`git clone ${option} ${gitDir}`);
                    spinner.succeed('success to define a remote repertory');
                }
            });
        })
}