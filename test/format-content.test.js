const formatContent = require('../lib/format-content.js');
const expect = require('chai').expect;
const obj = {
    prompts: {
        project: {
            type: "input",
            message: "请输入项目名："
        },
        system: {
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
        },
        author: {
            type: "input",
            message: "请输入开发者：",
            default: "lizijie"
        }
    },
    completeMessage: "To get started:\n\n  npm install\n  npm start"
};
const content = JSON.stringify(obj);

describe('test format content function', function () {
    it('normal situation', function () {
        formatContent(content).then(result => {
            expect(result.prompts).to.be.an('array');
            expect(result.prompts).to.deep.include({
                message: '请输入项目名：',
                name: 'project',
                type: 'input'
            });
        });
    });

    it('choices situation', function () {
        formatContent(content).then(result => {
            expect(result.prompts).to.be.an('array');
            expect(result.prompts).to.deep.include({
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
});