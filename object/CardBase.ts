/**
* name 卡牌base
*/
module gamecomponent.object {
	export class CardBase extends gamecomponent.object.ActionBase implements IAction {
		isShow: boolean;//是否显示牌面
		private _scaleX: number = 1;
		time_interval: number = 500;//发牌or翻牌时长
		constructor() {
			super()
		}

		get scaleX() {
			if (!this.isShow && this._scaleX < 0) {
				this._scaleX = -this._scaleX;
			}
			return this._scaleX;
		}

		set scaleX(v: number) {
			this._scaleX = v
		}

		update(diff: number) {

		}

		/**
		* 翻牌
		*/
		public fanpai() {
			let handle = Handler.create(this, () => {
				if (this._scaleX >= 0) {
					this.isShow = true;
				}
			}, null, false)
			if (this.isShow) return;
			this.isShow = false;
			this._scaleX = -1;
			Laya.Tween.to(this, { _scaleX: 1, update: handle }, this.time_interval, Laya.Ease.linearNone, Handler.create(this, () => {
				handle.recover();
				handle = null;
			}));
		}

		/**
		* 盖牌
		*/
		public gaipai() {
			let handle = Handler.create(this, () => {
				if (this._scaleX < 0) {
					this.isShow = false;
				}
			}, null, false)
			if (!this.isShow) return;
			this.isShow = true;
			this._scaleX = 1;
			Laya.Tween.to(this, { _scaleX: -1, update: handle }, this.time_interval, Laya.Ease.linearNone, Handler.create(this, () => {
				handle.recover();
				handle = null;
			}));
		}

        /**
         * 发牌
         */
		public fapai() {
			if (!this.targe_pos) return;
			if (!this.pos) return;
			Laya.Tween.clearAll(this.pos);
			Laya.Tween.to(this.pos, { x: this.targe_pos.x, y: this.targe_pos.y }, this.time_interval, null, Handler.create(this, () => {
				this.isFinalPos = true;
			}));
		}

		/**
		 * 整理牌
		 */
		public sort() {

		}

		public clear() {
			super.clear();
		}
	}
}