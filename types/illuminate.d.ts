import { Theme as _Theme_impl } from './utilities/theme';
export declare namespace Illuminate {
    const Theme: typeof _Theme_impl;
    interface IOptions {
        theme: _Theme_impl.IOptions;
    }
    const preload: boolean;
    const init: (opts?: Partial<IOptions>) => void;
}
