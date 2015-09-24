'use strict';

var async = require('async'),
    is = require('is');

module.exports = function($opts, $$app) {
    return function($caller, $req, $res, $next) {
        function doCallback(err) {
            $next(err && err.handled ? null : err);
        }

        function process($opts, callback) {
            var condition = $opts.condition,
                result;

            if (is.string(condition)) {
                condition = $caller.resolver(condition);
            }

            result = condition;

            if (is.function(condition)) {
                result = $caller(condition);
            }

            if (result) {
                $$app.process($opts.handler, $caller, $req, $res, function(err) {
                    callback(err || { handled: true });
                });
            } else {
                callback();
            }
        }

        function handleIf(next) {
            if (!$opts.if) {
                next();
                return;
            }

            process($opts.if, next);
        }

        function handleElseIfs(next) {
            if (!($opts.if && $opts.elseif)) {
                next();
                return;
            }

            if (is.array($opts.elseif)) {
                async.eachSeries($opts.elseif, process, next);
                return;
            }

            if (is.object($opts.elseif)) {
                process($opts.elseif, next);
                return;
            }

            next();
        }

        function handleElse(next) {
            if (!($opts.if && $opts.else)) {
                next();
                return;
            }

            $$app.process($opts.else.handler, $caller, $req, $res, function(err) {
                next(err || { handled: true });
            });
        }

        async.series([
            handleIf,
            handleElseIfs,
            handleElse
        ], doCallback);
    };
};
