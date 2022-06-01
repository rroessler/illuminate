/// DOM Imports.
import { IWrapper } from './wrapper';

/// DOM Factory Namespace.
export namespace Factory {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Attribute Interface.
    interface IAttribute {
        name: string;
        value: string | number;
    }

    /// Omittable Creation Options.
    type OmittedCreationOptions = 'style' | 'children';

    /// Element Creation Options.
    export type CustomCreationOptions<K extends keyof HTMLElementTagNameMap> = Partial<
        Omit<HTMLElementTagNameMap[K], OmittedCreationOptions> & {
            children: HTMLElement | HTMLElement[] | IWrapper | IWrapper[];
            style: Partial<CSSStyleDeclaration>;
            attrs: IAttribute[];
        }
    >;

    /****************
     *  GENERATORS  *
     ****************/

    /**
     * Constructs an element with given options (or text).
     * @param tagName                       Base Tag Name.
     * @param opts                          Element Options.
     */
    export const create = <K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        opts: CustomCreationOptions<K> | string = {}
    ): HTMLElementTagNameMap[K] => {
        // if our given options is a string, change into a "innerHTML" object
        if (typeof opts === 'string') opts = { innerHTML: opts } as CustomCreationOptions<K>;

        // filter out certain properties
        const { attrs, children, ...rest } = opts;

        // construct the base element as needed
        const element = Object.assign(document.createElement(tagName), rest);

        // attach all the desired children now
        if (children !== undefined) {
            (Array.isArray(children) ? children : [children]).forEach((child: HTMLElement | IWrapper) => {
                if ('element' in child) element.append(child.element);
                else element.append(child);
            });
        }

        // attach all the given attributes
        if (attrs !== undefined) attrs.forEach((attr) => element.setAttribute(attr.name, attr.value as any));

        // once complete return the created element
        return element;
    };
}
