import { Rank, Card, cardArray2Str, str2CardArray, } from "./card";

const valueMap = new Map<Rank, number>([
    ["A", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["T", 0],
    ["J", 0],
    ["Q", 0],
    ["K", 0],
]);

export enum Position {
    Banker = 'B', Player = 'P'
}

export function cardValue(card: Card): number {
    const v = valueMap.get(card.rank);
    if (v === undefined) throw new Error(`no value found for card: ${card.suit}${card.rank}`);
    return v;
}

export function total(allCards: Array<Card>) {
    return allCards.reduce((total, c1) => total + cardValue(c1), 0) % 10;
}

export function restoreCards(playerCards: Array<Card>, bankerCards: Array<Card>): Array<Card> | undefined {
    const pcs = playerCards.slice().reverse();
    const bcs = bankerCards.slice().reverse();
    const pl = pcs.length;
    const bl = bcs.length;
    if ((pl === 2 || pl === 3) && (bl === 2 || bl === 3)) {
        const cards: Array<Card> = [];
        cards.push(pcs[0]);
        cards.push(bcs[0]);
        cards.push(pcs[1]);
        cards.push(bcs[1]);
        const p3 = pcs[2];
        if (p3 !== undefined) {
            cards.push(p3);
        }
        const b3 = bcs[2];
        if (b3 !== undefined) {
            cards.push(b3)
        }
        return cards;
    }
    return undefined
}
export function checkCards(playerCards: Array<Card>, bankerCards: Array<Card>): Baccarat | undefined {
    const cards = restoreCards(playerCards, bankerCards);
    if (cards !== undefined) {
        let ba = new Baccarat();
        for (const c of cards) {
            const r = ba.addCard(c);
            if (r === undefined) {
                return undefined;
            }
        }
        if (ba.isComplete) {
            return ba;
        }
    }
    return undefined;
}

function testCard(set: Set<number>, card: Card): boolean {
    return set.has(cardValue(card));
}
const bt3 = new Set([8]);
const bt4 = new Set([0, 1, 8, 9]);
const bt5 = new Set([0, 1, 2, 3, 8, 9]);
const bt6 = new Set([0, 1, 2, 3, 4, 5, 8, 9])



export class Baccarat {
    private playerCards: Array<Card>;
    private bankerCards: Array<Card>;
    private complete: boolean;
    
    private static readonly cardsSep = '#';

    constructor() {
        this.playerCards = [];
        this.bankerCards = [];
        this.complete = false;
    }

    isComplete() {
        return this.complete;
    }

    toString() {
        return `${cardArray2Str(this.playerCards)}${Baccarat.cardsSep}${cardArray2Str(this.bankerCards)}`;
    }

    static fromString(cardsStr: string): Baccarat | undefined {
        const r = cardsStr.split(Baccarat.cardsSep);
        if (r.length === 2) {
            const [pcs, bcs] = r;
            const pcards = str2CardArray(pcs);
            if (pcards !== undefined) {
                const bcards = str2CardArray(bcs);
                if (bcards !== undefined) {
                    return checkCards(pcards, bcards);
                }
            }
        }
        return undefined
    }

    bankerTotal() {
        return total(this.bankerCards);
    }

    playerTotal() {
        return total(this.playerCards)
    }

    private addBankerCard(card: Card) {
        this.bankerCards.unshift(card);
    }

    private addPlayerCard(card: Card) {
        this.playerCards.unshift(card);
    }

    addCard(card: Card): Position | undefined {
        if (this.complete) {
            return undefined;
        }
        const pl = this.playerCards.length;
        const bl = this.bankerCards.length;
        if (pl === 0 && bl === 0) {
            this.addPlayerCard(card);
            return Position.Player;
        }
        if (pl === 1 && bl === 0) {
            this.addBankerCard(card);
            return Position.Banker;
        }
        if (pl === 1 && bl === 1) {
            this.addPlayerCard(card);
            return Position.Player;
        }
        if (pl === 2 && bl === 1) {
            this.addBankerCard(card);
            const bt = this.bankerTotal();
            const pt = this.playerTotal();
            if (bt === 8 || bt === 9 || pt === 8 || pt === 9) {
                this.complete = true;
            } else if ((bt === 6 || bt === 7) && (pt === 6 || pt === 7)) {
                this.complete = true;
            }
            return Position.Banker;
        }
        if (pl === 2 && bl === 2) {
            const bt = this.bankerTotal();
            const pt = this.playerTotal();
            if (pt >= 0 && pt < 6) {
                this.addPlayerCard(card);
                if (bt === 3 && testCard(bt3, card)) {
                    this.complete = true;
                }
                if (bt === 4 && testCard(bt4, card)) {
                    this.complete = true;
                }
                if (bt === 5 && testCard(bt5, card)) {
                    this.complete = true;
                }
                if (bt === 6 && testCard(bt6, card)) {
                    this.complete = true;
                }
                return Position.Player
            }
            if (bt >= 0 && bt <= 2) {
                this.addBankerCard(card);
                this.complete = true;
                return Position.Banker
            }
        }
        if (pl === 3 && bl === 2) {
            this.addBankerCard(card);
            this.complete = true;
            return Position.Banker
        }
        return undefined;
    }
}