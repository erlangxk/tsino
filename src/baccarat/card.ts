export type Suit = "S" | "H" | "C" | "D";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K";

export const allSuits = new Set(['S', 'H', 'C', 'D']);
export const allRanks = new Set(["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]);

export interface Card {
    suit: Suit;
    rank: Rank;
}

export function mkCard(suit: Suit, rank: Rank): Card {
    return ({ suit, rank });
}

export function equals(c1: Card | undefined, c2: Card | undefined): boolean {
    return c1 !== undefined && c2 != undefined && c1.suit === c2.suit && c1.rank === c2.rank;
}

export function card2Str(card: Card) {
    return `${card.suit}${card.rank}`;
}

export function cardArray2Str(cards: Array<Card>) {
    return cards.map(c => card2Str(c)).join('');
}

export function str2Card(str: String): Card | undefined {
    if (str.length === 2) {
        const [s, r] = str;
        if (allSuits.has(s) && allRanks.has(r)) {
            return mkCard(s as Suit, r as Rank);
        }
    }
    return undefined;
}

export function strArray2CardArray(strs: Array<string>): Array<Card> | undefined {
    const r: Array<Card> = [];
    for (const s of strs) {
        const c = str2Card(s);
        if (c !== undefined) {
            r.push(c);
            continue;
        }
        return undefined;
    }
    return r;
}

export function string2StrArray(str: string): Array<string> | undefined {
    const sl = str.length;
    if (sl > 0 && sl % 2 === 0) {
        const r: Array<string> = [];
        let index = 0;
        while (index <= str.length - 2) {
            r.push(str.substr(index, 2));
            index += 2;
        }
        return r;
    }
    return undefined;
}

export function str2CardArray(str: string): Array<Card> | undefined {
    const r1 = string2StrArray(str);
    if (r1 !== undefined) {
        return strArray2CardArray(r1);
    }
    return undefined;
}
