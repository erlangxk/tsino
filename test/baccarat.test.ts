import * as baccarat from "../src/baccarat"
import { mkCard } from "../src/baccarat/card";

describe("baccarat dealing rules", () => {
    test("simple 4 cards", () => {
        const b = new baccarat.Baccarat();
        const r1 = b.addCard(mkCard('H', 'T'));
        expect(b.isComplete()).toBe(false);
        expect(r1).toBe(baccarat.Position.Player)

        const r2 = b.addCard(mkCard('H', '9'));
        expect(b.isComplete()).toBe(false);
        expect(r2).toBe(baccarat.Position.Banker)

        const r3 = b.addCard(mkCard('H', 'T'));
        expect(b.isComplete()).toBe(false);
        expect(r3).toBe(baccarat.Position.Player)

        const r4 = b.addCard(mkCard('H', 'T'));
        expect(b.isComplete()).toBe(true);
        expect(r4).toBe(baccarat.Position.Banker)
    });
});