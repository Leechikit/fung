/**
* @name: replace
* @description: replace content in the file
* @author: leechikit
* @update: 
*/

const Handlebars = require('handlebars');

module.exports = function replace(buffer, config) {
    let content = buffer.toString('utf-8');
    const compiled = Handlebars.compile(content);
    try {
        content = compiled(config);
    } catch (error) {

    }
    return content;
}