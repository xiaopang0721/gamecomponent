module gamecomponent.object {
	/**
	 * 扑克牌基类
	 */
    export class PlayingCard extends gamecomponent.object.MapInfoLogObject {
        protected _val: number = 0;
        protected _card_val: number = 0;
        protected _card_color: number = 0;
        constructor(v: any) {
            super(v);
        }

        public Init(v: number) {
            throw new Error("not init")
        }

        //获取牌号
        public GetVal() {
            return this._val + 1;
        }

        //获取牌值
        public GetCardVal() {
            return this._card_val;
        }

        //获取牌色
        public GetCardColor() {
            return this._card_color;
        }

        //比较单张牌大小
        public Compare(card: PlayingCard, compare_color = false) {
            let result = Laya.MathUtil.sortBigFirst(this.GetCardVal(), card.GetCardVal())
            if (result == 0 && compare_color) {
                result = Laya.MathUtil.sortBigFirst(this.GetCardColor(), card.GetCardColor())
            }
            return result
        }
    }
}