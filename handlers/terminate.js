'use strict';

module.exports = function() {
    return function($finish) {
        $finish();
    };
};
