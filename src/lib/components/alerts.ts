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

        readonly title: string = '';
        readonly context: Context = 'none';
        readonly mode: Required<IToast>['mode'] = 'default';
        readonly duration: number = 5000;
        readonly dismissable: boolean = true;

        /** Base Toast Element. */
        readonly element = $_.create('div', {
            className: 'toast',
            attrs: [{ name: 'role', value: 'alert' }]
        });

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
            if (this.dismissable) this.element.append($_.create('button', { className: 'dismiss', type: 'button' }));

            // modify the classes required
            if (this.context !== 'none') this.element.element.classList.add(`toast-${this.context}`);
            if (this.mode === 'notched') this.element.element.classList.add('notched');

            // prepend the title if one is found
            if (this.title.trim()) this.element.append($_.create('h4', { className: 'title', innerHTML: this.title }));

            // lastly append all the required children
            this.element.append(...children);
        }
    }
}
