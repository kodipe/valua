# Valua

## Install

`npm install -S valua`

## Usage

### Validators

* `Valua().string()`
* `Valua().number()`
* `Valua().boolean()`
* `Valua().min()`
* `Valua().max()`
* `Valua().array()`
* `Valua().object()`
* `Valua().each()`
* `Valua().required()`
* `Valua().test()`
* `Valua().match()`

### Built-in validator

```js
import { Valua } from "valua";

const validator = Valua().string();

validator.validate("example string").isValid(); // true
```

### Object validator

```js
import { Valua } from "valua";

const validator = Valua().object({
    name: Valua().string(),
    age: Valua().number()
})

validator.validate({
    name: "John",
    age: 25
}).isValid() // true
```

### Array validator

```js
import { Valua } from "valua";

const validator = Valua().array().each(
    Valua().number().min(10)
)

validator.validate([
    12, 
    16, 
    11
]).isValid() // true
```