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
			if (this.isCanClear) return;//如果可以清理，则不接受任何缓动回调
			if (!this.pos) return;
			this.isUIShow = true;
			Laya.Tween.clearAll(this.pos);
			Laya.Tween.clearAll(this);
			this.scaleX = 1.4;
			this.scaleY = 1.4;
			let rotateAngle = this.rotateAngle + 5;
			Laya.Tween.to(this.pos, { x: this.targe_pos.x, y: this.targe_pos.y }, 500, Laya.Ease.circInOut, Handler.create(this, () => {
				this.isUIShow = false;
				this.isFinalPos = true;
				Laya.Tween.to(this, { scaleX: 1.4, scaleY: 1.4 }, 300, Laya.Ease.circInOut)
			}));
			Laya.Tween.to(this, { scaleX: 1.55, scaleY: 1.55 }, 500, Laya.Ease.circInOut)
			Laya.timer.once(300, this, () => {
				Laya.Tween.to(this, { rotateAngle: rotateAngle }, 500, Laya.Ease.circInOut)
			})
		}

		/**
		 * 筹码飞到指定位置
		 */
		public flyChipBase(time: number, game?: Game) {
			this.isUIShow = true;
			Laya.Tween.clearAll(this);
			Laya.Tween.clearAll(this.pos);
			Laya.Tween.to(this, { scaleX: 1.55, scaleY: 1.55 }, 300, Laya.Ease.circInOut, Handler.create(this, () => {
				Laya.Tween.to(this.pos, { x: this.targe_pos.x, y: this.targe_pos.y, scaleX: 1.4, scaleY: 1.4 }, time, Laya.Ease.backIn, Handler.create(this, () => {
					this.isFinalPos = true;
					game ? game.sceneObjectMgr.clearOfflineObject(this) : main.game && main.game.sceneObjectMgr.clearOfflineObject(this);
				}));
			}))
		}
	}
}