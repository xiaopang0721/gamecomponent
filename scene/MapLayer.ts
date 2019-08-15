module gamecomponent.scene {
	export class MapLayer extends game.base.Container {
		static MAP_LOAD_COMPLETE: string = 'MAP_LOAD_COMPLETE';
		private _info: MapAssetInfo;

		// 层级视口区域
		protected _viewPort: Rectangle;

		private _mapImageAsset: RefAsset;
		private _mapTexture: Texture;
		private _partWidth: number;
		private _partHeight: number;
		private _scene: SceneRoot;

		private _camera: Camera;

		protected _clientWidth: number;
		protected _clientHeight: number;
		protected _clientRealWidth: number;
		protected _clientRealHeight: number;
		// 应用程序引用
		protected _game: Game;

		constructor(txe: Texture, v: SceneRoot) {
			super(v.game);
			this._game = v.game;
			this._scene = v;
			this._viewPort = new Rectangle();

			this._bottomLayer = new Sprite();
			this._bottomLayer.mouseEnabled = false;
			this.addChild(this._bottomLayer);
		}

		load(info: MapAssetInfo): void {
			if (this._mapTexture) {
				this._mapTexture = null;
			}
			this._info = info;
			this._scene.camera.setMapSize(info.pxWidth, info.pxHeight);
			this._scene.cameraFocus.x = info.logicWidth / 2;
			this._scene.cameraFocus.y = info.logicHeight / 2;

			let imgid = this._info.imgId;
			if (!imgid) {
				imgid = this._info.id;
			}
			let url = StringU.substitute("{0}pz_{1}.png",CompoentPath.map,imgid);
			let refAsset = RefAsset.Get(url);
			this._mapImageAsset = refAsset;
			refAsset.retain();
			if (!refAsset.parseComplete) {
				refAsset.once(LEvent.COMPLETE, this, () => {
					this.onLoadComplete(Laya.loader.getRes(url));
				});
			}
			else {
				this.onLoadComplete(Laya.loader.getRes(url));
			}
		}
		
		private onLoadComplete(txe: Texture) {
			if(!txe) 
			{

				return;
			}
			this._partWidth = txe.width;
			this._partHeight = txe.height;
			if(this._partWidth >= 1280 && this._partHeight >= 720)
			{
				this._mapTexture = txe;
			}else{
				this._mapTexture = null;
			}
			this.width = this._clientWidth;
			this.height = this._clientHeight;
			this._changeSize = true;
			this._scene.event(MapLayer.MAP_LOAD_COMPLETE);
		}

		private _changeSize:boolean = true;
		//设置窗口大小
		resize(w: number, h: number, realW: number = 0, realH: number = 0): void {
			this._clientWidth = this.width = w;
			this._clientHeight = this.height = h;
			this._clientRealWidth = realW;
			this._clientRealHeight = realH;
			this._changeSize = true;
		}

		// 通过摄像机设置窗口位置
		setViewPortByCamera(camera: Camera): void {
			this._camera = camera;
			this._viewPort.x = camera.bufferLeft + camera.bufferOffsetX;
			this._viewPort.y = camera.bufferTop + camera.bufferOffsetY;
			this._viewPort.width = camera.bufferWidth;
			this._viewPort.height = camera.bufferHeight;
		}

		update(diff: number): void {
			if (!this._mapTexture) {
				return;
			}
			if(!this._changeSize) return;
			this._changeSize = false;
			this.graphics.clear();

			// 绘制的起始&结束位置 
			let startX: number;
			let startY: number;
			let endX: number;
			let endY: number;

			let partWidth = this._partWidth;
			let partHeight = this._partHeight;

			let state = 0; // 0：铺满视口，1：铺满全屏, 2：单图拉伸
			if (state == 0) {
				startX = this._viewPort.x;
				startY = this._viewPort.y;
				endX = this._viewPort.width + startX;
				endY = this._viewPort.height + startY;
			}
			else if (state == 1) {
				startX = this._viewPort.x % this._partWidth - this._partWidth;
				startY = this._viewPort.y % this._partHeight - this._partHeight;
				endX = this._camera.width;
				endY = this._camera.height;
			}
			else if (state == 2) {
				partWidth = this._camera.width;
				partHeight = this._camera.height;
				startX = this._camera.shockOffsetX;
				startY = this._camera.shockOffsetY;
				endX = startX + this._camera.width;
				endY = startY + this._camera.height;
			}

			let width: number, height: number;
			while (startX < endX) {
				let __startY = startY;
				while (__startY < endY) {
					this.graphics.drawTexture(this._mapTexture, startX, __startY, partWidth, partHeight);
					__startY += partHeight;
				}
				startX += partWidth;
			}

		}

		// 清理地图
		clear(): void {
			this.graphics.clear();
			this._mapTexture = null;
			if (this._mapImageAsset) {
				this._mapImageAsset.offAll();
				this._mapImageAsset.release(true);
				this._mapImageAsset = null;
			}
		}

		private _bottomLayer: Sprite;
		public onDraw(diff: number): void {

			let bG: Graphics = this._bottomLayer.graphics;

			//清理画布
			bG.clear();

			// this._avatarDjBg && this._avatarDjBg.onDraw(diff, bG, this._scene);
		}
	}
}