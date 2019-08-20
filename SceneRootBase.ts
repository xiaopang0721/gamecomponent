/**
* name 
*/
module gamecomponent {
	export class SceneRootBase extends Laya.Sprite {
		static readonly CARD_MARK: string = "card"//牌
		static readonly CHIP_MARK: string = "chip"//筹码
		static readonly GUPAI_MARK: string = "gupai";	//骨牌，牌九用的
		static readonly MAHJONG_MARK: string = "mahjong";	//麻将, 二八杠用的
		static readonly INLOOK: string = "inLook"//进入视图枚举
		static readonly OUTLOOK: string = "outLook"//离开视图枚举
		
		
		/*摄像机*/
		public get camera() {
			return Camera.ins;
		}
		// 摄像机焦点对象
		cameraFocus: Vector2;
		// 应用程序引用
		protected _game: Game;
		protected _mapid: string;
		get game(): Game {
			return this._game;
		}

		get mapid() {
			return this._mapid;
		}

		// 自身缩放
		selfScale: number = 1;
		scale(scaleX: number, scaleY: number, speedMode?: boolean): Sprite {
			return super.scale(scaleX * this.selfScale, scaleY * this.selfScale, speedMode);
		}

		constructor(v: SceneGame) {
			super();
			this._game = v.game;
			// 摄像机
			if (!this.camera.focusPos) {
				this.cameraFocus = new Vector2();
				this.camera.focusPos = this.cameraFocus;
			} else {
				this.cameraFocus = this.camera.focusPos;
			}

			/////////////// 事件监听 ///////////////////
			let objMgr: SceneObjectMgr = v.sceneObjectMgr;
			objMgr.on(SceneObjectMgr.__DELETE_OBJECT, this, this.onDeleteObject);
			objMgr.on(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onLoadMap);
		}

		//对象移除
		protected onDeleteObject(obj: GuidObject) {

		}

		//地图传送
		protected onLoadMap(info: MapAssetInfo): void {
			//清理对象
			this.clear();
			if (!info || !info.id) return;
			this._mapid = info.id;
		}

		//设置窗口大小
		resize(clientWidth: number, clientHeight: number): void {
			// this.camera.setSize(clientWidth, clientHeight);
			// if (this._game.sceneObjectMgr.story instanceof gamecomponent.story.StoryFishBase) {
			// 	this._game.sceneObjectMgr.story && this._game.sceneObjectMgr.story.resize(clientWidth, clientHeight);
			// }
		}

		update(diff: number): void {

		}

		/**
        * 检查逻辑坐标是否在场景里
        * @param x 
        * @param y 
        */
		checkInScene(x: number, y: number): boolean {
			let offx = Math.max(this.game.clientWidth - this._game.sceneObjectMgr.mapAssetInfo.logicWidth, 0) * 0.5;
			let logicWidth = this._game.sceneObjectMgr.mapAssetInfo.logicWidth + offx;
			let logicHeight = this._game.sceneObjectMgr.mapAssetInfo.logicHeight;
			return x >= -offx && x <= logicWidth && y >= 0 && y <= logicHeight;
		}

		clear(): void {
			this._mapid = "";
			this._game.stopMusic();
			this._game.stopAllSound();
			this.camera.clear();
			Laya.timer.clearAll(this)
			Laya.Tween.clearAll(this)
			this.offAll();
		}

		// 释放
		dispose(): void {
			this.clear();
		}
	}
}