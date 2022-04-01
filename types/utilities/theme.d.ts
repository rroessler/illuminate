export declare namespace Theme {
    type Mode = 'light' | 'dark';
    interface IOptions {
        preload: boolean;
    }
    const __name__ = "theme";
    const __options__: IOptions;
    const init: (opts?: Partial<IOptions>) => void;
    const toggle: (theme?: Mode | undefined) => void;
    const current: () => Mode;
    const prefers: () => Mode;
}
