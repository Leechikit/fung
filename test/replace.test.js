const replace = require('../lib/replace.js');
const expect = require('chai').expect;
const config = {
    food: true,
    apple: 1,
    orange: 2
}

describe('test replace function', function () {
    it('normal situation', function () {
        const template = '<div>{{apple}}</div>';
        expect(replace(template, config)).to.be.equal('<div>1</div>');
    });

    it('multiple different replace situation', function () {
        const template = 
        `<div>{{apple}}</div>
        <div>{{orange}}</div>`;
        expect(replace(template, config)).to.be.equal(
        `<div>1</div>
        <div>2</div>`);
    });

    it('multiple same replace situation', function () {
        const template = 
        `<div>{{apple}}</div>
        <div>{{apple}}{{apple}}</div>
        <div>{{apple}}{{apple}}{{apple}}</div>`;
        expect(replace(template, config)).to.be.equal(
        `<div>1</div>
        <div>11</div>
        <div>111</div>`);
    });

    it('not standard template situation', function () {
        const template = '<div>{{ apple      }}</div>';
        expect(replace(template, config)).to.be.equal('<div>1</div>');
    });

    it('template is not match with config', function(){
        const template = '<div>{{sheep}}</div>';
        expect(replace(template, config)).to.be.equal('<div></div>');
    });

    it('conditional operator', function(){
        const template = `<div>{{#food}}1111{{else}}2222{{/food}}</div>`;
        expect(replace(template, config)).to.be.equal('<div>1111</div>');
    });
});