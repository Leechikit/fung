/**
* @name: formatConfig
* @description: format config file
* @author: leechikit
* @update: 
*/

const fs = require('fs');
const path = require('path');
const formatContent = require('../lib/format-content.js');

module.exports = async function formatConfig(tarPath, projectName) {
    let configPath = path.join(tarPath, './fung-config.json');
    let result = [];

    if (fs.existsSync(configPath)) {
        let content = fs.readFileSync(configPath, 'utf8');
        result = await formatContent(content, projectName);
    }
    return result;
}