/// Illuminate Imports.
import { $_, DOM } from '../DOM';
import { Context } from '../common/context';

/// Alerts Namespace.
export namespace Alerts {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Toast Alert Options. */
    export interface IToast {
        readonly title?: string;
        readonly context?: Context;
        readonly mode?: 'default' | 'notched';
        readonly duration?: number;
        readonly dismissable?: boolean;
        readonly autoHide?: boolean;
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Factory method for generating toasts.
     * @param children                  Subsequent toast content.
     */
    function m_create(...children: DOM.Any[]): Toast;

    /**
     * Factory method for generating toasts.
     * @param opts                      Toast options.
     * @param children                  Subsequent toast content.
     */
    function m_create(opts: IToast, ...children: DOM.Any[]): Toast;
    function m_create(input: any, ...children: DOM.Any[]) {
        return new Toast(input, children);
    }

    /// Aliased Creation method.
    export const create = m_create;

    /********************
     *  IMPLEMENTATION  *
     ********************/

    /** Toast Class Implementation. */
    class Toast implements Required<IToast> {
        /****************
         *  PROPERTIES  *
         ****************/

        readonly title: string = ''; // Toast Title.
        readonly context: Context = 'none'; // Toast Context.
        readonly mode: Required<IToast>['mode'] = 'default'; // Toast Mode.
        readonly duration: number = 5000; // Display Duration.
        readonly dismissable: boolean = true; // Dismissable Flag.
        readonly autoHide: boolean = true; // Auto-Hide Flag.

        /** Base Toast Element. */
        readonly element = $_.create('div', {
            className: 'toast',
            attrs: [{ name: 'role', value: 'alert' }],
        });

        /** Denotes if dismissed already. */
        private m_dismissed = false;

        /*****************
         *  CONSTRUCTOR  *
         *****************/

        /**
         * Constructs a toast alert instance.
         * @param input                         Input parameters.
         * @param children                      Content.
         */
        constructor(input: string | IToast = '...', children: DOM.Any[]) {
            if (typeof input === 'string') this.title = input;
            else Object.assign(this, input);

            // and alter the toast element as necessary
            this.m_prepare(children);

            // finally, display as the user requested
            Manager.display(this);
        }

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /** Shows the toast instance. */
        show = () => (this.element.element.style.opacity = '1');

        /** Hides the toast instance. */
        hide = () => (this.element.element.style.opacity = '0');

        /** Dismisses the toast instance. */
        dismiss() {
            console.log('HELLO!');
            if (this.m_dismissed) return;
            this.m_dismissed = true;
            this.element.element.remove();
        }

        /*********************
         *  PRIVATE METHODS  *
         *********************/

        /**
         * Prepares the toast with the current parameters.
         * @param children                  Toast Children.
         */
        private m_prepare(children: DOM.Any[]) {
            // prepend the dismiss button if possible
            if (this.dismissable) {
                const button = $_.create('button', { className: 'dismiss', type: 'button' });
                button.bind('click', () => this.dismiss());
                this.element.append(button);
            }

            // modify the classes required
            if (this.context !== 'none') this.element.element.classList.add(`toast-${this.context}`);
            if (this.mode === 'notched') this.element.element.classList.add('notched');

            // prepend the title if one is found
            if (this.title.trim()) this.element.append($_.create('h4', { className: 'title', innerHTML: this.title }));

            // lastly append all the required children
            this.element.append(...children);
        }
    }

    /***************************
     *  MANAGER FUNCTIONALITY  *
     ***************************/

    /** Alerts Management. */
    namespace Manager {
        /****************
         *  PROPERTIES  *
         ****************/

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /**
         * Displays a given toast instance.
         * @param toast                         Toast to display.
         */
        export const display = (toast: Toast) => {
            // set the toast into a "hidden" state
            toast.hide();

            // set the appropriate position
            toast.element.element.style.position = 'absolute';
            toast.element.element.style.bottom = '0';
            toast.element.element.style.right = '0';

            // append to the current page wrapper
            $_('.page-wrapper').append(toast.element);

            // set into a show state
            toast.show();

            // and set up an appropriate dismisser
            if (toast.autoHide) setTimeout(() => toast.dismiss(), toast.duration);
        };

        /*********************
         *  PRIVATE METHODS  *
         *********************/
    }
}
