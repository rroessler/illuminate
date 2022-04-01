export declare namespace Sidebar {
    type State = 'open' | 'closed';
    export const toggle: (next?: State | undefined) => void;
    export const state: () => State | null;
    export {};
}
