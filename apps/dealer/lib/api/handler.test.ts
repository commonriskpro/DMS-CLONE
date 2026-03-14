import { sanitizeJsonInput } from "./handler";

describe("sanitizeJsonInput", () => {
  it("sanitizes strings correctly by removing non-printable chars", () => {
    expect(sanitizeJsonInput("hello\u0000world")).toBe("helloworld");
    expect(sanitizeJsonInput("line1\r\nline2")).toBe("line1\nline2");
  });

  it("sanitizes nested strings in arrays", () => {
    expect(sanitizeJsonInput(["hello\u0000world", "safe"])).toEqual(["helloworld", "safe"]);
  });

  it("sanitizes nested strings in objects", () => {
    expect(sanitizeJsonInput({ a: "hello\u0000world", b: 123 })).toEqual({ a: "helloworld", b: 123 });
  });

  it("prevents prototype pollution", () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"polluted": "yes"}, "constructor": {"prototype": {"polluted2": "yes"}}}');
    const sanitized = sanitizeJsonInput(maliciousPayload);

    // Ensure the prototype wasn't modified
    expect({}.polluted).toBeUndefined();
    expect({}.polluted2).toBeUndefined();

    // Ensure the malicious keys were stripped
    expect(Object.prototype.hasOwnProperty.call(sanitized, "__proto__")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(sanitized, "constructor")).toBe(false);
    expect(sanitized.polluted).toBeUndefined();

    // Explicitly check properties on object
    expect(Object.keys(sanitized).length).toBe(0);
  });

  it("allows normal keys", () => {
     expect(sanitizeJsonInput({ test: "data" })).toEqual({ test: "data" });
  });
});
