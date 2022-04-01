/// Illuminate Imports.
import { $, DOM } from '../DOM';
import { Wrapper } from '../DOM/wrapper';
import { Nullable } from '../utilities/nullable';

/// Base Page Wrapper.
let $page: Wrapper<HTMLElement> = Nullable;

/// Illuminate Page Namespace.
export namespace Page {
    /****************
     *  PROPERTIES  *
     ****************/

    /// Gets the page element.
    export const element = () => $page;

    /********************
     *  PUBLIC METHODS  *
     ********************/
}

/// Retrieve the base page wrapper.
DOM.onload(() => ($page = $('.page-wrapper', false)));
