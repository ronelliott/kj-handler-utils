'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    handler = require('../handlers/conditional');

describe('conditional', function() {
    beforeEach(function() {
        this.resolutions = {
            'true': true,
            'false': false,
            h1: sinon.spy(),
            h2: sinon.spy(),
            h3: sinon.spy()
        };

        this.resolver = sinon.spy(new reflekt.ObjectResolver(this.resolutions));
        this.caller = sinon.spy(reflekt.caller(this.resolver));

        this.app = {
            process: sinon.spy(function(handler, caller, req, res, callback) {
                callback();
            })
        };
    });

    it('should call the function if the condition is a function', function(done) {
        var spy = sinon.spy();
        handler({ if: { condition: spy, handler: 'h1' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                spy.called.should.equal(true);
                done(err);
            });
    });

    it('should resolve the item if the condition is a string', function(done) {
        var self = this;
        handler({ if: { condition: 'true', handler: 'h1' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.resolver.called.should.equal(true);
                done(err);
            });
    });

    it('should call process on the if handler if the condition is truthy', function(done) {
        var self = this;
        handler({ if: { condition: 'true', handler: 'h1' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                done(err);
            });
    });

    it('should not call process on the if handler if the condition is falsy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(false);
                done(err);
            });
    });

    it('should call process on the else handler if the condition is falsy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' }, else: { handler: 'h2' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h2').should.equal(true);
                done(err);
            });
    });

    it('should not call process on the else handler if the condition is truthy', function(done) {
        var self = this;
        handler({ if: { condition: 'true', handler: 'h1' }, else: { handler: 'h2' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h1').should.equal(true);
                done(err);
            });
    });

    it('should call process on the elseif handler if the condition is truthy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' }, elseif: { condition: 'true', handler: 'h2' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h2').should.equal(true);
                done(err);
            });
    });

    it('should not call process on the elseif handler if the condition is falsy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' }, elseif: { condition: 'false',  handler: 'h2' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(false);
                done(err);
            });
    });

    it('should not call process on the elseif handler if the if condition is truthy', function(done) {
        var self = this;
        handler({ if: { condition: 'true', handler: 'h1' }, elseif: { condition: 'true', handler: 'h2' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h1').should.equal(true);
                done(err);
            });
    });

    it('should not call process on the else handler if the elseif condition is truthy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' }, elseif: { condition: 'true', handler: 'h2' }, else: { handler: 'h3' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h2').should.equal(true);
                done(err);
            });
    });

    it('should call process on the else handler if the if and elseif condition is falsy', function(done) {
        var self = this;
        handler({ if: { condition: 'false', handler: 'h1' }, elseif: { condition: 'false', handler: 'h2' }, else: { handler: 'h3' } }, this.app)(
            this.caller, this.req, this.res, function(err) {
                self.app.process.called.should.equal(true);
                self.app.process.calledWith('h3').should.equal(true);
                done(err);
            });
    });
});
