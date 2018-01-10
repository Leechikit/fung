#! /usr/bin/env node

const commander = require('commander');
const command_remote = require('../command/fung-command-remote');
const command_list = require('../command/fung-command-list');
const command_build = require('../command/fung-command-build');
const command_push = require('../command/fung-command-push');

command_remote.register(commander);
command_list.register(commander);
command_build.register(commander);
command_push.register(commander);

commander
    .version('0.1.0')
    .parse(process.argv)
