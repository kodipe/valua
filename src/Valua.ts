import { ValuaError } from "./ValuaError";
import { ValidatorConfig } from "./ValidatorConfig"
import { ErrorCode } from "./ErrorCode";
import { ValuaMonad } from "./ValuaMonad";
import { ValidationResult } from "./ValidationResult";

const Valua = (validation = (v: any) => v): ValuaMonad => {
  return {
    string: (config: ValidatorConfig = {}) => Valua((v: any) => {
      if(typeof v === "string") {
        return v
      } else {
        const err = new ValuaError(ErrorCode.IS_NOT_A_STRING_ERROR);
        err.errors = config.error || ErrorCode.IS_NOT_A_STRING_ERROR
        return err;
      }
    }),
    minLength: (threshold: number, config: ValidatorConfig = {}) => Valua((v: any) => {
      if(v.length >= threshold) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.TO_SHORT_ERROR)
        err.errors = config.error || ErrorCode.TO_SHORT_ERROR;
        return err;
      }
    }),
    maxLength: (threshold: number, config: ValidatorConfig = {}) => Valua((v: any) => {
      if(v.length <= threshold) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.TO_LONG_ERROR)
        err.errors = config.error || ErrorCode.TO_LONG_ERROR;
        return err;
      }
    }),
    number: (config: ValidatorConfig = {}) => Valua((v: any) => {
      if(typeof v === "number") {
        return v
      } else {
        const err = new ValuaError(ErrorCode.IS_NOT_A_NUMBER_ERROR);
        err.errors = config.error || ErrorCode.IS_NOT_A_NUMBER_ERROR;
        return err;
      }
    }),
    min: (threshold: number, config: ValidatorConfig = {}) => Valua((v: any) => {
      if(v >= threshold) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.TO_SMALL_ERROR)
        err.errors = config.error || ErrorCode.TO_SMALL_ERROR;
        return err;
      }
    }),
    max: (threshold: number, config = {}) => Valua((v: any) => {
      if(v <= threshold) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.TO_BIG_ERROR)
        err.errors = ErrorCode.TO_BIG_ERROR;
        return err;
      }
    }),
    object: (config: { [key: string]: any; }) => Valua((v: any) => {
      const objErrors: { [key: string]: string; } = {};

      Object.keys(config).forEach((schemaKey: string) => {
        const result = config[schemaKey].validate(v[schemaKey] || null);
        if(!result.isValid()) {
          objErrors[schemaKey] = result.getErrors();
        }
      })

      if(Object.keys(objErrors).length > 0) {
        const err = new ValuaError("Object errors");
        err.errors = objErrors
        return err;
      }
      return v;
    }),
    array: (config: ValidatorConfig = {}) => Valua((v: any) => {
      if(Array.isArray(v)) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.IS_NOT_AN_ARRAY_ERROR)
        err.errors = config.error || ErrorCode.IS_NOT_AN_ARRAY_ERROR;
        return err;
      }
    }),
    each: (validator: any, config: ValidatorConfig) => Valua((v: any) => {
      const arrErrors: { [key: number]: string; } = {};

      v.forEach((i: any, index: number) => {
        const result = validator.validate(i);
        if(!result.isValid()) {
          arrErrors[index] = result.getErrors();
        }
      });

      if(Object.keys(arrErrors).length > 0) {
        const err = new ValuaError("Array errors");
        err.errors = arrErrors
        return err;
      }

      return v;
    }),
    required: (config: ValidatorConfig = {}) => Valua((v: any) => {
      if(v === undefined || v === null) {
        const err = new ValuaError(ErrorCode.IS_REQUIRED_ERROR)
        err.errors = config.error || ErrorCode.IS_REQUIRED_ERROR;
        return err;
      }
      return v;
    }),
    test: (test: (v: any) => any, config: ValidatorConfig = {}) => Valua((v: any) => {
      if(test(v)) {
        return v
      } else {
        const err = new ValuaError(ErrorCode.NOT_PASSED_TEST_ERROR);
        err.errors = config.error || ErrorCode.NOT_PASSED_TEST_ERROR
        return err;
      }
    }),
    match: (regex: RegExp, config: ValidatorConfig = {}) => Valua((v: any) => {
      if(regex.test(v)) {
        return v;
      } else {
        const err = new ValuaError(ErrorCode.NOT_MATCH_ERROR);
        err.errors = config.error || ErrorCode.NOT_MATCH_ERROR
        return err;
      }
    }),
    boolean: (config: ValidatorConfig = {}) => Valua((v: any) => {
      if(typeof v === "boolean") {
        return true;
      } else {
        const err = new ValuaError(ErrorCode.IS_NOT_BOOLEAN);
        err.errors = config.error || ErrorCode.IS_NOT_BOOLEAN;
        return err;
      }
    }),
    validate: (v: any): ValidationResult => {

      const result = validation(v);

      return {
        isValid: () => !(result instanceof ValuaError),
        getErrors: () => {
          if(result instanceof ValuaError) {
            return result.errors
          }
          return null
        }
      };
    },
  }
}

export {
  Valua
}