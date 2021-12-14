import { AnyAction, Reducer } from 'redux';
import { FluxStandardAction } from './isFSA';
import { ActionMeta } from '.';
interface ReplaceStateAction<S> extends FluxStandardAction<ActionMeta> {
    payload: S;
}
/**
 * Creates an action that will replace the current state with the provided
 * state. The scope is set to local in this creator function to make sure it is
 * never forwarded.
 */
export declare const replaceState: <S>(state: S) => ReplaceStateAction<S>;
export declare const withStoreReplacer: <S, A extends AnyAction>(reducer: Reducer<S, A>) => (state: S | undefined, action: A) => S;
export {};
