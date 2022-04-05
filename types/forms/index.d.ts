import { Wrapper } from '../DOM/wrapper';
export declare namespace Forms {
    type InputKind = 'str' | 'num';
    type Validator = (aspects: IAspects) => {
        valid: true;
    } | {
        valid: false;
        reason: string;
    };
    interface IAspects {
        self: Wrapper<HTMLInputElement>;
        type: InputKind;
        pattern: RegExp | null;
        validator: Validator;
    }
    interface IOptions {
        preload: boolean;
    }
    const __name__ = "forms";
    const __options__: IOptions;
    const init: (opts?: Partial<IOptions>) => void;
    const prepare: (item: Wrapper<HTMLElement> | HTMLElement) => void;
    const validate: (item: Wrapper<HTMLInputElement> | HTMLInputElement) => {
        valid: true;
    } | {
        valid: false;
        reason: string;
    };
    const toggle: (item: Wrapper<HTMLInputElement> | HTMLInputElement) => void;
    const listen: (item: Wrapper<HTMLInputElement> | HTMLInputElement, validator?: Validator | undefined) => void;
    const ignore: (item: Wrapper<HTMLInputElement> | HTMLInputElement) => void;
}
