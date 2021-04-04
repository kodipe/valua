import { ValuaError } from "./ValuaError";
import { ValidatorConfig } from "./ValidatorConfig"
import { ErrorCode } from "./ErrorCode";

const Valua = (validation = (v: any) => v) => {
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
        if(result instanceof ValuaError) {
          objErrors[schemaKey] = result.errors;
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
    each: (config: any) => Valua((v: any) => {
      const arrErrors: { [key: number]: string; } = {};

      v.forEach((i: any, index: number) => {
        const result = config.validate(i);
        if(result instanceof ValuaError) {
          arrErrors[index] = result.errors;
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
    validate: (v: any) => {
      return validation(v);
    },
  }
}

export {
  Valua
}