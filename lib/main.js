'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('lodash.isplainobject');
require('lodash.isstring');
var actions = require('./actions-96708752.js');
var composeWithStateSync$1 = require('./composeWithStateSync-f41b8390.js');
var electron = require('electron');
var misc = require('./misc-0c4ce97a.js');

const forwardActionToRenderers = (action, options = {}) => {
  if (actions.validateAction(action, options.denyList)) {
    electron.webContents.getAllWebContents().forEach(contents => {
      // Ignore chromium devtools
      if (contents.getURL().startsWith('devtools://')) return;
      contents.send(composeWithStateSync$1.IPCEvents.ACTION, action);
    });
  }
};

/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */

const stateSyncEnhancer = (options = {}) => createStore => {
  misc.preventDoubleInitialization();
  return (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    electron.ipcMain.handle(composeWithStateSync$1.IPCEvents.INIT_STATE_ASYNC, () => composeWithStateSync$1.__awaiter(void 0, void 0, void 0, function* () {
      return JSON.stringify(store.getState(), options.serializer);
    }));
    electron.ipcMain.on(composeWithStateSync$1.IPCEvents.INIT_STATE, event => {
      event.returnValue = JSON.stringify(store.getState(), options.serializer);
    }); // When receiving an action from a renderer

    electron.ipcMain.on(composeWithStateSync$1.IPCEvents.ACTION, (event, action) => {
      const localAction = actions.stopForwarding(action);
      store.dispatch(localAction); // Forward it to all of the other renderers

      electron.webContents.getAllWebContents().forEach(contents => {
        // Ignore the renderer that sent the action and chromium devtools
        if (contents.id !== event.sender.id && !contents.getURL().startsWith('devtools://')) {
          contents.send(composeWithStateSync$1.IPCEvents.ACTION, localAction);
        }
      });
    });
    return composeWithStateSync$1.forwardAction(store, forwardActionToRenderers, options);
  };
}; // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

const composeWithStateSync = (firstFuncOrOpts, ...funcs) => composeWithStateSync$1.createComposer(stateSyncEnhancer, forwardActionToRenderers)(firstFuncOrOpts, ...funcs);

exports.composeWithStateSync = composeWithStateSync;
exports.stateSyncEnhancer = stateSyncEnhancer;
