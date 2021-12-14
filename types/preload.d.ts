import { StoreEnhancer } from 'redux';
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions';
import { StateSyncOptions } from './options/StateSyncOptions';
declare global {
    interface Bridge {
        stateSyncEnhancer: typeof stateSyncEnhancer;
        composeWithStateSync: typeof composeWithStateSync;
    }
    interface Window {
        __ElectronReduxBridge: Bridge;
    }
    const __ElectronReduxBridge: Bridge;
}
declare const stateSyncEnhancer: (options?: RendererStateSyncEnhancerOptions) => StoreEnhancer;
declare const composeWithStateSync: (firstFuncOrOpts: StoreEnhancer | StateSyncOptions, ...funcs: StoreEnhancer[]) => StoreEnhancer<{}, {}>;
export declare const preload: () => void;
export {};
