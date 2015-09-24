'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    handler = require('../handlers/transform');

describe('transform', function() {
    beforeEach(function() {
        this.caller = sinon.spy(reflekt.caller({ foo: 'foo' }));
        this.resolver = sinon.spy(this.caller.resolver);
    });

    it('should resolve the item using the defined item name', function() {
        var h = handler({ item: 'foo', transformer: sinon.spy() });
        h(this.caller, this.resolver);
        this.resolver.called.should.equal(true);
        this.resolver.calledWith('foo').should.equal(true);
    });

    it('should use the defined transformer', function() {
        var called = false;

        function transformer(item) {
            called = true;
        }

        var h = handler({ item: 'foo', transformer: transformer });
        h(this.caller, this.resolver);
        called.should.equal(true);
    });

    it('should add the item to the resolver as `item`', function() {
        var called = false;

        function transformer(item) {
            called = true;
            item.should.equal('foo');
        }

        var h = handler({ item: 'foo', transformer: transformer });
        h(this.caller, this.resolver);
        called.should.equal(true);
    });

    it('should add the item to the resolver as the defined name', function() {
        var called = false;

        function transformer(foo) {
            called = true;
            foo.should.equal('foo');
        }

        var h = handler({ item: 'foo', transformer: transformer });
        h(this.caller, this.resolver);
        called.should.equal(true);
    });

    it('should add the transformed item to the resolver as the defined name', function() {
        var called = false;

        function transformer(item) {
            called = true;
            item.should.equal('foo');
            return 'bar';
        }

        var h = handler({ item: 'foo', transformer: transformer });
        h(this.caller, this.resolver);
        this.resolver('foo').should.equal('bar');
    });
});
