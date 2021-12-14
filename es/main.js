import 'lodash.isplainobject';
import 'lodash.isstring';
import { v as validateAction, s as stopForwarding } from './actions-49983f75.js';
import { I as IPCEvents, _ as __awaiter, f as forwardAction, c as createComposer } from './composeWithStateSync-46d2fb69.js';
import { webContents, ipcMain } from 'electron';
import { p as preventDoubleInitialization } from './misc-f1d565fd.js';

const forwardActionToRenderers = (action, options = {}) => {
  if (validateAction(action, options.denyList)) {
    webContents.getAllWebContents().forEach(contents => {
      // Ignore chromium devtools
      if (contents.getURL().startsWith('devtools://')) return;
      contents.send(IPCEvents.ACTION, action);
    });
  }
};

/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */

const stateSyncEnhancer = (options = {}) => createStore => {
  preventDoubleInitialization();
  return (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    ipcMain.handle(IPCEvents.INIT_STATE_ASYNC, () => __awaiter(void 0, void 0, void 0, function* () {
      return JSON.stringify(store.getState(), options.serializer);
    }));
    ipcMain.on(IPCEvents.INIT_STATE, event => {
      event.returnValue = JSON.stringify(store.getState(), options.serializer);
    }); // When receiving an action from a renderer

    ipcMain.on(IPCEvents.ACTION, (event, action) => {
      const localAction = stopForwarding(action);
      store.dispatch(localAction); // Forward it to all of the other renderers

      webContents.getAllWebContents().forEach(contents => {
        // Ignore the renderer that sent the action and chromium devtools
        if (contents.id !== event.sender.id && !contents.getURL().startsWith('devtools://')) {
          contents.send(IPCEvents.ACTION, localAction);
        }
      });
    });
    return forwardAction(store, forwardActionToRenderers, options);
  };
}; // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

const composeWithStateSync = (firstFuncOrOpts, ...funcs) => createComposer(stateSyncEnhancer, forwardActionToRenderers)(firstFuncOrOpts, ...funcs);

export { composeWithStateSync, stateSyncEnhancer };
