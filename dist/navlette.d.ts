export declare const navTo: (path: any, {allowForward, display}?: {
    allowForward: boolean;
    display: boolean;
}) => () => void;
export declare function onBrowserPathDidChange(fn: (path: string) => void): void;
export declare function attach(): void;
