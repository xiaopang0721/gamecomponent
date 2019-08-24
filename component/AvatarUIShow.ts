/**
* ui形象展示 
*/
module gamecomponent.component {
	export class AvatarUIShow extends Laya.Sprite {
		// 骨骼动画
		protected _skeleton: EffectSkeleton;
		constructor() {
			super();
			this.mouseEnabled = false;
		}

		/**
		 * 加载 
		 * @param fullName 完整名称
		 * 
		 */
		public loadSkeleton(path: string, x: number = 0, y: number = 0, drawHorizonal: boolean = false, completeFunc?: any): void {
			if (this._skeleton) {
				ObjectPools.free(this._skeleton);
			}
			this._skeleton = ObjectPools.malloc(EffectSkeleton) as EffectSkeleton;
			this._skeleton.scale = 1;//根据表显示缩放
			this._skeleton.enableSlot = true;
			this._skeleton.is_uiShow = true;
			this.pos(x, y);
			this._skeleton.anchorPostion = new Vector2(0, 0);
			this._skeleton.setCompleteFunc = completeFunc;
			this._skeleton.setData(path + ".sk", 2);
			this._skeleton.setLoop(true);
			this._skeleton.drawHorizonal = drawHorizonal;
			this._skeleton.build();
		}

		/**设置缩放 */
		public set SetScale(v: number) {
			if (this._skeleton)
				this._skeleton.scale = v;
		}

		/*是否播放进行中*/
		protected isActionPlaying(): Boolean {
			// TODO
			// return this._runTime < this._totalTime || this._drawInfoInvalided;
			return !this._skeleton.isPlayEnd;
		}

		public onDraw(): void {
			if (!this.visible) return;
			if (this._skeleton) {
				this._skeleton.onDraw(this.graphics, null);
				this._skeleton.parent = this;
			}
		}

		play(name: string, loop: boolean): void {
			if (this._skeleton) this._skeleton.play(name, loop)
		}

		get rotation(): number {
			return this._skeleton.armature.rotation;
		}
		set rotation(v: number) {
			if (this._skeleton.armature) this._skeleton.armature.rotation = v;
		}

		/**暂停 */
		public paused(): void {
			if (this._skeleton) this._skeleton.paused();
		}
		/**恢复 */
		public resume(): void {
			if (this._skeleton) this._skeleton.resume();
		}

		clear(dispsoe: boolean = true): void {
			if (dispsoe) {
				if (this._skeleton) {
					ObjectPools.free(this._skeleton);
				}
			}
			this._skeleton = null;
		}
	}
}