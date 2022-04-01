import { IWrapper } from './wrapper';
export declare namespace Factory {
    interface IAttribute {
        name: string;
        value: string | number;
    }
    type OmittedCreationOptions = 'children';
    export type CustomCreationOptions<K extends keyof HTMLElementTagNameMap> = Partial<Omit<HTMLElementTagNameMap[K], OmittedCreationOptions> & {
        children: HTMLElement | HTMLElement[] | IWrapper | IWrapper[];
        attrs: IAttribute[];
    }>;
    export const create: <K extends keyof HTMLElementTagNameMap>(tagName: K, opts?: string | Partial<Omit<HTMLElementTagNameMap[K], "children"> & {
        children: HTMLElement | HTMLElement[] | IWrapper | IWrapper[];
        attrs: IAttribute[];
    }>) => HTMLElementTagNameMap[K];
    export {};
}
