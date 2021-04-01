const IS_NOT_A_STRING_ERROR = "IS_NOT_A_STRING_ERROR";
const IS_NOT_A_NUMBER_ERROR = "IS_NOT_A_NUMBER_ERROR";
const IS_REQUIRED_ERROR = "IS_REQUIRED_ERROR";
const NOT_PASSED_TEST_ERROR = "NOT_PASSED_TEST_ERROR"
const TO_SMALL_ERROR = "TO_SMALL_ERROR"
const TO_BIG_ERROR = "TO_BIG_ERROR"
const IS_NOT_AN_ARRAY_ERROR = "IS_NOT_AN_ARRAY_ERROR"

class ValuatorError extends Error {
  errors: any;

  constructor(m: string) {
      super(m);
      Object.setPrototypeOf(this, ValuatorError.prototype);
  }
}

class ValidatorConfig {
  error?: string
}

const valuator = (validation = (v: any) => v) => {
  return {
    string: (config: ValidatorConfig = {}) => valuator((v: any) => {
      if(typeof v === "string") {
        return v
      } else {
        const err = new ValuatorError(IS_NOT_A_STRING_ERROR);
        err.errors = config.error || IS_NOT_A_STRING_ERROR
        return err;
      }
    }),
    number: (config: ValidatorConfig = {}) => valuator((v: any) => {
      if(typeof v === "number") {
        return v
      } else {
        const err = new ValuatorError(IS_NOT_A_NUMBER_ERROR);
        err.errors = config.error || IS_NOT_A_NUMBER_ERROR;
        return err;
      }
    }),
    min: (threshold: number, config: ValidatorConfig = {}) => valuator((v: any) => {
      if(v >= threshold) {
        return v;
      } else {
        const err = new ValuatorError(TO_SMALL_ERROR)
        err.errors = config.error || TO_SMALL_ERROR;
        return err;
      }
    }),
    max: (threshold: number, config = {}) => valuator((v: any) => {
      if(v <= threshold) {
        return v;
      } else {
        const err = new ValuatorError(TO_BIG_ERROR)
        err.errors = TO_BIG_ERROR;
        return err;
      }
    }),
    object: (config: { [key: string]: any; }) => valuator((v: any) => {
      const objErrors: { [key: string]: string; } = {};

      Object.keys(config).forEach((schemaKey: string) => {
        const result = config[schemaKey].validate(v[schemaKey] || null);
        if(result instanceof ValuatorError) {
          objErrors[schemaKey] = result.errors;
        }
      })

      if(Object.keys(objErrors).length > 0) {
        const err = new ValuatorError("Object errors");
        err.errors = objErrors
        return err;
      }
      return v;
    }),
    array: (config: ValidatorConfig = {}) => valuator((v: any) => {
      if(Array.isArray(v)) {
        return v;
      } else {
        const err = new ValuatorError(IS_NOT_AN_ARRAY_ERROR)
        err.errors = config.error || IS_NOT_AN_ARRAY_ERROR;
        return err;
      }
    }),
    each: (config: any) => valuator((v: any) => {
      const arrErrors: { [key: number]: string; } = {};

      v.forEach((i: any, index: number) => {
        const result = config.validate(i);
        if(result instanceof ValuatorError) {
          arrErrors[index] = result.errors;
        }
      });

      if(Object.keys(arrErrors).length > 0) {
        const err = new ValuatorError("Array errors");
        err.errors = arrErrors
        return err;
      }

      return v;
    }),
    required: (config: ValidatorConfig = {}) => valuator((v: any) => {
      if(v === undefined || v === null) {
        const err = new ValuatorError(IS_REQUIRED_ERROR)
        err.errors = config.error || IS_REQUIRED_ERROR;
        return err;
      }
      return v;
    }),
    test: (test: (v: any) => any, config: ValidatorConfig = {}) => valuator((v: any) => {
      if(test(v)) {
        return true
      } else {
        const err = new ValuatorError(NOT_PASSED_TEST_ERROR);
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
  valuator,
  ValuatorError
}