/**
* name 
*/
module gamecomponent {
	export class SceneRoot extends gamecomponent.SceneOperator {
		//底层地图2
		protected _bottomTableMapLayer: MapFarLayer;
		//底层地图
		protected _bottomMapLayer: MapLayer;
		//底层特效层
		protected _effectMapLayer: EffectLayer;

		get avatarLayer(): gamecomponent.scene.AvatarOperator {
			return this._avatarLayer;
		}

		//记得清理
		setLayerConfigArr(value: Laya.Sprite[] = null) {
			if (this._avatarLayer)
				this._avatarLayer.setLayerConfigArr(value);
		}

		//场景字码
		get sceneFontSize(): number {
			return 24;
		}

		constructor(v: SceneGame) {
			super(v);
			//底层对象
			this._bottomTableMapLayer = new MapFarLayer(null, this);
			this._bottomTableMapLayer.mouseEnabled = false;	//开启鼠标事件
			this.mouseEnabled = true;

			//底层对象
			this._bottomMapLayer = new MapLayer(null, this);
			this._bottomMapLayer.mouseEnabled = false;	//开启鼠标事件
			this.mouseEnabled = true;

			//底层特效
			this._effectMapLayer = new EffectLayer(this);
			this._effectMapLayer.mouseEnabled = false;
			// this._effectMapLayer.blendMode = Laya.BlendMode.ADD;

			//avatar渲染器
			this._avatarLayer = new gamecomponent.scene.AvatarOperator(this);
			this._avatarLayer.mouseEnabled = true;
			// this._avatarLayer.mouseThrough = false;

			//添加到场景
			this.addChild(this._bottomTableMapLayer);
			this.addChild(this._bottomMapLayer);
			this.addChild(this._avatarLayer);
			this.addChild(this._effectMapLayer);
		}

		//对象移除
		protected onDeleteObject(obj: GuidObject) {
			super.onDeleteObject(obj);
			obj && this._avatarLayer.outLook(obj, false);
		}

		//地图传送
		protected onLoadMap(info: MapAssetInfo): void {
			super.onLoadMap(info)
			if (!this._mapid) {
				return;//无效地图id
			}
			this._bottomMapLayer.load(info);
			this._bottomTableMapLayer.load(info);
		}

		//更换地图
		public changeMap(info: MapAssetInfo): void {
			//清理地图层
			this._bottomMapLayer.clear();
			this._bottomTableMapLayer.clear();
			this._bottomMapLayer.load(info);
			this._bottomTableMapLayer.load(info);
		}

		//设置窗口大小
		resize(clientWidth: number, clientHeight: number): void {
			super.resize(clientWidth, clientHeight)
			//底图层需要设置下宽高 才能接受鼠标事件
			if (this._bottomMapLayer) {
				this._bottomMapLayer.resize(clientWidth, clientHeight);
			}
			if (this._bottomTableMapLayer) {
				this._bottomTableMapLayer.resize(clientWidth, clientHeight);
			}
			this._effectMapLayer && this._effectMapLayer.resize(clientWidth, clientHeight);
			this._avatarLayer.resize(clientWidth, clientHeight);
		}

		update(diff: number): void {
			super.update(diff);
			if (!this._mapid) {
				return;
			}
			// 更新位置 （更新摄像机之前需要先调用）
			this._avatarLayer.updateAvatarPostion(diff);
			// 摄像机心跳
			let cam: Camera = this.camera;
			cam.update();
			// 地图层心跳
			this._bottomMapLayer.setViewPortByCamera(cam);
			this._bottomTableMapLayer.setViewPortByCamera(cam);

			this._bottomMapLayer.update(diff);
			this._bottomTableMapLayer.update(diff);
			this._effectMapLayer.onDraw(diff);
			this._avatarLayer.update(diff);
			// 地图特效心跳
			this._bottomMapLayer.onDraw(diff);
			// 绘制形象
			this._avatarLayer.onDraw(diff);
		}

		/**
        * 检查逻辑坐标是否在场景里
        * @param x 
        * @param y 
        */
		checkInScene(x: number, y: number): boolean {
			let offx = Math.max(this.game.clientWidth - this._game.sceneGame.sceneObjectMgr.mapAssetInfo.logicWidth, 0) * 0.5;
			let logicWidth = this._game.sceneGame.sceneObjectMgr.mapAssetInfo.logicWidth + offx;
			let logicHeight = this._game.sceneGame.sceneObjectMgr.mapAssetInfo.logicHeight;
			return x >= -offx && x <= logicWidth && y >= 0 && y <= logicHeight;
		}

		clear(): void {
			super.clear();
			//清理地图层
			this._bottomMapLayer.clear();
			this._bottomTableMapLayer.clear();
			//清理avatar
			this._avatarLayer.clear();
			//特效
			this._effectMapLayer.clear();
		}

		// 释放
		dispose(): void {
			super.dispose();
			this.clear();
		}
	}
}