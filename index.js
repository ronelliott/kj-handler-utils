'use strict';

module.exports = function($$resolver) {
    $$resolver.add({
        $conditional: require('./handlers/conditional'),
        $terminate: require('./handlers/terminate'),
        $transform: require('./handlers/transform')
    });
};
