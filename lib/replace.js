/**
* @name: replace
* @description: 替换配置项
* @author: lizijie
* @update: 
*/

module.exports = function replace(buffer, config) {
    let content = buffer.toString('utf-8');
    let replaceArrs = content.match(/{{(\w+)}}/g);
    replaceArrs && replaceArrs.length > 0 && replaceArrs.forEach((item)=>{
        content = content.replace(new RegExp(item ,'g'),config[item.replace(/{{(\w+)}}/g, "$1")]);
    });
    return content;
}