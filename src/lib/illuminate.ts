/// Illuminate Imports.
import { $ as _$_impl, DOM as _DOM_impl } from './DOM';
import { __init__ } from './utilities/init';

import { Theme as _Theme_impl } from './utilities/theme';
import { Sidebar as _Sidebar_impl } from './components/sidebar';
import { Forms as _Forms_impl } from './forms';

/// Core Illuminate Namespace.
export namespace Illuminate {
    /****************
     *  RE-EXPORTS  *
     ****************/

    export const $ = _$_impl; // Element Wrapper.
    export const DOM = _DOM_impl; // DOM Namespace.

    export const Theme = _Theme_impl; // Theme Accessor.
    export const Sidebar = _Sidebar_impl; // Sidebar Accessor.
    export const Forms = _Forms_impl; // Forms Accessor.

    /**************
     *  TYPEDEFS  *
     **************/

    /// Initialisation Options.
    export interface IOptions {
        theme: _Theme_impl.IOptions;
        forms: _Forms_impl.IOptions;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Illuminate Preload Flag.
    export const preload = DOM.html.attr('data-preload-illuminate') !== null;

    /// Base Initialistion Options.
    const m_options: IOptions = {
        theme: Theme.__options__,
        forms: Forms.__options__
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
