import * as baccarat from "../src/baccarat"
import { mkCard } from "../src/baccarat/card";
import { Baccarat } from "../src/baccarat";

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


    test("from string to baccarat 1", () => {
        const b = Baccarat.fromString("D2S3CJ#HKD2S9");
        expect(b).toBeDefined();
        const ba = b as Baccarat;
        expect(ba.isComplete()).toBe(true);
        expect(ba.bankerTotal()).toBe(1);
        expect(ba.playerTotal()).toBe(5);
        expect(ba.toString()).toBe("D2S3CJ#HKD2S9");
    })

    test("from string to baccarat 2", () => {
        const b = Baccarat.fromString("C7HT#S8S8");
        expect(b).toBeDefined();
        const ba = b as Baccarat;
        expect(ba.isComplete()).toBe(true);
        expect(ba.bankerTotal()).toBe(6);
        expect(ba.playerTotal()).toBe(7);
        expect(ba.toString()).toBe("C7HT#S8S8");
    })
});