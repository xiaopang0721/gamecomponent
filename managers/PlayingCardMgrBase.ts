module gamecomponent.managers {
	/**
	 * 牌管理器基类
	 */
    export class PlayingCardMgrBase<T extends gamecomponent.object.PlayingCard> extends Laya.EventDispatcher implements gamecomponent.object.IAction {
        protected _cards: Array<T> = [];

        protected _game: Game;
        constructor(v: Game) {
            super();
            this._game = v;
        }

        //重新初始化牌
        Init(all_val: Array<number>, create_fun: Handler): void {
            this._cards.length = 0;
            for (let i: number = 0; i < all_val.length; i++) {
                let card: T;
                card = create_fun.run();
                card.Init(all_val[i]);
                card.index = i;
                this._cards.push(card)
            }
            create_fun.recover();
            create_fun = null;
            this.SortCards(this._cards);
        }

        //对牌进行排序
        SortCards(cards: any[]) {
            if (!cards) return;
            cards.sort((a: T, b: T) => {
                return a.Compare(b);
            });
        }
        //校验相等的牌
        CheckEqualCards(cards, start, end) {
            let len = cards instanceof Array ? cards.length : 0;
            if (len < 2)
                return false;
            if (!start) {
                console.assert(!end)
                start = 1
            }
            if (!end) {
                end = len
            }

            console.assert(end > start && start > -1 && len >= end)

            let val = cards[start - 1].GetCardVal()
            for (let i = start; i < end; i++) {
                if (cards[i].GetCardVal() != val) {
                    return false;
                }
            }

            return true;

        }

        //洗牌，max_val牌的张数，后面两个是洗牌的力度，越小洗的越乱
        Shuffle(max_val?, rand_min_val?, rand_max_val?) {
            max_val = max_val || 54;
            rand_min_val = rand_min_val || 1;
            rand_max_val = rand_max_val || 1;
            console.assert(rand_min_val <= rand_max_val)
            //先把整副牌弄出来
            let card_temp = []
            for (let i = 0; i < max_val; i++) {
                card_temp.push(new PlayingCard(i));
            }

            let result = []
            do {
                let rd = MathU.randomRange(1, card_temp.length)
                //根据随机力度，适当的让牌好看一些吧
                let rand_val = MathU.randomRange(rand_min_val, rand_max_val);
                for (let i = 0; i < rand_val; i++) {
                    if (card_temp.length == 0) {
                        break;
                    }
                    if (card_temp.length < rd) {
                        rd = 0
                    }
                    result.push(card_temp.splice(rd, 1))
                }
            } while (card_temp.length != 0)

            return result;
        }

        //校验顺子
        CheckShunZi(cards) {
            let len = cards instanceof Array ? cards.length : 0;
            if (len < 3) return false
            let val = cards[0].GetCardVal()
            for (let i = 1; i < len; i++) {
                let val2 = cards[i].GetCardVal()
                if (val2 - val != 1) {
                    return false
                }
                val = val2
            }
            return true
        }


        clear() {
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            this._game.sceneObjectMgr.clearOfflineObject();
            this._cards.length = 0;
        }

        fanpai() {
            throw new Error("not init")
        }

        fapai() {
            throw new Error("not init")
        }

        sort() {
            throw new Error("not init")
        }

    }
}