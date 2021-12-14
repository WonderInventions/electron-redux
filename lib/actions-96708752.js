'use strict';

var isPlainObject = require('lodash.isplainobject');
var isString = require('lodash.isstring');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var isString__default = /*#__PURE__*/_interopDefaultLegacy(isString);

const isFSA = action => isPlainObject__default['default'](action) && isString__default['default'](action.type) && Object.keys(action).every(isValidKey);

const isValidKey = key => ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;

/**
 * stopForwarding allows you to give it an action, and it will return an
 * equivalent action that will only play in the current process
 */

const stopForwarding = action => Object.assign(Object.assign({}, action), {
  meta: Object.assign(Object.assign({}, action.meta), {
    scope: 'local'
  })
});
/**
 * validateAction ensures that the action meets the right format and isn't scoped locally
 */

const validateAction = (action, // Actions that we should never replay across stores
denyList = [/^@@/, /^redux-form/]) => {
  var _a;

  return isFSA(action) && ((_a = action.meta) === null || _a === void 0 ? void 0 : _a.scope) !== 'local' && denyList.every(rule => !rule.test(action.type));
};

exports.stopForwarding = stopForwarding;
exports.validateAction = validateAction;
