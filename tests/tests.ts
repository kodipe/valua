import { valuator, ValuatorError } from "../src/index";

// Simple validator

const simpleValidator = valuator()
  .number()
  .max(20);

const simpleResult = simpleValidator.validate(25)

if(simpleResult instanceof ValuatorError) {
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

if(result instanceof ValuatorError) {
  console.log(result.errors);
} else {
  console.log(result);
}