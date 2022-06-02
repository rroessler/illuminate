/// Illuminate Imports.
import { $_, DOM } from '../DOM';
import { Wrapper } from '../DOM/wrapper';
import { Context } from '../common/context';

/** Modals Manager Namespace. */
export namespace Modal {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Defaulted Modal Controls.
    type DefaultControls = 'close';

    /// Modal Control Action.
    type ControlAction = (...args: any[]) => any;

    /** Basic Modal Control Interface. */
    interface IControl {
        label: string;
        action: DefaultControls | ControlAction;
        context?: Context;
    }

    /// Modal Control Type.
    export type Control = DefaultControls | IControl;

    /** Base Modal Structure. */
    export interface IStructure {
        title: DOM.Any;
        content?: DOM.Any | DOM.Any[];
        controls?: Control | Control[];
        blocking?: boolean;
        overlay?: HTMLElement | Wrapper<HTMLElement>;
    }

    /// Base Modal Structure Options.
    type StructureOptions = Omit<IStructure, 'title'>;

    /** Modal Plugin Options. */
    export interface IOptions {
        enabled: boolean;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /** Base Overlay Instance. */
    let $m_overlay: Wrapper<HTMLElement>;

    /** Current Overlay Instanced. */
    let $m_current: Wrapper<HTMLElement> | null = null;

    /// Base namespace name.
    export const __name__ = 'modals';

    /// Base alert options.
    export const __options__: IOptions = {
        enabled: true,
    };

    /*****************
     *  INITIALISER  *
     *****************/

    /// Coordinates initialising the modals manager.
    export const init = (opts: Partial<IOptions> = {}) => {
        // define the required options
        Object.assign(__options__, opts);

        // get the base overlay
        $m_overlay = DOM.body.query('.page-wrapper .overlay');

        if (!$m_overlay) {
            // create one if it does not exist
            $m_overlay ??= $_.create('div', {
                className: 'overlay',
                children: $_.create('div', { className: 'overlay-content' }),
            });

            // ensure it attach to the page wrapper required
            $_('.page-wrapper').append($m_overlay);
        }

        // lastly set up some dismiss handling
        $m_overlay.bind('click', m_onClick);
        DOM.body.bind('click', m_onBodyClick);
    };

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs a modal with the given options.
     * @param opts                  Modal Options.
     */
    function m_create(opts: IStructure): void;

    /**
     * Constructs a modal with the given options.
     * @param title                 Modal title.
     * @param opts                  Modal Options.
     */
    function m_create(title: string, opts: StructureOptions): void;

    /**
     * Actually constructs a modal with the given options.
     * @param title                 Modal title.
     * @param opts                  Modal Options.
     */
    function m_create(title: string | IStructure, opts: StructureOptions = {}) {
        // if we have a currently instanced modal, then STOP
        if (visible()) return;

        // re-assign the base options if needed
        if (typeof title !== 'string') {
            opts = Object.keys(title)
                .filter((k) => k.includes('title'))
                .reduce((o, k) => ({ ...o, [k]: (<any>title)[k] }), {});
        }

        // determine the best title available
        const header = typeof title === 'string' ? title : title.title;

        // pull out the defaulted items
        const blocking = opts.blocking ?? false;
        const $overlay = opts.overlay ? ('element' in opts.overlay ? opts.overlay : $_(opts.overlay)) : $m_overlay;
        const controls = opts.controls ? (Array.isArray(opts.controls) ? opts.controls : [opts.controls]) : [];
        const content = opts.content;

        // build the children required
        const children: DOM.Any[] = [
            typeof header === 'string' ? $_.create('h4', { className: 'title', innerHTML: header }) : header,
        ];

        // append additional content if needed
        if (content) children.push($_.create('div', { className: 'body', children: content }));
        if (controls.length) children.push(m_controls(controls));

        // build the required modal
        const modal = $_.create('div', { className: 'modal', children });

        // append to the overlay
        $overlay.query('.overlay-content')?.append(modal);

        // and make the overlay visible
        show(blocking);
    }

    /**
     * Exposed modal creation method.
     * @param title                         Title to use (or options).
     * @param opts                          Optional parameters to modify the modal.
     */
    export const create = m_create;

    /**
     * Shows the overlay with a desired pre-made modal if given.
     * @param selector                      Selector of modal to show.
     * @param blocking                      Blocking boolean.
     */
    export const show = (selector?: string | boolean, blocking: boolean = false) => {
        // stop if already visible
        if (visible()) return;

        // if given a selector, attempt finding
        const $target = typeof selector === 'string' ? $_(selector) : null;
        let $overlay = $target?.closest('.overlay') ?? $m_overlay;

        // determine if we need to clone the target or not
        if ($target && !$target.closest('.overlay')) $overlay.query('.overlay-content').append($target.clone());

        // once everything is set, handle showing the required items
        $overlay.add('classes', 'active');
        $m_current = $overlay;

        // add the non-blocking class if required
        if (!blocking) $m_current.add('classes', 'dismiss');
    };

    /**
     * Coordinates updating a currently displayed modal.
     * @param changes                       Display changes.
     */
    export const update = (changes: string | Partial<Omit<IStructure, 'blocking' | 'overlay'>>) => {
        if (!visible()) return; // ignore if not visible

        // fix up the input options
        const opts = typeof changes === 'string' ? { content: changes } : changes;

        // update the title if necessary
        if (opts.title) $m_current?.query('.modal>.title')?.replace(opts.title);

        // update the body elements if given
        if (opts.content) {
            const $body = $m_current?.query('.modal>.body');
            $body?.clear(), $body?.append(...(Array.isArray(opts.content) ? opts.content : [opts.content]));
        }

        // update the controls if desired
        if (opts.controls) {
            const controls = Array.isArray(opts.controls) ? opts.controls : [opts.controls];
            $m_current?.query('.modal>.controls').replace(m_controls(controls));
        }
    };

    /** Dismisses the current modal instance. */
    export const dismiss = () => {
        // hide the current actively overlay
        $m_current?.rem('classes', 'active');

        // delete the internal content
        $m_current?.query('.overlay-content').clear();

        // and make inactive
        $m_current = null;
    };

    /** Denotes if the current modal instance is visible. */
    export const visible = () => $m_current && $m_current.classList.contains('active');

    /*********************
     *  PRIVATE METHODS  *
     *********************/

    /**
     * Constructs the required control elements.
     * @param controls                      Controls to build.
     */
    const m_controls = (controls: Control[]) =>
        $_.create('div', {
            className: 'controls',
            children: controls.map((c) => {
                if (c === 'close') return m_control({ label: 'Close', action: 'close' });
                return m_control(c);
            }),
        });

    /**
     * Constructs a control element as needed.
     * @param opts                          Control options.
     */
    const m_control = (opts: IControl) =>
        $_.create('button', {
            className: `btn ${opts.context !== 'none' ? `btn-${opts.context ?? 'primary'}` : ''}`.trim(),
            innerHTML: opts.label,
            onclick: opts.action === 'close' ? () => dismiss() : opts.action,
        });

    /********************
     *  EVENT HANDLING  *
     ********************/

    /**
     * Coordinates modal dismiss handling.
     * @param ev                            Base mouse event.
     */
    const m_onClick = function (ev: MouseEvent) {
        const target = <HTMLElement>ev.target;
        if (target.classList.contains('dismiss') || target.closest('dismiss')) dismiss();
    };

    /**
     * Coordinates modal show handling.
     * @param ev                            Base mouse event.
     */
    const m_onBodyClick = function (ev: MouseEvent) {
        const target = <HTMLElement>ev.target;
        const selector = target.closest('[data-modal-target]')?.getAttribute('data-modal-target');
        if (selector) show(selector);
    };
}
