const IS_NOT_A_STRING_ERROR = "IS_NOT_A_STRING_ERROR";
const IS_NOT_A_NUMBER_ERROR = "IS_NOT_A_NUMBER_ERROR";
const IS_REQUIRED_ERROR = "IS_REQUIRED_ERROR";
const NOT_PASSED_TEST_ERROR = "NOT_PASSED_TEST_ERROR"
const TO_SMALL_ERROR = "TO_SMALL_ERROR"
const TO_BIG_ERROR = "TO_BIG_ERROR"
const IS_NOT_AN_ARRAY_ERROR = "IS_NOT_AN_ARRAY_ERROR"

const valuator = (validation = v => v) => {
  return {
    string: (config = {}) => valuator(v => {
      if(typeof v === "string") {
        return v
      } else {
        const err = Error(IS_NOT_A_STRING_ERROR);
        err.errors = config.error || IS_NOT_A_STRING_ERROR
        return err;
      }
    }),
    number: (config = {}) => valuator(v => {
      if(typeof v === "number") {
        return v
      } else {
        const err = Error(IS_NOT_A_NUMBER_ERROR);
        err.errors = config.error || IS_NOT_A_NUMBER_ERROR;
        return err;
      }
    }),
    min: (threshold, config = {}) => valuator(v => {
      if(v >= threshold) {
        return v;
      } else {
        const err = Error(TO_SMALL_ERROR)
        err.errors = config.error || TO_SMALL_ERROR;
        return err;
      }
    }),
    max: (threshold, config = {}) => valuator(v => {
      if(v <= threshold) {
        return v;
      } else {
        const err = Error(TO_BIG_ERROR)
        err.errors = TO_BIG_ERROR;
        return err;
      }
    }),
    object: (config) => valuator(v => {
      const objErrors = {};

      Object.keys(config).forEach(schemaKey => {
        const result = config[schemaKey].validate(v[schemaKey] || null);
        if(result instanceof Error) {
          objErrors[schemaKey] = result.errors;
        }
      })

      if(Object.keys(objErrors).length > 0) {
        const err = Error("Object errors");
        err.errors = objErrors
        return err;
      }
      return v;
    }),
    array: (config = {}) => valuator(v => {
      if(Array.isArray(v)) {
        return v;
      } else {
        const err = Error(IS_NOT_AN_ARRAY_ERROR)
        err.errors = config.error || IS_NOT_AN_ARRAY_ERROR;
        return err;
      }
    }),
    each: (config) => valuator(v => {
      const arrErrors = {};

      v.forEach((i, index) => {
        const result = config.validate(i);
        if(result instanceof Error) {
          arrErrors[index] = result.errors;
        }
      });

      if(Object.keys(arrErrors).length > 0) {
        const err = Error("Array errors");
        err.errors = arrErrors
        return err;
      }

      return v;
    }),
    required: (config = {}) => valuator(v => {
      if(v === undefined || v === null) {
        const err = Error(IS_REQUIRED_ERROR)
        err.errors = config.error || IS_REQUIRED_ERROR;
        return err;
      }
      return v;
    }),
    test: (config) => valuator(v => {
      if(config(v)) {
        return true
      } else {
        const err = Error(NOT_PASSED_TEST_ERROR);
        err.errors = NOT_PASSED_TEST_ERROR
        return err;
      }
    }),
    validate: v => {
      return validation(v);
    },
  }
}

// Simple validator

const simpleValidator = valuator()
  .number()
  .max(20);

const simpleResult = simpleValidator.validate(25)

if(simpleResult instanceof Error) {
  console.log(simpleResult.errors);
} else {
  console.log(simpleResult);
}

// Schema validator

const { 
  string,
  number,
  array,
  object,
  required,
  test
} = valuator()

const schema = object({
  name: string(),
  age: number().min(20),
  items: array().each(number().min(20)),
  something: object({
    nested: number()
  })
})

const obj = {
  name: 12,
  age:18,
  items: [10, 22, 15],
  something: {
    nested: "test"
  }
}

const result = schema.validate(obj);

if(result instanceof Error) {
  console.log(result.errors);
} else {
  console.log(result);
}