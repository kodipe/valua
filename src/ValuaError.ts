class ValuaError extends Error {
    errors: any;

    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ValuaError.prototype);
    }
}

export {
    ValuaError
}