const vlad = (validation = v => v) => {
  return {
    string: (config) => vlad(v => {
      if(typeof v === "string") {
        return v
      } else {
        const err = Error("Its not a string");
        err.errors = "Its not a string"
        return err;
      }
    }),
    number: (config) => vlad(v => {
      if(typeof v === "number") {
        return v
      } else {
        const err = Error("Its not a number");
        err.errors = "Its not a number";
        return err;
      }
    }),
    min: (config) => vlad(v => {
      if(v >= config) {
        return v;
      } else {
        const err = Error("To small number")
        err.errors = "To small number";
        return err;
      }
    }),
    max: (config) => vlad(v => {
      if(v <= config) {
        return v;
      } else {
        const err = Error("To big number")
        err.errors = "To big number";
        return err;
      }
    }),
    object: (config) => vlad(v => {
      const objErrors = {};

      Object.keys(config).forEach(schemaKey => {
        const result = config[schemaKey].validate(v[schemaKey] || null);
        if(result instanceof Error) {
          objErrors[schemaKey] = result.errors;
        }
      })

      if(Object.keys(objErrors).length > 0) {
        const err = Error("Object error");
        err.errors = objErrors
        return err;
      }
      return v;
    }),
    array: (config) => vlad(v => {
      if(Array.isArray(v)) {
        return v;
      } else {
        const err = Error("It's not an array")
        err.errors = "It's not an array";
        return err;
      }
    }),
    each: (config) => vlad(v => {
      const arrErrors = {};

      v.forEach((i, index) => {
        const result = config.validate(i);
        if(result instanceof Error) {
          arrErrors[index] = result.errors;
        }
      });

      if(Object.keys(arrErrors).length > 0) {
        const err = Error("Array error");
        err.errors = arrErrors
        return err;
      }

      return v;
    }),
    required: (config) => vlad(v => {
      if(v === undefined || v === null) {
        const err = Error("Is required")
        err.errors = "Is required";
        return err;
      }
      return v;
    }),
    test: (config) => vlad(v => {
      if(config(v)) {
        return true
      } else {
        const err = Error("Not passed test");
        err.errors = "Not passed test"
        return err;
      }
    }),
    validate: v => {
      return validation(v);
    },
  }
}

// Simple validator

const simpleValidator = vlad()
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
} = vlad()

const schema = object({
  name: string(),
  age: number().min(20),
  items: array().each(number()),
  something: object({
    nested: number()
  })
})

const obj = {
  name: "John",
  age:18,
  items: [10, 12, "TEST"],
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