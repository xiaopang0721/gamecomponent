/**
* 按钮放大变小工厂类 
*/
module utils {
	export class ScaleEffectFactory extends gamecomponent.managers.BaseMgr {

		private _list: Array<Laya.Image | Laya.Button> = [];
		private _listSelf: Array<ScaleEffect> = [];

		public add(v: Laya.Image | Laya.Button): void {
			let index = this._list.indexOf(v);
			if (index != -1) return;
			this._list.push(v);
			this._listSelf.push(new ScaleEffect(v));
		}

		public remove(v: Laya.Image | Laya.Button): void {
			let index = this._list.indexOf(v);
			if (index == -1) return;
			this.removeClear(index);
		}

		private removeClear(index: number) {
			this._list.splice(index, 1);
			if (this._listSelf[index]) {
				this._listSelf[index].destroy();
				this._listSelf[index] = null;
			}
			this._listSelf.splice(index, 1);
		}

		clear(fource?:boolean) {
			if(fource) super.clear(fource)
			for (let index = 0; index < this._list.length; index++) {
				this.removeClear(index);
			}
			this._list.length = 0;
			this._listSelf.length = 0;
		}

		update(diff: number) {
			for (let index = 0; index < this._list.length; index++) {
				let node = this._list[index];
				if (!node || !node.parent || !node.stage) {
					this.removeClear(index);
				}
			}
		}
	}

	class ScaleEffect {
		//播放分享动画
		private _img: LImage;
		private _delayFn: Function;
		private _node: Laya.Image | Laya.Button
		constructor(node: Laya.Image | Laya.Button) {
			this._node = node;
			this.playFenXiangTween();
		}

		//下次时间间隔
		private _nextTime: number = 120000;
		//开始播放
		private playFenXiangTween(isTween?: boolean) {
			if (!this._img) {
				this._img = new Laya.Image(this._node.skin);
				this._img.mouseEnabled = false;
				this._img.anchorX = this._node.anchorX;
				this._img.anchorY = this._node.anchorY;
				this._img.x = this._node.x;
				this._img.y = this._node.y;
				this._node.parent.addChild(this._img);

				this._delayFn = () => {
					this._img.visible = true;
				}
			} else {
				this._img.x = this._node.x;
				this._img.y = this._node.y;
				this._img.visible = false;
			}
			this._img.scaleX = 1;
			this._img.scaleY = 1;
			this._img.alpha = 1;
			Laya.Tween.to(this._img, { scaleY: 1.5, scaleX: 1.5, alpha: 0 }, 1000, Laya.Ease.linearNone, Handler.create(this, this.playFenXiangTween, [true]), (isTween ? this._nextTime : 0));
			isTween && Laya.timer.once(this._nextTime, this, this._delayFn)
		}

		//停止分享动画
		private stopFenXiangAni() {
			if (this._img) {
				Laya.Tween.clearAll(this._img);
				Laya.timer.clear(this, this._delayFn);
				this._img.removeSelf();
				this._img.destroy();
				this._img = null;
				this._delayFn = null;
			}
		}

		destroy() {
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
			this.stopFenXiangAni();
		}
	}
}