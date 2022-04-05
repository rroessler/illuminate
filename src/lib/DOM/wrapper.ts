/// DOM Imports.
import { Factory } from './factory';

/**************
 *  TYPEDEFS  *
 **************/

/// jQuery-like interface.
export interface I$ {
    <T extends HTMLElement = HTMLElement>(selector: string | T, safe?: boolean): Wrapper<T>;
    all: <K extends keyof HTMLElementTagNameMap>(
        selector: string,
        parent?: HTMLElement | Wrapper<HTMLElement>
    ) => Wrapper<HTMLElementTagNameMap[K]>[];
    create: <K extends keyof HTMLElementTagNameMap>(tagName: K) => Wrapper<HTMLElementTagNameMap[K]>;
    selector: (item: HTMLElement | Wrapper<HTMLElement>) => string;
}

/// Base Wrapper Interface.
export interface IWrapper<T extends HTMLElement = HTMLElement> {
    readonly element: T;
}

/****************************
 *  WRAPPER IMPLEMENTATION  *
 ****************************/

/// Element Wrapper.
export class Wrapper<T extends HTMLElement> implements IWrapper<T> {
    /****************
     *  PROPERTIES  *
     ****************/

    /// Valid Input Tags.
    private static m_validInputs: (keyof HTMLElementTagNameMap)[] = ['input', 'select', 'textarea'];

    /// Globally bound events (attached to all known elements).
    private static m_boundEvents: Partial<Record<string, any>> = {};

    /***********************
     *  GETTERS / SETTERS  *
     ***********************/

    /// Gets the wrappers base tag-name.
    get tag() {
        return this.element.tagName.toLowerCase() as keyof HTMLElementTagNameMap;
    }

    /// Gets the current selector.
    get selector(): string {
        return $.selector(this);
    }

    /******************
     *  CONSTRUCTORS  *
     ******************/

    /**
     * Constructs a new instance of an Element Wrapper.
     * @param element                       Base Element.
     */
    constructor(public readonly element: T) {}

    /*****************************
     *  GETTER / SETTER METHODS  *
     *****************************/

    /**
     * Gets an attribute from a given element.
     * @param prop                          Attribute to query.
     */
    attr<T = string>(prop: string): T | null;

    /**
     * Sets an attribute of a wrapper element.
     * @param prop                          Attribute to set.
     * @param value                         Value to set.
     */
    attr<T = string>(prop: string, value: T): void;

    /**
     * Getter/Setter implementation for 'attr' method.
     * @param prop                          Attribute to set/get.
     * @param value                         Value to set if given.
     */
    attr(prop: string, value?: any): any {
        // getter implementation
        if (value === undefined) return this.element.getAttribute(prop);

        // since given a value, we instead set
        this.element.setAttribute(prop, value);
    }

    /// Getter for elements text.
    text(): string;

    /// Setter for elements text.
    text(value: string): void;

    /**
     * Getter/Setter implementation for 'text' method.
     * @param value                         Value to set if given.
     */
    text(value?: string): any {
        if (value === undefined) return this.element.innerHTML;
        else this.element.innerHTML = value;
    }

    /// Getter for value type.
    val<V>(): V;

    /// Setter for value type.
    val<V>(value: V): void;

    /**
     * Getter/Setter implementation for inputs.
     * @param value                         Value to set if given.
     */
    val<V extends any>(value?: V): any {
        /// ensure we have a valid input element
        this.m_assert(
            Wrapper.m_validInputs.includes(this.tag),
            new TypeError('$: Invalid Input Type. Cannot retrieve value.')
        );

        // cast the internal element to a HTMLInputElement
        const input = this.element as unknown as HTMLInputElement;

        // if we have a getter
        if (value === undefined) {
            return (
                (<Record<string, () => V>>{
                    checkbox: () => this.attr(':checked'),
                    number: () => parseFloat(input.value ?? 'NaN') as V,
                    invalid: () => (input.value ?? '') as V
                })[this.attr('type') ?? 'invalid']?.() ?? ((input.value ?? '') as V)
            );
        }

        // otherwise coordinate updating
        switch (this.attr('type')) {
            // checkboxes required a little extra
            case 'checkbox': {
                this.m_assert(typeof value === 'boolean', new TypeError('$: Checkbox input expects a boolean value.'));
                this.attr('checked', value);
                break;
            }

            // ensure for numbers we have a valid value
            case 'number': {
                this.m_assert(typeof value === 'number', new TypeError('$: Numeric input expects a numeric value.'));
            }

            // default case sets as strings regardless
            default: {
                input.value = value as any;
                break;
            }
        }

        // once the setter has been called, trigger the core 'input' event
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /*******************
     *  EVENT METHODS  *
     *******************/

    /**
     * Named event bind method for wrapped DOM elements.
     * @param eventName                 Event Name.
     * @param listener                  Event Listener.
     * @param once                      Listen only once.
     */
    bind<K extends keyof HTMLElementEventMap>(
        eventName: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        once?: boolean
    ): void;

    /**
     * Event binding implementation.
     * @param eventName                 Any Event Name.
     * @param listener                  Base Event listener.
     * @param once                      Listen only once.
     */
    bind(eventName: string, listener: (this: HTMLElement, evt: Event) => void, once: boolean = false) {
        // unbind any previous event with this name
        this.unbind(eventName as any);

        // make a reference for the custom handler
        const self = this;

        // create a custom listener
        const handler = function (this: HTMLElement) {
            listener.call(this, arguments[0]);
            if (once) self.unbind(eventName as any);
        };

        // bind the event internally
        this.m_bound(true)[eventName] = handler;

        // and add as an event listener
        this.element.addEventListener(eventName, handler);
    }

    /**
     * Unbinds a named event from the wrapper.
     * @param eventName                 Event Name.
     */
    unbind<K extends keyof HTMLElementEventMap>(eventName: K): void;

    /**
     * Event unbinding implementation.
     * @param eventName                 Any Event Name.
     */
    unbind(eventName: string) {
        // grab the bound events
        const bound = this.m_bound();

        // attempt finding the event
        const found = bound[eventName];

        // if found, then unbind
        if (found !== undefined) this.element.removeEventListener(eventName, found, false);

        // remove from the available events
        delete bound[eventName];

        // if bound is now empty, delete from the global events
        if (Object.keys(bound).length === 0) delete Wrapper.m_boundEvents[this.selector];
    }

    /**
     * Checks if an event is attached to the wrapper.
     * @param eventName                 vent Name.
     */
    hasEvent<K extends keyof HTMLElementEventMap>(eventName: K): boolean;

    /**
     * Checks if an event is attached to the wrapper.
     * @param eventName                 Any Event Name.
     */
    hasEvent(eventName: string) {
        return this.m_bound()[eventName] !== undefined;
    }

    /*********************
     *  TRIGGER METHODS  *
     *********************/

    /// Coordinates a click trigger.
    click = () => this.element.click();

    /******************
     *  NODE METHODS  *
     ******************/

    /// Clears the current element content.
    clear = () => (this.element.innerHTML = '');

    /**
     * Appends items onto the base element.
     * @param items                 Items to append.
     */
    append(...items: (HTMLElement | string | IWrapper)[]) {
        for (const item of items) {
            if (typeof item === 'string') this.element.innerHTML += item;
            else if ('element' in item) this.element.appendChild(item.element);
            else this.element.appendChild(item);
        }
    }

    /// Returns the previous element.
    prev = <T extends HTMLElement = HTMLElement>() => $(this.element.previousElementSibling as T);

    /*********************
     *  PRIVATE METHODS  *
     *********************/

    /// Assertion Helper method.
    private m_assert = <E extends Error>(cond: boolean, error: E) => {
        if (!cond) throw error;
    };

    /// Gets the currently bound events.
    private m_bound = (create = false) => {
        // if no bound events, then return none, or create if required
        if (Wrapper.m_boundEvents[this.selector] === undefined && create) Wrapper.m_boundEvents[this.selector] = {};

        // return the current bound events
        return (Wrapper.m_boundEvents[this.selector] ?? {}) as Partial<Record<string, any>>;
    };
}

/*********************************
 *  CONSTRUCTORS IMPLEMENTATION  *
 *********************************/

/**
 * Constructs a wrapped element from given selector.
 * @param item                          Selector or HTML element to wrap.
 * @param safe                          Safe constructor use.
 */
export const $: I$ = function <T extends HTMLElement>(item: string | T, safe = true) {
    const element = typeof item === 'string' ? document.querySelector(item) : item;
    if (!safe) return element !== null ? new Wrapper<T>(element as T) : (null as any);
    else if (element !== null) return new Wrapper<T>(element as T);

    // since not safe, then declare an error
    if (typeof item === 'string') throw new ReferenceError(`$: Invalid selector "${item}".`);
    else throw new ReferenceError(`$: Invalid element. Received null.`);
};

/**
 * Gets all items by the given selector.
 * @param selector                      Selector of elements.
 * @param parent                        Parent element.
 */
$.all = <K extends keyof HTMLElementTagNameMap>(selector: string, parent?: HTMLElement | Wrapper<HTMLElement>) => {
    // resolve the chosen base parent
    let base = parent ?? document;
    if ('element' in base) base = base.element;

    // and return the resulting elements
    return [...base.querySelectorAll(selector)].map((element) => $<HTMLElementTagNameMap[K]>(element as any));
};

/**
 * Helper method to create wrapped elements.
 * @param tagName                       Base Tag Name.
 * @param opts                          Constructor Options.
 */
$.create = <K extends keyof HTMLElementTagNameMap>(tagName: K, opts: string | Factory.CustomCreationOptions<K> = {}) =>
    $<HTMLElementTagNameMap[K]>(Factory.create<K>(tagName, opts) as any);

/**
 * Constructs the selector of a given element.
 * @param item                          Item to get selector from.
 */
$.selector = (item: HTMLElement | Wrapper<HTMLElement>): string => {
    const names: string[] = [];
    let el = 'element' in item ? item.element : item;

    // traverse backwards
    while (el.parentNode) {
        if (el.id) {
            names.unshift('#' + el.id);
            break;
        } else {
            if (el == el.ownerDocument.documentElement) names.unshift(el.tagName.toLowerCase());
            else {
                for (let c = 1, e: Element | null = el; e.previousElementSibling; e = e.previousElementSibling, c++) {
                    names.unshift(el.tagName.toLowerCase() + ':nth-child(' + c + ')');
                }
            }
        }

        // and fulfill the loop condition
        el = el.parentNode as HTMLElement;
    }

    // once complete, join all the names together
    return names.join(' ');
};
