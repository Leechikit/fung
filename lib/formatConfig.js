/**
* @name: formatConfig
* @description: 格式化配置文件
* @author: lizijie
* @update: 
*/

const fs = require('fs');
const path = require('path');

module.exports = function formatConfig(tarPath){
    const configPath = path.join(tarPath,'./fung-config.js');
    let result = [];
    if (fs.existsSync(configPath)) {
        let content = fs.readFileSync(configPath, 'utf8');
        let configJson = JSON.parse(content.replace(/(\w+):/g, '"$1":'));
        
        for(let key in configJson){
            configJson[key]['name'] = key;
            result.push(configJson[key]);
        }
    }
    return result;
}