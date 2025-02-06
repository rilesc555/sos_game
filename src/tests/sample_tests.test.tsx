import { expect, test, describe } from "bun:test";

function sum(a: number, b: number) {
    return a + b;
}
// fibonacci with recursion and memoization
function fibonacci(n: number, memo: number[] = []): number {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (memo[n]) return memo[n];
    return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
}

describe("sum", () => {
    test("1 + 1", () => {
        expect(sum(1, 1)).toBe(2);
    });
});

describe("fibonacci", () => {
    test("fibonacci(0)", () => {
        expect(fibonacci(0)).toBe(0);
    });
    test("fibonacci(1)", () => {
        expect(fibonacci(1)).toBe(1);
    });

    test("fibonacci(5)", () => {
        expect(fibonacci(5)).toBe(5);
    });

    test("fibonacci(7)", () => {
        expect(fibonacci(7)).toBe(13);
    });
});