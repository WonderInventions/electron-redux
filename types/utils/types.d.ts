import { StoreEnhancer } from 'redux';
import { StateSyncOptions } from '../options/StateSyncOptions';
export declare type StateSyncEnhancer = (options: StateSyncOptions) => StoreEnhancer;
