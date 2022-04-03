/// Illuminate Imports.
import { $, DOM } from '../DOM';

/// Theme Utility Namespace.
export namespace Theme {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Base Theme Mode.
    export type Mode = 'light' | 'dark';

    /// Theme Options.
    export interface IOptions {
        preload: boolean;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Base namespace name.
    export const __name__ = 'theme';

    /// Base Illuminate Options.
    export const __options__: IOptions = {
        preload: DOM.html.attr('data-preload-theme') !== 'false'
    };

    /// Preferred Color Scheme.
    const m_prefers: Mode = matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';

    /*****************
     *  INITIALISER  *
     *****************/

    /// Coordinates initialising the base theme.
    export const init = (opts: Partial<IOptions> = {}) => {
        // clone the options
        const base: IOptions = Object.assign({}, __options__, opts);

        // if allowing preloading, then set the current theme
        if (base.preload && cssMode() === 'dynamic') toggle(prefers());
    };

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Toggles the current theme. If given a mode, sets the theme.
     * @param theme                     Theme to set.
     */
    export const toggle = (theme?: Mode) => {
        // assert the current CSS mode
        m_assertMode();

        // get the current mode
        const cur = current();

        // if the new theme is the same, then ignore the request
        if (cur === theme) return;

        // determine the next usable theme
        const next = theme ?? (cur === 'dark' ? 'light' : 'dark');

        // otherwise set the current theme
        DOM.html.attr('data-theme', next);

        // update the internal theme to use
        localStorage.setItem('illuminate:theme', next);
    };

    /// Gets the currently set theme (evident on the "data-theme" attribute).
    export const current = (): Mode => DOM.html.attr<Mode>('data-theme') ?? 'light';

    /// Current preferred theme.
    export const prefers = (): Mode => (localStorage.getItem('illuminate:theme') ?? m_prefers) as Mode;

    /// Gets the current CSS Mode.
    export const cssMode = (): 'dynamic' | 'fixed' =>
        getComputedStyle(DOM.html.element).getPropertyValue('--default-css-mode') as any;

    /*********************
     *  PRIVATE METHODS  *
     *********************/

    /// Asserts the current styling mode.
    const m_assertMode = () => {
        if (cssMode() === 'dynamic') return;
        throw new ReferenceError('CSS mode does not allow for dynamic themes.');
    };
}
