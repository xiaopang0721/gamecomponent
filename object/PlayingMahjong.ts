module gamecomponent.object {
	/**
	 * 扑克牌基类
	 */
    export class PlayingMahjong extends gamecomponent.object.PlayingCard {
        constructor(v?: any) {
            super(v);
        }

        public Init(v: number) {
            if (v < 1 || v > 40) {
                throw "PlayingMahjong v < 1 || v > 40," + v
            }
            this._val = v;
            this.Analyze()
        }
        protected Analyze(): void { 
			this._card_val = this._val % 10;
			if (this._card_val == 0) this._card_val = 10;
			this._card_color = Math.floor(this._val / 10);
        }

        //获取牌号
        public GetVal() {
            return this._val;
        }


    }
}