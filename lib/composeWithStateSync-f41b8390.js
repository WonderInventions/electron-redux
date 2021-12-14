'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

(function (IPCEvents) {
  IPCEvents["INIT_STATE"] = "electron-redux.INIT_STATE";
  IPCEvents["INIT_STATE_ASYNC"] = "electron-redux.INIT_STATE_ASYNC";
  IPCEvents["ACTION"] = "electron-redux.ACTION";
})(exports.IPCEvents || (exports.IPCEvents = {}));

const forwardAction = (store, processForwarder, options = {}) => {
  return Object.assign(Object.assign({}, store), {
    dispatch: action => {
      const value = store.dispatch(action);

      if (!(options === null || options === void 0 ? void 0 : options.preventActionReplay)) {
        processForwarder(action, options);
      }

      return value;
    }
  });
};

/* eslint-disable @typescript-eslint/ban-types */

const forwardActionEnhancer = (processForwarder, options) => createStore => (reducer, preloadedState) => {
  const store = createStore(reducer, preloadedState);
  return forwardAction(store, processForwarder, options);
};

const extensionCompose = (stateSyncEnhancer, processForwarder, options) => (...funcs) => {
  return createStore => {
    return [stateSyncEnhancer(Object.assign(Object.assign({}, options), {
      preventActionReplay: true
    })), ...funcs, forwardActionEnhancer(processForwarder, options)].reduceRight((composed, f) => f(composed), createStore);
  };
};

function createComposer(stateSyncEnhancer, processForwarder) {
  return function composeWithStateSync(firstFuncOrOpts, ...funcs) {
    if (arguments.length === 0) {
      return stateSyncEnhancer({});
    }

    if (arguments.length === 1 && typeof firstFuncOrOpts === 'object') {
      return extensionCompose(stateSyncEnhancer, processForwarder, firstFuncOrOpts)();
    }

    return extensionCompose(stateSyncEnhancer, processForwarder, {})(firstFuncOrOpts, ...funcs);
  };
}

exports.__awaiter = __awaiter;
exports.createComposer = createComposer;
exports.forwardAction = forwardAction;
