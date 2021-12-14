import { StoreEnhancer } from 'redux';
import { MainStateSyncEnhancerOptions } from './options/MainStateSyncEnhancerOptions';
import { StateSyncOptions } from './options/StateSyncOptions';
/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */
export declare const stateSyncEnhancer: (options?: MainStateSyncEnhancerOptions) => StoreEnhancer;
export declare const composeWithStateSync: (firstFuncOrOpts: StoreEnhancer | StateSyncOptions, ...funcs: StoreEnhancer[]) => StoreEnhancer;
