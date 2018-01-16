/**
* @name: formatContent
* @description: format content in config file 
* @author: leechikit
* @update: 
*/

const path = require("path");
const exec = require('../lib/exec');
const currDir = process.cwd();

function defaultConfig() {
    return new Promise(async (resolve, reject) => {
        const userName = await exec('git config user.name');
        const userEmail = await exec('git config user.email');
        return resolve({
            author: `${userName.trim()} <${userEmail.trim()}>`
        });
    });
}

module.exports = async function formatContent(content, projectName) {
    let prompts = [];
    let defaultConf = await defaultConfig();
    // console.log(content.replace(/(\w+):/g, '"$1":'))
    let configJson = JSON.parse(content).prompts;
    for (let key in configJson) {
        configJson[key]['name'] = key;
        if (configJson[key]['default'] == void 0) {
            if (configJson[key]['name'] == 'name') {
                configJson[key]['default'] = projectName;
            }
            if (configJson[key]['name'] == 'author') {
                configJson[key]['default'] = defaultConf.author;
            }
        }
        prompts.push(configJson[key]);
    }
    let result = { prompts };

    return result;
}