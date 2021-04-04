import { Valua, ValuaError, ErrorCode } from "../src/index";


describe("valua", () => {
    [
        "string",
        "number",
        "array",
        "test",
        "required",
        "validate",
        "each",
        "object",
        "min",
        "max",
        "boolean"
    ].forEach(fn => {
        it(`should expose ${fn}() function`, () => {
            const schema = Valua();

            expect(schema[fn]).toBeDefined();
            expect(typeof schema[fn]).toBe("function")
        })
    })

    describe("string() validator", () => {
        it("should validate string", () => {
            const validator = Valua().string();

            expect(validator.validate("test")).toBe("test")
        })

        it("should return IS_NOT_A_STRING_ERROR error when valu is not a string", () => {
            const validator = Valua().string();

            const result = validator.validate(30);

            expect(result instanceof ValuaError).toBe(true);
            expect(result.errors).toBe(ErrorCode.IS_NOT_A_STRING_ERROR)
        })
    })

    describe("number() validator", () => {
        it("should validate number", () => {
            const validator = Valua().number();

            expect(validator.validate(30)).toBe(30)
        })

        it("should return IS_NOT_A_NUMBER_ERROR error when valu is not a number", () => {
            const validator = Valua().number();

            const result = validator.validate("test");

            expect(result instanceof ValuaError).toBe(true);
            expect(result.errors).toBe(ErrorCode.IS_NOT_A_NUMBER_ERROR)
        })
    })
})