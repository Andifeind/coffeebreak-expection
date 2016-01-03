'use strict';

var test = function(obj) {
    var expect = new CoffeeBreakExpection(obj);
    return expect;
};

var isObject = function isObject(obj) {
    return (typeof obj === 'object' && obj !== null && !Array.isArray(obj));
};

var isArray = function isObject(obj) {
    return (typeof obj === 'object' && obj !== null && Array.isArray(obj));
};

var isNull = function isObject(obj) {
    return obj === null;
};

var isUndefined = function isObject(obj) {
    return obj === undefined;
};

var compareArrays = function compareArrays(a, b, keyPrefix) {
    var err = [];

    keyPrefix = keyPrefix || '';

    var len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
        var itemA = a[i];
        var itemB = b[i];

        if (isObject(itemA)) {
            itemA = JSON.stringify(itemA, null, '  ');
        }

        if (isObject(itemB)) {
            itemB = JSON.stringify(itemB, null, '  ');
        }

        if (itemA !== itemB) {
            err.push('Array items with index ' + i + ' not equal!\n  ' + itemA + ' should be\n  ' + itemB + '\n');
        }
    }

    return err.length === 0 ? false : err;
};

var compareRightToLeft = function compareRightToLeft(a, b, keyPrefix) {
    var err = [];

    keyPrefix = keyPrefix || '';

    for (var key in b) {
        var subRes;

        if (b.hasOwnProperty(key)) {
            var prop = b[key];
            if (!(key in a)) {
                err.push('Key ' + keyPrefix + key + ' does not exists!');
                continue;
            }

            if (isObject(prop)) {
                subRes = compareRightToLeft(a[key], prop, key + '.');
                if (subRes) {
                    err = err.concat(subRes);
                }

                continue;
            }

            if (isArray(prop)) {
                subRes = compareArrays(a[key], prop, key + '.');
                if (subRes) {
                    err.push('Properties ' + key + ' aren\'t equal!\n' + subRes.join());
                }

                continue;   
            }

            if (a[key] !== prop) {
                err.push('Properties ' + key + ' aren\'t equal!\n  ' + a[key] + ' should be\n  ' + prop + '\n');
            }
        }
    }

    return err.length === 0 ? false : err;
};

var CoffeeBreakExpection = function CoffeeBreakExpection(obj) {
    this.testObj = obj;
};

CoffeeBreakExpection.prototype.toHaveProps = function(props) {
    var err = compareRightToLeft(this.testObj, props);
    if (err) {
        throw new Error('Object should have properties expection failed!\n' + err);
    }
    
};


module.exports = test;