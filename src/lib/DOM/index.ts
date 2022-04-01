/// DOM Imports.
import { $ } from './wrapper';

/// DOM Re-Exports.
export { $ } from './wrapper';

/// DOM Base Namespace.
export namespace DOM {
    /****************
     *  PROPERTIES  *
     ****************/

    /// HTML Element Wrapper.
    export const html = $(document.documentElement);
}
