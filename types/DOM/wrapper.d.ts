interface I$ {
    <T extends HTMLElement = HTMLElement>(selector: string | T): Wrapper<T>;
    create: <K extends keyof HTMLElementTagNameMap>(tagName: K) => Wrapper<HTMLElementTagNameMap[K]>;
}
export interface IWrapper<T extends HTMLElement = HTMLElement> {
    readonly element: T;
}
export declare class Wrapper<T extends HTMLElement> implements IWrapper<T> {
    readonly element: T;
    private m_boundEvents;
    constructor(element: T);
    attr<T = string>(prop: string): T | null;
    attr<T = string>(prop: string, value: T): void;
    bind<K extends keyof HTMLElementEventMap>(eventName: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, once: boolean): void;
    unbind<K extends keyof HTMLElementEventMap>(eventName: K): void;
    click: () => void;
    clear: () => string;
    append(...items: (HTMLElement | string | IWrapper)[]): void;
}
export declare const $: I$;
export {};
