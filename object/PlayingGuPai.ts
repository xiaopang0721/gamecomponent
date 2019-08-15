module gamecomponent.object {
	/**
	 * 骨牌基类
	 */
    export class PlayingGuPai extends gamecomponent.object.PlayingCard {
        protected _card_config = [12, 24, 23, 14, 25, 34, 26, 35, 36, 45, 15, 16, 46, 56, 22, 33, 55, 13, 44, 11, 66];
        constructor(v?: any) {
            super(v);
        }

        public Init(v: number) {
            if (v < 1 || v > 32) {
                throw "PlayingGuPai v < 1 || v > 32," + v
            }
            this._val = v - 1;
            this.Analyze()
        }
        protected Analyze(): void {
            let val = this._val;
            if (val > 20) {
                val = this._val - 11;
            }
            this._card_val = this._card_config[val];
        }
    }
}