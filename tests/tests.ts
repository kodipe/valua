import { valua, ValuaError } from "../src/index";

// Simple validator

const simpleValidator = valua()
  .number()
  .max(20);

const simpleResult = simpleValidator.validate(25)

if(simpleResult instanceof ValuaError) {
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
} = valua()

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

if(result instanceof ValuaError) {
  console.log(result.errors);
} else {
  console.log(result);
}