import { DOM } from '../DOM';
import { Context } from '../common/context';
export declare namespace Alerts {
    export interface IToast {
        readonly title?: string;
        readonly context?: Context;
        readonly mode?: 'default' | 'notched';
        readonly duration?: number;
        readonly dismissable?: boolean;
    }
    function m_create(...children: DOM.Any[]): Toast;
    function m_create(opts: IToast, ...children: DOM.Any[]): Toast;
    export const create: typeof m_create;
    class Toast implements Required<IToast> {
        readonly title: string;
        readonly context: Context;
        readonly mode: Required<IToast>['mode'];
        readonly duration: number;
        readonly dismissable: boolean;
        readonly element: import("../DOM/wrapper").Wrapper<HTMLDivElement>;
        constructor(input: string | IToast | undefined, children: DOM.Any[]);
        private m_prepare;
    }
    export {};
}
