const formatContent = require('../lib/format-content.js');
const expect = require('chai').expect;
const content = `{
    project: {
        type: "input",
        message: "请输入项目名："
    },
    system: {
        type: "list",
        message:"请选择项目类型：",        
        choices: [
            {
                name: "mobile",
                value: "mobile"
            },
            {
                name: "pc",
                value: "pc"
            }
        ]
    },
    author:{
        type: "input",
        message:"请输入开发者：",
        default: "lizijie"
    }
}`;

describe('test format content function', function () {
    it('normal situation', function () {
        expect(formatContent(content)).to.be.an('array');
        expect(formatContent(content)).to.deep.include({
            message: '请输入项目名：',
            name: 'project',
            type: 'input'
        });
    });

    it('choices situation', function () {
        expect(formatContent(content)).to.be.an('array');
        expect(formatContent(content)).to.deep.include({
            name: 'system',
            type: "list",
            message: "请选择项目类型：",
            choices: [
                {
                    name: "mobile",
                    value: "mobile"
                },
                {
                    name: "pc",
                    value: "pc"
                }
            ]
        });
    });
});