import { StoreEnhancer } from 'redux';
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions';
import { StateSyncOptions } from './options/StateSyncOptions';
/**
 * Creates new instance of renderer process redux enhancer.
 * Upon initialization, it will fetch the state from the main process & subscribe for event
 *  communication required to keep the actions in sync.
 * @param {RendererStateSyncEnhancerOptions} options Additional settings for enhancer
 * @returns StoreEnhancer
 */
export declare const stateSyncEnhancer: (options?: RendererStateSyncEnhancerOptions) => StoreEnhancer;
export declare const composeWithStateSync: (firstFuncOrOpts: StoreEnhancer | StateSyncOptions, ...funcs: StoreEnhancer[]) => StoreEnhancer<{}, {}>;
