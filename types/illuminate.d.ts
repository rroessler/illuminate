import { DOM as _DOM_impl } from './DOM';
import { Theme as _Theme_impl } from './utilities/theme';
import { Sidebar as _Sidebar_impl } from './components/sidebar';
export declare namespace Illuminate {
    const $: import("./DOM/wrapper").I$;
    const DOM: typeof _DOM_impl;
    const Theme: typeof _Theme_impl;
    const Sidebar: typeof _Sidebar_impl;
    interface IOptions {
        theme: _Theme_impl.IOptions;
    }
    const preload: boolean;
    const init: (opts?: Partial<IOptions>) => void;
}
