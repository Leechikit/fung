/**
* @name: replace
* @description: replace content in the file
* @author: leechikit
* @update: 
*/

module.exports = function replace(buffer, config) {
    const REG = new RegExp(/{{[ ]*(\w+)[ ]*}}/, 'g');
    let content = buffer.toString('utf-8');
    let replaceArrs = content.match(REG);
    replaceArrs && replaceArrs.length > 0 && replaceArrs.forEach((item) => {
        const instead = config[item.replace(REG, "$1")];
        if (instead) {
            content = content.replace(new RegExp(item, 'g'), instead);
        }
    });
    return content;
}