import { valua } from "../src/index";


describe("valua", () => {
    it("should expose string() function", () => {
        const schema = valua();

        expect(schema.string).toBeDefined();
        expect(typeof schema.string).toBe("function")
    });

    it("should expose number() function", () => {
        const schema = valua();

        expect(schema.number).toBeDefined();
        expect(typeof schema.number).toBe("function")
    });

    it("should expose array() function", () => {
        const schema = valua();

        expect(schema.array).toBeDefined();
        expect(typeof schema.array).toBe("function")
    });

    it("should expose test() function", () => {
        const schema = valua();

        expect(schema.test).toBeDefined();
        expect(typeof schema.test).toBe("function")
    });

    it("should expose required() function", () => {
        const schema = valua();

        expect(schema.required).toBeDefined();
        expect(typeof schema.required).toBe("function")
    });

    it("should expose validate() function", () => {
        const schema = valua();

        expect(schema.validate).toBeDefined();
        expect(typeof schema.validate).toBe("function")
    });

    it("should expose each() function", () => {
        const schema = valua();

        expect(schema.each).toBeDefined();
        expect(typeof schema.each).toBe("function")
    });

    it("should expose object() function", () => {
        const schema = valua();

        expect(schema.object).toBeDefined();
        expect(typeof schema.object).toBe("function")
    });

    it("should expose min() function", () => {
        const schema = valua();

        expect(schema.min).toBeDefined();
        expect(typeof schema.min).toBe("function")
    });

    it("should expose max() function", () => {
        const schema = valua();

        expect(schema.max).toBeDefined();
        expect(typeof schema.max).toBe("function")
    });
})