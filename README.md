# Valua

## Install

`npm install -S valua`

## Usage

## Validators

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

### Simple validator

```js
import { Valua } from "valua";

const validator = Valua().string();

validator.validate("string");
```
### Complex validator for objects

```js
import { Valua } form "valua";

const validator = Valua().object({
    name: Valua().string(),
    age: Valua().number()
})

validator.validate({
    name: "John",
    age: 25
})
```