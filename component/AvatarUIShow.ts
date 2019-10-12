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
		public loadSkeleton(path: string, x: number = 0, y: number = 0, playRate: number = 1, drawHorizonal: boolean = false, completeFunc?: any): void {
			if (this._skeleton) {
				ObjectPools.free(this._skeleton);
			}
			this._skeleton = ObjectPools.malloc(EffectSkeleton) as EffectSkeleton;
			this._skeleton.scale = 1;//根据表显示缩放
			this._skeleton.enableSlot = true;
			this._skeleton.is_uiShow = true;
			this.pos(x, y);
			this._skeleton.anchorPostion = new Vector2(0, 0);
			this._skeleton.setCompleteFunc = ()=>{
				completeFunc && completeFunc();
				this._skeleton.parent = this;
			};
			this._skeleton.setData(path + ".sk", playRate);
			this._skeleton.setLoop(true);
			this._skeleton.drawHorizonal = drawHorizonal;
			this._skeleton.build();
		}

		/**设置缩放 */
		public set SetScale(v: number) {
			if (this._skeleton)
				this._skeleton.scale = v;
		}

		public set playbackRate(v: number) {
			if (this._skeleton)
				this._skeleton.playbackRate(v);
		}

		/*是否播放进行中*/
		protected isActionPlaying(): Boolean {
			// TODO
			// return this._runTime < this._totalTime || this._drawInfoInvalided;
			return !this._skeleton.isPlayEnd;
		}

		set setVisible(v: boolean) {
			this.visible = v;
			if (!this._skeleton || !this._skeleton.armature) return;
			if (v) {
				this.resume();
				this._skeleton.parent = this;
			} else {
				this._skeleton.parent = null;
				this.paused();
			}
		}

		public onDraw(): void {
			// if (!this.visible) return;
			// if (this._skeleton) {
				// this._skeleton.onDraw(this.graphics, null);
				// if (!this._skeleton.parent)
				// 	this._skeleton.parent = this;
			// }
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