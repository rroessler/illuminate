import { DOM as _DOM_impl } from './DOM';
import { Forms as _Forms_impl } from './forms';
import { Sidebar as _Sidebar_impl } from './components/sidebar';
import { Alerts as _Alerts_impl } from './components/alerts';
import { Theme as _Theme_impl } from './user/theme';
import { User as _User_impl } from './user';
export declare namespace Illuminate {
    const $_: import("./DOM/wrapper").I$_;
    const DOM: typeof _DOM_impl;
    const Forms: typeof _Forms_impl;
    const Sidebar: typeof _Sidebar_impl;
    const Alerts: typeof _Alerts_impl;
    const Theme: typeof _Theme_impl;
    const User: typeof _User_impl;
    interface IOptions {
        forms: _Forms_impl.IOptions;
        theme: _Theme_impl.IOptions;
    }
    const preload: boolean;
    const init: (opts?: Partial<IOptions>) => void;
}
