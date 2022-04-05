/// Illuminate Imports
import { Forms } from '.';

/*************
 *  HELPERS  *
 *************/

/// Helper method to validate given patterns.
const m_validatePattern = (value: string, re: RegExp) => {
    const valid = value.match(re) !== null;
    if (valid) return { valid };
    return { valid: false, reason: 'Invalid input pattern.' };
};

/********************
 *  IMPLEMENTATION  *
 ********************/

/// Default Form Validators.
export const Validators: Record<Forms.InputKind, Forms.Validator> = {
    /// Validates String Inputs.
    str: (aspects) => {
        const value = aspects.self.val<string>();

        // if we have a pattern check through that route
        if (aspects.pattern !== null) return m_validatePattern(value, aspects.pattern);

        // otherwise, there are no validators so ignore
        return { valid: true };
    },

    /// Validates Numeric Inputs.
    num: (aspects) => {
        const value = aspects.self.val<number>();

        // if we have a pattern check through that route
        if (aspects.pattern !== null) return m_validatePattern(value.toString(), aspects.pattern);

        // if we have minimum/maximum values, ensure this is valid
        const min = parseFloat(aspects.self.attr('min') ?? 'NaN');
        const max = parseFloat(aspects.self.attr('max') ?? 'NaN');

        if (!isNaN(min) && min >= value) return { valid: false, reason: 'Value exceeds minimum threshold.' };
        if (!isNaN(max) && max <= value) return { valid: false, reason: 'Value exceeds maximum threshold.' };

        // otherwise, we declare the value as valid
        return { valid: true };
    }
};