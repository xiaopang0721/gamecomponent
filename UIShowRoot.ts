/**
* name 
*/
module gamecomponent {
	export class UIShowRoot extends gamecomponent.SceneOperator {
		constructor(v: SceneGame) {
			super(v);
			this._avatarLayer = new AvatarOperator(this);
			this._avatarLayer.mouseEnabled = true;
			this.addChild(this._avatarLayer);
		}

		// 鼠标按下事件
		protected onMouseClick(e: LEvent): void {
			if (!this._mapid || this.mapid == "buyu") {
				return;
			}

			super.onMouseClick(e);
		}

		//对象移除
		protected onDeleteObject(obj: GuidObject) {
			super.onDeleteObject(obj);
			if (!this._mapid || this.mapid == "buyu") {
				return;
			}
			obj && this._avatarLayer.outLook(obj, false);
		}

		//设置窗口大小
		resize(clientWidth: number, clientHeight: number): void {
			super.resize(clientWidth, clientHeight)
			if (!this._mapid || this.mapid == "buyu") {
				return;
			}
			//底图层需要设置下宽高 才能接受鼠标事件
			this._avatarLayer && this._avatarLayer.resize(clientWidth, clientHeight);
		}

		update(diff: number): void {
			super.update(diff);
			if (!this._mapid || this.mapid == "buyu") {
				return;
			}
			// 更新位置 （更新摄像机之前需要先调用）
			this._avatarLayer.updateAvatarPostion(diff);
			// 摄像机心跳
			let cam: Camera = this.camera;
			cam.update();
			this._avatarLayer.update(diff);
			// 绘制形象
			this._avatarLayer.onDraw(diff);
		}

		//地图传送
		protected onLoadMap(info: MapAssetInfo): void {
			super.onLoadMap(info);
			if (!this.mapid || this.mapid == "buyu") {
				if (this._avatarLayer) {
					this._avatarLayer.removeSelf();
					this._avatarLayer.clear();
					this._avatarLayer.destroy();
					this._avatarLayer = null;
				}
			} else {
				if (!this._avatarLayer) {
					this._avatarLayer = new gamecomponent.scene.AvatarOperator(this);
					this._avatarLayer.mouseEnabled = true;
					this._avatarLayer.mouseThrough = true;
					this.addChild(this._avatarLayer);
				}
			}
		}

		//鼠标滑动事件
		onMouseMove(e: LEvent): void {
			if (!this.mapid || this.mapid == "buyu") return;
			super.onMouseMove(e);
		}

		//鼠标滑动事件
		onMouseDown(e: LEvent): void {
			if (!this.mapid || this.mapid == "buyu") return;
			super.onMouseDown(e);
		}

		//鼠标滑动事件
		onMouseUp(e: LEvent): void {
			if (!this.mapid || this.mapid == "buyu") return;
			super.onMouseUp(e);
		}

		clear(): void {
			super.clear();
			//清理avatar
			this._avatarLayer && this._avatarLayer.clear();
		}

		// 释放
		dispose(): void {
			super.dispose();
			this.clear();
		}
	}
}