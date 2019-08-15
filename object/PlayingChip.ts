module gamecomponent.object {
	/**
	 * 筹码数据基类
	 */
    export class PlayingChip  extends gamecomponent.object.ChipBase{
        protected _type: number = 0;
        protected _val: string;
        constructor() {
            super();
        }

        //获取筹码
        public GetCardVal() {
            return this._val;
        }

        //获取筹码类型
        public GetCardType() {
            return this._type;
        }


    }
}