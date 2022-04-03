export interface I$ {
    <T extends HTMLElement = HTMLElement>(selector: string | T, safe?: boolean): Wrapper<T>;
    all: <K extends keyof HTMLElementTagNameMap>(selector: string, parent?: HTMLElement | Wrapper<HTMLElement>) => Wrapper<HTMLElementTagNameMap[K]>[];
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
    text(): string;
    text(value: string): void;
    bind<K extends keyof HTMLElementEventMap>(eventName: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, once: boolean): void;
    unbind<K extends keyof HTMLElementEventMap>(eventName: K): void;
    click: () => void;
    clear: () => string;
    append(...items: (HTMLElement | string | IWrapper)[]): void;
    prev: <T_1 extends HTMLElement = HTMLElement>() => Wrapper<T_1>;
}
export declare const $: I$;