#! /usr/bin/env node

const commander = require('commander');
const command_remote = require('../lib/fung-command-remote');
const command_list = require('../lib/fung-command-list');
const command_build = require('../lib/fung-command-build');

command_remote.register(commander);
command_list.register(commander);
command_build.register(commander);
commander.parse(process.argv)
