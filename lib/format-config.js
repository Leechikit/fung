/**
* @name: formatConfig
* @description: 格式化配置文件
* @author: lizijie
* @update: 
*/

const fs = require('fs');
const path = require('path');
const formatContent = require('../lib/format-content.js');

module.exports = function formatConfig(tarPath) {
    const configPath = path.join(tarPath, './fung-config.js');
    let result = [];
    
    if (fs.existsSync(configPath)) {
        let content = fs.readFileSync(configPath, 'utf8');
        result = formatContent(content);
    }
    return result;
}