/// Illuminate Imports.
import type { Illuminate } from '../illuminate';

import { Forms } from '../forms';
import { Theme } from '../user/theme';

import { Alerts } from '../components/alerts';
import { Modal } from '../components/modals';

/// Illuminate initialisation namespace.
export namespace __init__ {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Base Initialisable Interface.
    interface IBase {
        readonly __name__: string;
        init: (...args: any[]) => void | Promise<void>;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Initialisable before DOM is ready.
    const m_beforeDOM: IBase[] = [Theme];

    /// Initialisable after DOM is ready.
    const m_afterDOM: IBase[] = [Forms, Alerts, Modal];

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /// Preload initialisation.
    export const load = async (opts: Illuminate.IOptions) => {
        // anything before DOM, initialise
        for (const before of m_beforeDOM) before.init((<any>opts)[before.__name__]);

        // anything after DOM, initialise
        document.addEventListener('DOMContentLoaded', function () {
            for (const after of m_afterDOM) after.init((<any>opts)[after.__name__]);
        });
    };
}
