/**
* @name: formatContent
* @description: 格式化内容
* @author: lizijie
* @update: 
*/

module.exports = function formatContent(content) {
    let result = [];
    let configJson = JSON.parse(content.replace(/(\w+):/g, '"$1":'));

    for (let key in configJson) {
        configJson[key]['name'] = key;
        result.push(configJson[key]);
    }
    return result;
}