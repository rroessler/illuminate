import { Wrapper } from './wrapper';
export { $ } from './wrapper';
export declare namespace DOM {
    const html: Wrapper<HTMLElement>;
    let body: Wrapper<HTMLElement>;
    const onload: (cb: () => void) => void;
}
