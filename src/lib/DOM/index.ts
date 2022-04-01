/// DOM Imports.
import { Nullable } from '../utilities/nullable';
import { $, Wrapper } from './wrapper';

/// DOM Re-Exports.
export { $ } from './wrapper';

/// DOM Base Namespace.
export namespace DOM {
    /****************
     *  PROPERTIES  *
     ****************/

    /// HTML Element Wrapper.
    export const html = $(document.documentElement);

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
DOM.onload(() => (DOM.body = $(document.body)));
