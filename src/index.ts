const IS_NOT_A_STRING_ERROR = "IS_NOT_A_STRING_ERROR";
const IS_NOT_A_NUMBER_ERROR = "IS_NOT_A_NUMBER_ERROR";
const IS_REQUIRED_ERROR = "IS_REQUIRED_ERROR";
const NOT_PASSED_TEST_ERROR = "NOT_PASSED_TEST_ERROR"
const TO_SMALL_ERROR = "TO_SMALL_ERROR"
const TO_BIG_ERROR = "TO_BIG_ERROR"
const IS_NOT_AN_ARRAY_ERROR = "IS_NOT_AN_ARRAY_ERROR"

class ValuaError extends Error {
  errors: any;

  constructor(m: string) {
      super(m);
      Object.setPrototypeOf(this, ValuaError.prototype);
  }
}

class ValidatorConfig {
  error?: string
}

const valua = (validation = (v: any) => v) => {
  return {
    string: (config: ValidatorConfig = {}) => valua((v: any) => {
      if(typeof v === "string") {
        return v
      } else {
        const err = new ValuaError(IS_NOT_A_STRING_ERROR);
        err.errors = config.error || IS_NOT_A_STRING_ERROR
        return err;
      }
    }),
    number: (config: ValidatorConfig = {}) => valua((v: any) => {
      if(typeof v === "number") {
        return v
      } else {
        const err = new ValuaError(IS_NOT_A_NUMBER_ERROR);
        err.errors = config.error || IS_NOT_A_NUMBER_ERROR;
        return err;
      }
    }),
    min: (threshold: number, config: ValidatorConfig = {}) => valua((v: any) => {
      if(v >= threshold) {
        return v;
      } else {
        const err = new ValuaError(TO_SMALL_ERROR)
        err.errors = config.error || TO_SMALL_ERROR;
        return err;
      }
    }),
    max: (threshold: number, config = {}) => valua((v: any) => {
      if(v <= threshold) {
        return v;
      } else {
        const err = new ValuaError(TO_BIG_ERROR)
        err.errors = TO_BIG_ERROR;
        return err;
      }
    }),
    object: (config: { [key: string]: any; }) => valua((v: any) => {
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
    array: (config: ValidatorConfig = {}) => valua((v: any) => {
      if(Array.isArray(v)) {
        return v;
      } else {
        const err = new ValuaError(IS_NOT_AN_ARRAY_ERROR)
        err.errors = config.error || IS_NOT_AN_ARRAY_ERROR;
        return err;
      }
    }),
    each: (config: any) => valua((v: any) => {
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
    required: (config: ValidatorConfig = {}) => valua((v: any) => {
      if(v === undefined || v === null) {
        const err = new ValuaError(IS_REQUIRED_ERROR)
        err.errors = config.error || IS_REQUIRED_ERROR;
        return err;
      }
      return v;
    }),
    test: (test: (v: any) => any, config: ValidatorConfig = {}) => valua((v: any) => {
      if(test(v)) {
        return true
      } else {
        const err = new ValuaError(NOT_PASSED_TEST_ERROR);
        err.errors = config.error || NOT_PASSED_TEST_ERROR
        return err;
      }
    }),
    validate: (v: any) => {
      return validation(v);
    },
  }
}

export {
  valua,
  ValuaError
}