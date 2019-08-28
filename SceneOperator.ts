/**
* name 鼠标操作
*/
module gamecomponent {
	export class SceneOperator extends gamecomponent.SceneRootBase {

		static readonly AVATAR_MOUSE_CLICK_HIT: string = 'SceneRoot.AVATAR_MOUSE_CLICK_HIT';
		static readonly AVATAR_MOUSE_MOVE_HIT: string = "SceneRoot.AVATAR_MOUSE_MOVE_HIT";	//滑动选牌
		static readonly AVATAR_MOUSE_UP_HIT: string = "SceneRoot.AVATAR_MOUSE_UP_HIT";	//滑动选牌 单张弹起
		static readonly AVATAR_MOUSE_UP_HIT_ALL: string = "SceneRoot.AVATAR_MOUSE_UP_HIT_ALL";	//滑动选牌 全选弹起

		static MOUSE_CLICK: string = "SceneRoot.MOUSE_CLICK";//鼠标点击事件
		static MOUSE_DOWN: string = "SceneRoot.MOUSE_DOWN";//鼠标按下事件
		static MOUSE_MOVE: string = "SceneRoot.MOUSE_MOVE";//鼠标滑动事件
		static MOUSE_UP: string = "SceneRoot.MOUSE_UP";//鼠标弹起事件

		private _selectLineLayer: Sprite = null;
		private _isDragSelect: boolean;
		private _preMousePos: Point;
		private _preMyPos: Point;

		private _isMouseDown: boolean;

		//avatar层
		protected _avatarLayer: gamecomponent.scene.AvatarOperator;

		constructor(v: SceneGame) {
			super(v)
			this._selectLineLayer = new Sprite()
			this.addChild(this._selectLineLayer);
			this._preMousePos = new Point();
			this._preMyPos = new Point();
		}

		// 鼠标按下事件
		onMouseDown(e: LEvent): void {
			if (!this._mapid) return;
			this.event(SceneOperator.MOUSE_DOWN, e);
			if (this._isMouseDown) return;
			this._isMouseDown = true;
			this._preMousePos.setTo(Laya.stage.mouseX, Laya.stage.mouseY);
			this._preMyPos.setTo(this.mouseX, this.mouseY);
			this._isDragSelect = false;
			// this._selectLineLayer.graphics.clear();
		}

		//鼠标滑动事件
		onMouseMove(e: LEvent): void {
			if (!this._mapid) return;
			this.event(SceneOperator.MOUSE_MOVE, e);
			if (!this._isMouseDown) return;
			if (this._isDragSelect) {
				// this._selectLineLayer.graphics.clear();
				// this._selectLineLayer.graphics.drawRect(this._preMyPos.x, this._preMyPos.y, this.mouseX - this._preMyPos.x, this.mouseY - this._preMyPos.y, null, "#ff0000");
				let rect = Laya.Rectangle._getBoundPointS(this._preMyPos.x, this._preMyPos.y, this.mouseX - this._preMyPos.x, (this.mouseY - this._preMyPos.y) || 1)
				rect && this.onMouseAreaMove(rect)
			} else {
				if (Math.abs(this._preMousePos.x - Laya.stage.mouseX) + Math.abs(this._preMousePos.y - Laya.stage.mouseY) > 5) {
					this._isDragSelect = true;
				}
			}
		}

		// 鼠标弹起事件
		onMouseUp(e: LEvent): void {
			if (!this._mapid) return;
			this.event(SceneOperator.MOUSE_UP, e);
			if (!this._isMouseDown) return;
			this._isMouseDown = false;
			if (this._isDragSelect) {
				this._isDragSelect = false;
				// this._selectLineLayer.graphics.clear();
				let rect = Laya.Rectangle._getBoundPointS(this._preMyPos.x, this._preMyPos.y, this.mouseX - this._preMyPos.x, (this.mouseY - this._preMyPos.y) || 1)
				rect && this.onMouseAreaUp(rect)
			} else {
				this.onMouseClick(e);
			}
		}

		// 鼠标点击事件
		protected onMouseClick(e: LEvent): void {
			if (!this._mapid) return;
			let mouseX = this.camera.getCellXByScene(e.stageX / this.scaleX);
			let mouseY = this.camera.getCellYByScene(e.stageY / this.scaleY);
			this._avatarLayer.onMouseClick(mouseX, mouseY);
		}

		/**
		 * 鼠标区域弹起
		 */
		private onMouseAreaUp(area: Array<number>): void | boolean {
			for (let index = 0; index < area.length / 2; index++) {
				area[2 * index] = this.camera.getCellXByScene(area[2 * index])
				area[2 * index + 1] = this.camera.getCellYByScene(area[2 * index + 1])
			}

			this._avatarLayer.onMouseAreaUp(area)
		}


		/**
		 * 鼠标区域移动
		 */
		private onMouseAreaMove(area: Array<number>): void | boolean {
			for (let index = 0; index < area.length / 2; index++) {
				area[2 * index] = this.camera.getCellXByScene(area[2 * index])
				area[2 * index + 1] = this.camera.getCellYByScene(area[2 * index + 1])
			}

			this._avatarLayer.onMouseAreaMove(area)
		}

	}
}