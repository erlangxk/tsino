import { Card, isPair } from "./card"
import { Baccarat } from "./index";


type BaccaratBetType = 'Banker' | 'Player' | 'Tie' | 'BankerPair' | 'PlayerPair' | 'Big' | 'Small' | 'PlayerNatural8' | 'PlayerNatural9' | 'BankerNatural8' | 'BankerNatural9' | 'Super6'

const allBaccaratBetTypes = new Set(['Banker', 'Player', 'Tie', 'BankerPair', 'PlayerPair', 'Big', 'Small', 'PlayerNatural8', 'PlayerNatural9', 'BankerNatural8', 'BankerNatural9', 'Super6']);

function isPair2(cards: Array<Card>) {
    if (cards.length === 2) {
        const [c1, c2] = cards;
        return isPair(c1, c2);
    }
    return false;
}

function notAllowedBetTypes(roundIndex: number): Set<BaccaratBetType> {
    const allowedMaxRoundForPair = 70;
    const allowedMaxRoundForBigSmall = 40;
    const result = new Set<BaccaratBetType>();
    if (roundIndex > allowedMaxRoundForPair) {
        result.add('PlayerPair');
        result.add('BankerPair');
    }
    if (roundIndex > allowedMaxRoundForBigSmall) {
        result.add('Big');
        result.add('Small');
    }
    return result;
}

function filterResult(roundIndex: number, result: Map<BaccaratBetType, number>) {
    const bannedBetTypes = notAllowedBetTypes(roundIndex);
    const nr = new Map<BaccaratBetType, number>();
    for (const [k, v] of result) {
        if (!bannedBetTypes.has(k)) {
            nr.set(k, v);
        }
    }
    return nr;
}

function nonCommissionResult(roundIndex: number, baccarat: Baccarat) {
    const r = result(baccarat).nonCommissionResult();
    return filterResult(roundIndex, r);
}

function commissionResult(roundIndex: number, baccarat: Baccarat) {
    const r = result(baccarat).commissionResult();
    return filterResult(roundIndex, r);
}

function result(baccarat: Baccarat) {
    const bt = baccarat.bankerTotal();
    const pt = baccarat.playerTotal();
    const isBanker6 = bt === 6;
    const totalBankerCards = baccarat.totalBankerCards()
    const totalCards = baccarat.totalCards();
    const isSmall = totalCards === 4;
    const isBig = totalCards === 5;
    const isBanker = bt > pt;
    const isPlayer = pt > bt;
    const isTie = bt === pt;
    const isBankerNatural8 = isSmall && isBanker && bt === 8;
    const isBankerNatural9 = isSmall && isBanker && bt === 9;
    const isPlayerNatural8 = isSmall && isPlayer && pt === 8;
    const isPlayerNatural9 = isSmall && isPlayer && pt === 9;
    const isSuper6 = isBanker && isBanker6;
    const isSuper62 = isSuper6 && totalBankerCards === 2
    const isSuper63 = isSuper6 && totalBankerCards === 3
    const isBankerPair = isPair2(baccarat.first2BankerCards());
    const isPlayerPair = isPair2(baccarat.first2PlayerCards());

    const result = new Map<BaccaratBetType, number>();
    if (isBankerPair) {
        result.set("BankerPair", 1 + 11);
    }
    if (isPlayerPair) {
        result.set("PlayerPair", 1 + 11);
    }
    if (isPlayerNatural8) {
        result.set("PlayerNatural8", 1 + 8);
    }
    if (isPlayerNatural9) {
        result.set("PlayerNatural9", 1 + 8);
    }
    if (isBankerNatural8) {
        result.set("BankerNatural8", 1 + 8);
    }
    if (isBankerNatural9) {
        result.set("BankerNatural9", 1 + 8);
    }
    if (isSuper62) {
        result.set("Super6", 1 + 12);
    }
    if (isSuper63) {
        result.set("Super6", 1 + 18);
    }
    if (isTie) {
        result.set("Tie", 1 + 8);
        result.set("Banker", 1 + 0);
        result.set("Player", 1 + 0);
    }
    if (isPlayer) {
        result.set("Player", 1 + 1);
    }
    if (isSmall) {
        result.set("Small", 1 + 1.5);
    }
    if (isBig) {
        result.set("Big", 1 + 0.5);
    }
    return {
        nonCommissionResult: function () {
            if (isBanker) {
                result.set("Banker", 1 + 0.95);
            }
            return result;
        },
        commissionResult: function () {
            if (isBanker) {
                const r = isBanker6 ? 0.5 : 1;
                result.set("Banker", 1 + r);
            }
            return result;
        }
    }
}