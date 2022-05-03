import { Wrapper } from './wrapper';
export { $_ } from './wrapper';
export declare namespace DOM {
    type Any = string | HTMLElement | Wrapper<HTMLElement>;
    const html: Wrapper<HTMLElement>;
    let body: Wrapper<HTMLElement>;
    const onload: (cb: () => void) => void;
}
