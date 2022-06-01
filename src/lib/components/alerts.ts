/// Illuminate Imports.
import { $_, DOM } from '../DOM';
import { Context } from '../common/context';
import { Wrapper } from '../DOM/wrapper';

/// Alerts Namespace.
export namespace Alerts {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Base Context Position.
    export type Position = typeof m_positions[number];

    /** Toast Alert Options. */
    export interface IToast {
        readonly title?: string;
        readonly context?: Context;
        readonly mode?: 'default' | 'notched';
        readonly classes?: string[];
        readonly duration?: number;
        readonly dismissable?: boolean;
        readonly autoHide?: boolean;
    }

    /** Alert Options. */
    export interface IOptions {
        position: Position;
        fadeDelay: number;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Available Positions.
    const m_positions = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'] as const;

    /// Base namespace name.
    export const __name__ = 'alerts';

    /// Base alert options.
    export const __options__: IOptions = {
        position: 'bottom-right',
        fadeDelay: 200,
    };

    /*****************
     *  INITIALISER  *
     *****************/

    /// Coordinates initialising the base theme.
    export const init = (opts: Partial<IOptions> = {}) => {
        // set these onto the manager
        Manager.set(Object.assign({}, __options__, opts));

        // if we do not have a valid container, make one
        if (!$_.all('.page-wrapper .toasts-container').length) {
            $_('.page-wrapper').append($_.create('div', { className: 'toasts-container' }));
        }

        // and define the base context
        container('.page-wrapper .toasts-container', Manager.options.position);
    };

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

    /**
     * Changes the current alerts positioning.
     * @param pos                       Position to set.
     */
    export const position = (pos: Position) => {
        if (!Manager.$container) return;
        Manager.$container.rem('classes', ...m_positions);
        Manager.$container.add('classes', pos);
    };

    /**
     * Sets the currently desired context element.
     * @param sel                       Context selector.
     * @param pos                       Optional position to set.
     */
    export const container = (sel: string, pos?: Position) => {
        Manager.$container = $_(sel);
        if (!pos) return;

        Manager.$container.rem('classes', ...m_positions);
        Manager.$container.add('classes', pos);
    };

    /// Aliased Creation method.
    export const create = m_create;

    /********************
     *  IMPLEMENTATION  *
     ********************/

    /** Toast Class Implementation. */
    class Toast implements Required<Omit<IToast, 'classes'>> {
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
        readonly $element = $_.create('div', {
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
            else {
                const { classes, ...rest } = input;
                Object.assign(this, rest);
                this.$element.add('classes', ...(classes ?? []));
            }

            // and alter the toast element as necessary
            this.m_prepare(children);

            // set up some event handlers
            this.m_registerListeners();

            // finally, display as the user requested
            Manager.display(this);
        }

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /** Shows the toast instance. */
        show = () => this.$element.css('opacity', 1);

        /** Hides the toast instance. */
        hide = () => this.$element.css('opacity', 0);

        /** Dismisses the toast instance. */
        dismiss() {
            if (this.m_dismissed) return;
            this.m_dismissed = true;
            this.$element.css('opacity', 0);
            setTimeout(() => this.$element.rem(), Manager.options.fadeDelay);
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
                this.$element.append(button);
            }

            // modify the classes required
            if (this.context !== 'none') this.$element.add('classes', `toast-${this.context}`);
            if (this.mode === 'notched') this.$element.add('classes', 'notched');

            // prepend the title if one is found
            if (this.title.trim()) this.$element.append($_.create('h4', { className: 'title', innerHTML: this.title }));

            // lastly append all the required children
            this.$element.append(...children);
        }

        /********************
         *  EVENT HANDLERS  *
         ********************/

        /** Registers all required toast listeners. */
        private m_registerListeners() {
            this.$element.bind('click', (ev) => this.m_onClick(ev.target as any));
        }

        /**
         * Coordinates internal clicks.
         * @param target                    Target element.
         */
        private m_onClick(target: HTMLElement) {
            const dismisser = target.closest('.dismiss');
            if (dismisser) this.dismiss();
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

        /** Base Alert Options. */
        export let options: IOptions = Object.assign({}, __options__);

        /** Current display context. */
        export let $container: Wrapper<HTMLElement>;

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /**
         * Updates the underlying manager properties.
         * @param opts                      Options to set.
         */
        export const set = (opts: Partial<IOptions>) => Object.assign(options, opts);

        /**
         * Displays a given toast instance.
         * @param toast                         Toast to display.
         */
        export const display = (toast: Toast) => {
            // if there is NO context, then ignore
            if (!$container) return;

            toast.hide(); // set the toast into a "hidden" state
            $container?.append(toast.$element); // append to the current page wrapper
            requestAnimationFrame(() => toast.show()); // set into a show state on next draw call

            // and set up an appropriate dismisser
            if (toast.autoHide) setTimeout(() => toast.dismiss(), toast.duration);
        };

        /*********************
         *  PRIVATE METHODS  *
         *********************/
    }
}
