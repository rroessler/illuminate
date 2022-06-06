/// Illuminate Imports.
import { $_ as _$_impl, DOM as _DOM_impl } from './DOM';
import { __init__ } from './utilities/init';
import * as _Utils_impl from './utilities';

import { Forms as _Forms_impl } from './forms';
import { Theme as _Theme_impl } from './user/theme';
import { User as _User_impl } from './user';

import { Alerts as _Alerts_impl } from './components/alerts';
import { Modal as _Modal_impl } from './components/modals';
import { Sidebar as _Sidebar_impl } from './components/sidebar';

/// Core Illuminate Namespace.
export namespace Illuminate {
    /****************
     *  RE-EXPORTS  *
     ****************/

    export const $_ = _$_impl; // Element Wrapper.
    export const DOM = _DOM_impl; // DOM Namespace.
    export const Utils = _Utils_impl; /// Utitlities.

    export const Forms = _Forms_impl; // Forms Namespace.
    export const Theme = _Theme_impl; // Theme Namespace.
    export const User = _User_impl; // User Namespace.

    export const Alerts = _Alerts_impl; // Alerts Namespace.
    export const Modal = _Modal_impl; // Modals Namespace.
    export const Sidebar = _Sidebar_impl; // Sidebar Namespace.

    /**************
     *  TYPEDEFS  *
     **************/

    /// Initialisation Options.
    export interface IOptions {
        forms: _Forms_impl.IOptions;
        theme: _Theme_impl.IOptions;

        alerts: _Alerts_impl.IOptions;
        modals: _Modal_impl.IOptions;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Illuminate Preload Flag.
    export const preload = DOM.html.attr('data-preload-illuminate') !== null;

    /// Base Initialistion Options.
    const m_options: IOptions = {
        forms: Forms.__options__,
        theme: Theme.__options__,
        alerts: Alerts.__options__,
        modals: Modal.__options__,
    };

    /// Initialisation details.
    let m_initialised = false;

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Coordinates initialising Illuminate.
     * @param opts                  Options to use.
     */
    export const init = (opts: Partial<IOptions> = {}) => {
        // declare as initialised
        m_initialised = true;

        // run the initialisation loader
        __init__.load(Object.assign({}, m_options, opts));
    };
}
