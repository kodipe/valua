import { Valua, ValuaError, ErrorCode } from "../src/index";


describe("Valua", () => {
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
        "boolean",
        "match"
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

    describe("match() validator", () => {
        it("should validate regex", () => {
            const validator = Valua().match(/^foobar$/);

            expect(validator.validate("foobar")).toBe("foobar")
        })

        it("should return NOT_MATCH_ERROR error when value not passed regex test", () => {
            const validator = Valua().match(/^foobar$/);

            const result = validator.validate("test123");

            expect(result instanceof ValuaError).toBe(true);
            expect(result.errors).toBe(ErrorCode.NOT_MATCH_ERROR)
        })
    })
})