/// Illuminate Imports.
import { DOM } from './DOM';
import { __init__ } from './utilities/init';
import { Theme as _Theme_impl } from './utilities/theme';

/// Core Illuminate Namespace.
export namespace Illuminate {
    /****************
     *  RE-EXPORTS  *
     ****************/

    // Theme Interface.
    export const Theme = _Theme_impl;

    /**************
     *  TYPEDEFS  *
     **************/

    /// Initialisation Options.
    export interface IOptions {
        theme: _Theme_impl.IOptions;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Illuminate Preload Flag.
    export const preload = DOM.html.attr('data-preload-illuminate') !== null;

    /// Base Initialistion Options.
    const m_options: IOptions = { theme: _Theme_impl.__options__ };

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
