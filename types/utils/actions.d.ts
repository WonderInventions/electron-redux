import { FluxStandardAction } from './isFSA';
export declare type ActionMeta = {
    scope?: 'local' | string;
};
/**
 * stopForwarding allows you to give it an action, and it will return an
 * equivalent action that will only play in the current process
 */
export declare const stopForwarding: (action: FluxStandardAction<ActionMeta>) => any;
/**
 * validateAction ensures that the action meets the right format and isn't scoped locally
 */
export declare const validateAction: (action: any, denyList?: RegExp[]) => action is FluxStandardAction<ActionMeta>;
