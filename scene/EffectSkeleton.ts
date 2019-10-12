/**
* 骨骼动画特效（龙骨）  
*/
module gamecomponent.scene {
	export class EffectSkeleton extends gamecomponent.scene.Effect implements IPoolsObject {
		poolName: string = "EffectSkeleton";
		private _parent: Sprite;
		private _refTemplet: RefTemplet;
		private _armature: Skeleton;
		// 启用换装
		enableSlot: boolean = false;
		// 皮肤数据
		private _skinData: { [slot: string]: RefAsset };
		// 播放速率
		private _playRate: number = 1;
		// 动画名称
		private _playName: string = 'Stand';

		constructor() {
			super();
			this._skinData = {};
		}
		get armature(): Skeleton {
			return this._armature;
		}
		/**获取当前帧索引*/
		public get currenFrameIndex(): number {
			if (!this._armature) return 0;
			return this._armature.player.currentKeyframeIndex;
		}
		/**暂停 */
		public paused(): void {
			if (this._armature) this._armature.paused();
		}
		/**恢复 */
		public resume(): void {
			if (this._armature) this._armature.resume();
		}
		/**
		 * 进池 （相当于对象dispose函数）
		 */
		intoPool(...arg): void {
			this.reset();
		}
		/**
		 * 出池 （相当于对象初始化函数）
		 */
		outPool(...arg): void {

		}

		set parent(v: Sprite) {
			if (this._parent == v) {
				return;
			}
			this._parent = v;
			this._parent.addChildAt(this._armature, 0);
		}

		private _completeFunc: any;
		set setCompleteFunc(func: any) {
			this._completeFunc = func;
		}

		// 尽量在设置动画数据时先设置
		setLoop(v: boolean) {
			super.setLoop(v);
			if (this._armature) {
				this._armature.play(0, this._loop);
			}
		}

		set drawHorizonal(v: boolean) {
			this._drawHorizonal = v;
			if (this._armature) this._armature.scale(this._drawHorizonal ? this._scale * -1 : this._scale, this._scale);
		}

		// 设置数据 playRate动画播放速率1为标准速率
		setData(ani: string, playRate: number = 1): void {
			super.setData(ani, playRate);
		}

		build(): void {
			if (this._refTemplet) {
				return;
			}
			this._refTemplet = RefTemplet.Get(this._data);
			this._refTemplet.retain();
			if (this._refTemplet.parseComplete) {
				Laya.timer.callLater(this, this.buildArmature);
			}
			else {
				this._refTemplet.on(LEvent.COMPLETE, this, this.buildArmature);
			}
		}

		private buildArmature(): void {
			if (!this._refTemplet) {
				return;
			}
			Laya.timer.clearAll(this);
			this._refTemplet.off(LEvent.COMPLETE, this, this.buildArmature);
			this._armature = this._refTemplet.buildArmature(0);//启用换装
			this._armature.playbackRate(this._fps);
			this._armature.scale(this._drawHorizonal ? this._scale * -1 : this._scale, this._scale);
			this._armature.play(this._playName, this._loop, false);
			if (this._completeFunc)
				this._completeFunc();
		}

		// 设置皮肤
		setSkin(slot: string, skin: string) {
			let curRes = this._skinData[slot];
			if (curRes) {
				if (curRes.url == skin) {
					// 一样的
					return;
				}
				// 老的
				this._skinData[slot] = null;
				curRes.release();
			}
			if (skin == null || skin.length == 0) {
				return;
			}
			// 新的
			curRes = RefAsset.Get(skin);
			curRes.retain();
			this._skinData[slot] = curRes;
			if (!curRes.parseComplete) {
				curRes.once(LEvent.COMPLETE, this, () => {
					this.__setSkin(slot);
				});
			}
			else {
				this.__setSkin(slot);
			}
		}

		private __setSkin(slot: string) {
			if (!this._armature) {
				return;
			}
			let res = this._skinData[slot];
			if (!res || !res.parseComplete) {
				return;
			}
			this._armature.setSlotSkin(slot, Laya.loader.getRes(res.url));
		}

		private _skinIndex: number = 0;
		/**设置某插槽的皮肤 */
		public showSlotSkinByIndex(slotName: string, index: number): void {
			if (this._skinIndex == index) return;
			if (this._armature) {
				this._armature.showSlotSkinByIndex(slotName, index);
				this._skinIndex = index;
			}
		}

		play(name: string, loop: boolean): void {
			this._playName = name;
			this.setLoop(loop);
			if (!this._armature) {
				return;
			}
			// this._armature.play(this._playName, this._loop, false, Laya.timer.currTimer - this._startTime);
			this._armature.playbackRate(this._fps);
			this._armature.play(this._playName, this._loop, false, 0);
			this.isPlayEnd = false;
		}

		playbackRate(playRate) {
			if (this._fps == playRate)
				return;
			this._fps = playRate;
			this._armature.playbackRate(this._fps);
		}

		// 绘制
		onDraw(g: Graphics, camera: Camera): void {
			if (!this._armature || this._armature.parent == this._parent)
				return;
			if (this.isPlayEnd) {
				this.updataPos(camera);
				return;
			}
			if (!this._loop && this._armature.player.state == 0) {
				this.isPlayEnd = true;
				return;
			}
			if (!this._parent) {
				this._armature.parent && this._armature.removeSelf();
				return;
			}
			this.updataPos(camera);
		}
		private updataPos(camera: Camera): void {
			if (!this._armature) return;
			this.updateTransform(camera);
			if (isNaN(this._drawX) || isNaN(this._drawY)) {
				return;
			}
			this._armature.x = this._drawX;
			this._armature.y = this._drawY;
			this._armature.parent != this._parent && this._parent.addChildAt(this._armature, 0);
		}

		reset(): void {
			parent = null;
			this._parent = null;
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
			if (this._refTemplet) {
				this._refTemplet.off(LEvent.COMPLETE, this, this.buildArmature);
				this._refTemplet.release();
				this._refTemplet = null;
			}
			if (this._armature) {
				this._armature.destroy(true);
				this._armature = null;
			}
			Laya.timer.clear(this, this.buildArmature);
			for (let slot in this._skinData) {
				let res = this._skinData[slot];
				res.release();
				this._skinData[slot] = null;
			}
			this._playName = "Stand";
			this._skinIndex = 0;
			super.reset();
		}
	}
}