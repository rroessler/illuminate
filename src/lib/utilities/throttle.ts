/**
 * Helper function that throttles performance items.
 * @param cb                    Callback.
 * @param delay                 Throttle Delay.
 */
export const throttle = (cb: (...args: any) => void, delay: number) => {
    let wait = false;
    let queued: any[] | undefined = undefined;

    /// Helper internal throttler.
    const m_throttler = () => {
        // once nothing else is queued, stop waiting
        if (queued === undefined) {
            wait = false;
            return;
        }

        // otherwise, call the queued items
        cb(...queued);
        queued = undefined;
        setTimeout(m_throttler, delay);
    };

    // return the wrapped callback
    return (...args: any[]): any => {
        // if waiting, then set the current queued arguments
        if (wait) return (queued = args);

        // otherwise call and set the throttle delay
        cb(...args);
        wait = true;
        setTimeout(m_throttler, delay);
    };
};
