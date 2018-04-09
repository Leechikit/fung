/**
* @name: template
* @description: 模板编译
* @author: lizijie
* @update: 
模板解析流程：
1. 将模板中的特殊符号转换为字符串
2. 解析escape形式标签，将内容解析为HTML实体
3. 解析evaluate形式标签，创建可执行的JavaScript代码
4. 生成处理函数，该函数在得到数据后可直接填充到模板并返回填充后的字符串
5. 根据参数返回填充后的字符串或处理函数的句柄
*/

const _ = require('lodash');
// 需要将HTML输出为字符串(将特殊符号转换为字符串形式)的界定符
// 定义模板的界定符号，在template方法中使用
const settings = {
    evaluate: /<%([\s\S]+?)%>/g,// js可执行代码的界定符
    escape: /{{([^{][\s\S]+?[^}])}}|$/g // 需要将HTML输出为字符串(将特殊符号转换为字符串形式)的界定符
};
const escape = /{{([^{][\s\S]+?[^}])}}|$/g;
// escapes对象记录了需要进行相互换转的特殊符号与字符串形式的对应关系，在两者进行相互转换时作为索引使用
const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
// 定义模板中需要替换的特殊符号，包含反斜杠, 单引号, 回车符, 换行符, 制表符, 行分隔符, 段落分隔符
// 在将字符串中的特殊符号转换为字符串形式时使用
const escaper = /\\|'|\r|\n|\u2028|\u2029/g;
const escapeChar = function (match) {
    // 将特殊符号转义为字符串形式,否则会直接起作用
    return '\\' + escapes[match];
};
var noMatch = /(.)^/;
var matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.evaluate || noMatch).source
].join('|') + '|$', 'g');

module.exports = function template(text) {
    let index = 0;
    let source = "__p+='";
    text.replace(matcher, (match, escape, evaluate, offset) => {
        // 将匹配字符串之前的字符串保存起来 注意做了字符串转义处理
        source += text.slice(index, offset).replace(escaper, escapeChar);
        // 更新index，继续处理后续的
        index = offset + match.length;
        if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
    });
    source += "';\n";//换行
    // source = 'with(obj||{}){\n' + source + '}\n';
    // source = "var __t,__p='',__j=Array.prototype.join," +
    //     "print=function(){__p+=__j.call(arguments,'');};\n" +
    //     source + 'return __p;\n';
    source = `
        var __t;
        var __p = '';
        with(obj||{}){
            ${source}
        }
        return __p;
    `
    try {
        /*
          用new Function解析，创建一个函数，将源码作为函数执行体，将obj和Underscore作为参数传递给该函数
          function anonymous(obj, _ ,) {}
          如果设置variable，则直接传variable
         */
        var render = new Function('obj', '_', source);
        console.log(source);
    } catch (e) {
        e.source = source;
        throw e;
    }
    var template = function (data) {
        return render.call(this, data, _);
    };
    // 将创建的源码字符串添加到函数对象中，一般用于调试和测试
    var argument = 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';
    return template;
}