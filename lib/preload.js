'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('lodash.isplainobject');
require('lodash.isstring');
var actions = require('./actions-96708752.js');
var composeWithStateSync$1 = require('./composeWithStateSync-f41b8390.js');
var electron = require('electron');
var misc = require('./misc-0c4ce97a.js');

function fetchInitialState(options) {
  const state = electron.ipcRenderer.sendSync(composeWithStateSync$1.IPCEvents.INIT_STATE);
  return JSON.parse(state, options.deserializer);
}

function fetchInitialStateAsync(options, callback) {
  return composeWithStateSync$1.__awaiter(this, void 0, void 0, function* () {
    // Electron will throw an error if there isn't a handler for the channel.
    // We catch it so that we can throw a more useful error
    try {
      const state = yield electron.ipcRenderer.invoke(composeWithStateSync$1.IPCEvents.INIT_STATE_ASYNC);
      callback(JSON.parse(state, options.deserializer));
    } catch (error) {
      console.warn(error);
      throw new Error('No Redux store found in main process. Did you use the mainStateSyncEnhancer in the MAIN process?');
    }
  });
}

const forwardActionToMain = (action, options = {}) => {
  if (actions.validateAction(action, options.denyList)) {
    electron.ipcRenderer.send(composeWithStateSync$1.IPCEvents.ACTION, action);
  }
};

const subscribeToIPCAction = callback => {
  electron.ipcRenderer.on(composeWithStateSync$1.IPCEvents.ACTION, (_, action) => {
    callback(action);
  });
};

const REPLACE_STATE = 'electron-redux.REPLACE_STATE';
/**
 * Creates an action that will replace the current state with the provided
 * state. The scope is set to local in this creator function to make sure it is
 * never forwarded.
 */

const replaceState = state => ({
  type: REPLACE_STATE,
  payload: state,
  meta: {
    scope: 'local'
  }
});
const withStoreReplacer = reducer => (state, action) => {
  switch (action.type) {
    case REPLACE_STATE:
      return action.payload;

    default:
      return reducer(state, action);
  }
};

const stateSyncEnhancer = (options = {}) => createStore => {
  misc.preventDoubleInitialization();
  return (reducer, state) => {
    const initialState = options.lazyInit ? state : fetchInitialState(options);
    const store = createStore(options.lazyInit ? withStoreReplacer(reducer) : reducer, initialState);

    if (options.lazyInit) {
      fetchInitialStateAsync(options, asyncState => {
        store.dispatch(replaceState(asyncState));
      });
    } // When receiving an action from main


    subscribeToIPCAction(action => store.dispatch(actions.stopForwarding(action)));
    return composeWithStateSync$1.forwardAction(store, forwardActionToMain, options);
  };
};

const composeWithStateSync = (firstFuncOrOpts, ...funcs) => composeWithStateSync$1.createComposer(stateSyncEnhancer, forwardActionToMain)(firstFuncOrOpts, ...funcs);

const preload = () => {
  const bridge = {
    stateSyncEnhancer,
    composeWithStateSync
  };

  try {
    electron.contextBridge.exposeInMainWorld('__ElectronReduxBridge', bridge);
  } catch (_a) {
    window.__ElectronReduxBridge = bridge;
  }
}; // run it!

preload();

exports.preload = preload;
