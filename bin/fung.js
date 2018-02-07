#! /usr/bin/env node

const commander = require('commander');
const command_remote = require('../command/fung-command-remote');
const command_list = require('../command/fung-command-list');
const command_build = require('../command/fung-command-build');
const log = require('../lib/log');

command_remote.register(commander);
command_list.register(commander);
command_build.register(commander);

commander
    .version('0.1.4')
    .parse(process.argv);

process.on('unhandledRejection', err => {
    log.error(err);
    process.exit();
});
