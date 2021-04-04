import { valua } from "../src/index";


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
            const schema = valua();

            expect(schema[fn]).toBeDefined();
            expect(typeof schema[fn]).toBe("function")
        })
    })
})