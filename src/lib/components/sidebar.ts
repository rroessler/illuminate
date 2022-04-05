/// Illuminate Imports.
import { Page } from './page';

/// Sidebar Namespace.
export namespace Sidebar {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Sidebar State Type.
    type State = 'open' | 'closed';

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Toggles the current state of the sidebar.
     * @param next                  Sidebar State.
     */
    export const toggle = (next?: State) => {
        // get the current state
        const cur = state();

        // do not toggle if next and current are the same
        if (cur === next) return;

        // set the current sidebar state
        Page.element().attr<State>('data-sidebar-state', next ?? cur === 'closed' ? 'open' : 'closed');
    };

    /// Gets the current sidebar state.
    export const state = (): State | null => Page.element().attr<State>('data-sidebar-state') ?? 'closed';
}
