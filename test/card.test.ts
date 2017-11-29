
import * as card from "../src/baccarat/card";

describe("baccarat dealing rules", () => {
    const DT = card.mkCard('D', 'T');
    const HJ = card.mkCard('H', 'J');
    test("card2Str", () => {
        expect(card.card2Str(DT)).toBe('DT');
    });

    test("cardArray2Str", () => {
        const sarr = [DT,HJ];
        expect(card.cardArray2Str(sarr)).toBe('DTHJ');
        expect(card.cardArray2Str(sarr.reverse())).toBe('HJDT');
    });

    test('str2Card', () => {
        const c = card.str2Card('DT');
        expect(card.isEqual(c, DT)).toBe(true);
        expect(card.isEqual(c, card.mkCard('S', 'T'))).toBe(false);
    });

    test('string2StrArray', () => {
        const r1 = card.string2StrArray('');
        expect(r1).toBe(undefined);

        const r2 = card.string2StrArray('A');
        expect(r2).toBe(undefined);

        const r3 = card.string2StrArray('AB');
        expect(r3).toEqual(['AB']);

        const r4 = card.string2StrArray('ABC');
        expect(r4).toBe(undefined);

        const r5 = card.string2StrArray('ABCD');
        expect(r5).toEqual(['AB', 'CD']);
    });

    test('strArray2Cards', () => {
        const r1 = card.strArray2CardArray(['HJ', 'S7', 'S7']);
        expect(r1).toEqual([
            { suit: 'H', rank: 'J' },
            { suit: 'S', rank: '7' },
            { suit: 'S', rank: '7' }]);

        const r2 = card.strArray2CardArray(['XJ', 'S7', 'S7']);
        expect(r2).toBe(undefined);
    });


    
    test('str2CardArray', () => {
        const r1 = card.str2CardArray('HJS7S7');
        expect(r1).toEqual([
            { suit: 'H', rank: 'J' },
            { suit: 'S', rank: '7' },
            { suit: 'S', rank: '7' }]);

        const r2 = card.str2CardArray('XJS7S7');
        expect(r2).toBe(undefined);
    });
});