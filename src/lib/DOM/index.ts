/// DOM Imports.
import { Nullable } from '../utilities/nullable';
import { $_, Wrapper } from './wrapper';

/// DOM Re-Exports.
export { $_ } from './wrapper';

/// DOM Base Namespace.
export namespace DOM {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Any HTMLElement Casts. */
    export type Any = string | HTMLElement | Wrapper<HTMLElement>;

    /****************
     *  PROPERTIES  *
     ****************/

    /// HTML Element Wrapper.
    export const html = $_(document.documentElement);

    /// Body Element Wrapper.
    export let body: Wrapper<HTMLElement> = Nullable;

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Handler for attaching callbacks when DOM is loaded.
     * @param cb                    Callback to attach.
     */
    export const onload = (cb: () => void) => document.addEventListener('DOMContentLoaded', cb);
}

/// Ensure "body" element is loaded.
DOM.onload(() => (DOM.body = $_(document.body)));
