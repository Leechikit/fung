/**
* @name: replace
* @description: replace content in the file
* @author: leechikit
* @update: 
*/

const compile = require('lodash.template');
// const template = require('./template');
const compileOptions = {
  escape: /{{([^{][\s\S]+?[^}])}}/g,
  interpolate: /{{{([\s\S]+?)}}}/g
}

module.exports = function replace(buffer, config) {
    let content = buffer.toString('utf-8');
    const compiled = compile(content,compileOptions);
    // const compiled = template(content);
    try {
        content = compiled(config);
    } catch (error) {

    }
    return content;
}