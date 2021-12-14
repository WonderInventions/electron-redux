import 'lodash.isplainobject';
import 'lodash.isstring';
import { v as validateAction, s as stopForwarding } from './actions-49983f75.js';
import { I as IPCEvents, _ as __awaiter, f as forwardAction, c as createComposer } from './composeWithStateSync-46d2fb69.js';
import { ipcRenderer, contextBridge } from 'electron';
import { p as preventDoubleInitialization } from './misc-f1d565fd.js';

function fetchInitialState(options) {
  const state = ipcRenderer.sendSync(IPCEvents.INIT_STATE);
  return JSON.parse(state, options.deserializer);
}

function fetchInitialStateAsync(options, callback) {
  return __awaiter(this, void 0, void 0, function* () {
    // Electron will throw an error if there isn't a handler for the channel.
    // We catch it so that we can throw a more useful error
    try {
      const state = yield ipcRenderer.invoke(IPCEvents.INIT_STATE_ASYNC);
      callback(JSON.parse(state, options.deserializer));
    } catch (error) {
      console.warn(error);
      throw new Error('No Redux store found in main process. Did you use the mainStateSyncEnhancer in the MAIN process?');
    }
  });
}

const forwardActionToMain = (action, options = {}) => {
  if (validateAction(action, options.denyList)) {
    ipcRenderer.send(IPCEvents.ACTION, action);
  }
};

const subscribeToIPCAction = callback => {
  ipcRenderer.on(IPCEvents.ACTION, (_, action) => {
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
  preventDoubleInitialization();
  return (reducer, state) => {
    const initialState = options.lazyInit ? state : fetchInitialState(options);
    const store = createStore(options.lazyInit ? withStoreReplacer(reducer) : reducer, initialState);

    if (options.lazyInit) {
      fetchInitialStateAsync(options, asyncState => {
        store.dispatch(replaceState(asyncState));
      });
    } // When receiving an action from main


    subscribeToIPCAction(action => store.dispatch(stopForwarding(action)));
    return forwardAction(store, forwardActionToMain, options);
  };
};

const composeWithStateSync = (firstFuncOrOpts, ...funcs) => createComposer(stateSyncEnhancer, forwardActionToMain)(firstFuncOrOpts, ...funcs);

const preload = () => {
  const bridge = {
    stateSyncEnhancer,
    composeWithStateSync
  };

  try {
    contextBridge.exposeInMainWorld('__ElectronReduxBridge', bridge);
  } catch (_a) {
    window.__ElectronReduxBridge = bridge;
  }
}; // run it!

preload();

export { preload };
