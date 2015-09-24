'use strict';

var should = require('should'),
    sinon = require('sinon'),
    handler = require('../handlers/terminate');

describe('terminate', function() {
    it('should call $finish', function() {
        var spy = sinon.spy(),
            h = handler()(spy);
        spy.called.should.equal(true);
    });
});
