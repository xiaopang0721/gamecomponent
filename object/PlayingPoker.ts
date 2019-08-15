module gamecomponent.object {
	/**
	 * 扑克牌-不能滑动选牌
	 */
    export class PlayingPoker extends gamecomponent.object.PlayingCard {
        constructor(v?: any) {
            super(v);
        }

        public Init(v: number) {
            if (v < 1 || v > 54) {
                throw "PlayingCard v < 1 || v > 54," + v
            }
            this._val = v - 1;
            this.Analyze()
        }

        protected Analyze(): void {
            if (this._val == 52) {
                this._card_val = 100;
                this._card_color = 3;
            }
            else if (this._val == 53) {
                this._card_val = 100;
                this._card_color = 4;
            }
            else {
                this._card_val = this._val % 13;
                this._card_color = Math.floor(this._val / 13);
            }
        }

        /**
		 * 两张牌交换位置
		 */
		public exchangeCard(card: PlayingPuKeCard) {
            //重新赋值一下，其他属性不用改
            let val1 = this.GetVal();
            let val2 = card.GetVal();
            this.Init(val2);
            card.Init(val1);
		}
    }
}