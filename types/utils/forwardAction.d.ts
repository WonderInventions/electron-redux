import { Store } from 'redux';
import { StateSyncOptions } from '../options/StateSyncOptions';
export declare type ProcessForwarder = (forwarderAction: any, forwarderOptions: StateSyncOptions) => void;
export declare const forwardAction: <S extends Store<any, any>>(store: S, processForwarder: ProcessForwarder, options?: StateSyncOptions) => S;
