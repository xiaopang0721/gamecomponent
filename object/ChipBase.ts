module gamecomponent.object {
	/**
	 * 筹码行为基类
	 */
	export class ChipBase extends gamecomponent.object.ActionBase {
		constructor() {
			super();
		}

		/**
		* 扔筹码
		*/
		public sendChip() {
			if(this.isCanClear) return;//如果可以清理，则不接受任何缓动回调
			if(!this.pos) return;
			Laya.Tween.clearAll(this.pos);
			Laya.Tween.to(this.pos, { x: this.targe_pos.x, y: this.targe_pos.y }, 500, Laya.Ease.circInOut, Handler.create(this, () => {
				this.isFinalPos = true;
			}));
		}

	}
}