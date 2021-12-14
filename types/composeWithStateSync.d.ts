import { StoreEnhancer } from 'redux';
import { ProcessForwarder } from './utils/forwardAction';
import { StateSyncOptions } from './options/StateSyncOptions';
import { StateSyncEnhancer } from './utils/types';
export declare function createComposer(stateSyncEnhancer: StateSyncEnhancer, processForwarder: ProcessForwarder): (firstFuncOrOpts: StoreEnhancer | StateSyncOptions, ...funcs: Array<StoreEnhancer>) => StoreEnhancer;
