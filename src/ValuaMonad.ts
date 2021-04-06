import { ValidatorConfig } from "./ValidatorConfig";
import { ValuaError } from "./ValuaError";
import { ValidationResult } from "./ValidationResult";

interface ValuaMonad {
    string(config?: ValidatorConfig): ValuaMonad;
    number(config?: ValidatorConfig): ValuaMonad;
    min(threshold:number, config?: ValidatorConfig): ValuaMonad;
    max(threshold:number, config?: ValidatorConfig): ValuaMonad;
    array(config?: ValidatorConfig): ValuaMonad;
    object(schema: any, config?: ValidatorConfig): ValuaMonad;
    each(validator: ValuaMonad, config?: ValidatorConfig): ValuaMonad;
    test(validator: (v: any) => any, config?: ValidatorConfig): ValuaMonad;
    match(regex: RegExp, config?: ValidatorConfig): ValuaMonad;
    boolean(config?: ValidatorConfig): ValuaMonad;
    required(config?: ValidatorConfig): ValuaMonad;
    validate(value?: any): ValidationResult;
}

export {
    ValuaMonad
}