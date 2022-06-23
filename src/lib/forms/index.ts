/// Illuminate Imports
import { DOM } from '../DOM';
import { $_, Wrapper } from '../DOM/wrapper';
import { throttle } from '../utilities/throttle';
import { Validators } from './validators';

/// Forms Base Namespace.
export namespace Forms {
    /**************
     *  TYPEDEFS  *
     **************/

    /// Base Input Kinds.
    export type InputKind = 'str' | 'num' | 'bool';

    /// Validator Function Type.
    export type Validator = (aspects: IAspects) => { valid: true } | { valid: false; reason: string };

    /// Input Characteristics.
    export interface IAspects {
        self: Wrapper<HTMLInputElement>;
        type: InputKind;
        pattern: RegExp | null;
        validator: Validator;
    }

    /// Forms Options.
    export interface IOptions {
        preload: boolean;
    }

    /****************
     *  PROPERTIES  *
     ****************/

    /// Base namespace name.
    export const __name__ = 'forms';

    /// Base Forms Options.
    export const __options__: IOptions = {
        preload: DOM.html.attr('data-preload-forms') !== 'false',
    };

    /// Maps types to base types.
    const m_inputKindsMap: Partial<Record<string, InputKind>> = {
        text: 'str',
        email: 'str',
        password: 'str',
        number: 'num',
        checkbox: 'bool',
    };

    /******************
     *  INITIALISERS  *
     ******************/

    /// Coordinates initialising the base form.
    export const init = (opts: Partial<IOptions> = {}) => {
        // clone the options
        const base: IOptions = Object.assign({}, __options__, opts);

        // stop if not allowing preloading
        if (!base.preload) return;

        // otherwise, attach all available validators
        $_.all<'input'>('[data-validate]').forEach((input) => listen(input));
    };

    /**
     * Prepares a given root elements inputs with validators.
     * @param item                          Root to prepare validators of.
     */
    export const prepare = (item: Wrapper<HTMLElement> | HTMLElement) => {
        // cast the item to a valid wrapper
        const root = 'element' in item ? item : $_(item);

        // and prepare input listeners for all items
        $_.all<'input'>('[data-validate]', root).forEach((input) => listen(input));
    };

    /*********************
     *  FORM VALIDATION  *
     *********************/

    /**
     * Request an immediate validation.
     * @param item                          Input to validate.
     */
    export const validate = (item: Wrapper<HTMLInputElement> | HTMLInputElement) => {
        // retrieve the current aspects
        const aspects = m_identifyInput('element' in item ? item : $_(item));

        // and return the validation result
        return aspects.validator(aspects);
    };

    /**
     * Toggles the validation listener for a given input.
     * @param item                          Input to toggle listenability.
     * @param validator                     Custom validator.
     */
    export const toggle = (item: Wrapper<HTMLInputElement> | HTMLInputElement, validator?: Validator) => {
        // cast to a wrapper element only
        const input = 'element' in item ? item : $_(item);

        // and toggle the listenability
        input.hasEvent('input') ? ignore(input) : listen(input, validator);
    };

    /**
     * Attaches a listener for the given input item for validation.
     * @param item                          Input to dynamically validate.
     * @param validator                     Custom validator.
     */
    export const listen = (item: Wrapper<HTMLInputElement> | HTMLInputElement, validator?: Validator) => {
        // cast to a wrapper element only
        const input = 'element' in item ? item : $_(item);

        // depending on the type of input, we can handle as necessary
        const aspects = m_identifyInput(input, validator);

        // bind the default validator wrapper method to the input
        input.bind('input', m_createInputHandler(aspects));

        // can an initial validation
        input.trigger('input');
    };

    /**
     * Ignores listening for input validation.
     * @param item                          Input to stop listening to.
     */
    export const ignore = (item: Wrapper<HTMLInputElement> | HTMLInputElement) => {
        // cast to a wrapper element only
        const input = 'element' in item ? item : $_(item);

        // and unbind the input handler we have attached
        input.unbind('input');

        // remove any invalidness
        input.element.classList.remove('invalid');
    };

    /**
     * Handles actioning incoming input requests of an input element.
     * @param aspects                       Input Aspects.
     */
    const m_createInputHandler = (aspects: IAspects) =>
        throttle(() => {
            // make a request for the current input result
            const result = aspects.validator(aspects);

            // update the current validity of the element
            aspects.self[result.valid ? 'rem' : 'add']('classes', 'invalid');
        }, 250);

    /*********************
     *  PRIVATE METHODS  *
     *********************/

    /**
     * Identifies all the characteristics of a given input element.
     * @param self                          Input element to characterise.
     * @param validator                     Custom validator.
     */
    const m_identifyInput = (self: Wrapper<HTMLInputElement>, validator?: Validator): IAspects => {
        // need to determine the suitable input type
        let type = m_inputKindsMap[self.attr('type') ?? 'text'] ?? 'str';
        type = self.attr('data-input-type') ?? type; // override type

        // ensure some types are forcefully done
        if (self.tag === 'textarea') type = 'str';

        // and from here we can set the validators required
        return {
            type,
            self,
            pattern: m_preparePattern(self),
            validator: validator ?? Validators[type],
        };
    };

    /**
     * Prepares a pattern from a given input.
     * @param input                 Input to derive pattern from.
     */
    const m_preparePattern = (input: Wrapper<HTMLInputElement>): RegExp | null => {
        const restr = input.attr('pattern');
        if (restr === null) return restr;

        try {
            return new RegExp(restr);
        } catch (err) {
            console.error(`Forms: Invalid RegExp "${restr}".`);
            return null;
        }
    };
}
