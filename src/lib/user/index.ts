/// Illuminate User Namespace.
export namespace User {
    /****************
     *  PROPERTIES  *
     ****************/

    /// Denotes if the user is on a mobile device.
    export const usingMobile = (() =>
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/.test(navigator.userAgent) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/.test(navigator.userAgent))();
}
