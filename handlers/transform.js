'use strict';

const is = require('is');

module.exports = function($opts) {
    var name = $opts.item,
        callback = $opts.transformer;

    return function($caller, $resolver) {
        var item = $resolver(name),
            resolutions = { item: item };
        resolutions[name] = item;
        item = $caller(callback, null, resolutions);
        $resolver.add(name, item);
    };
};
