/**
* name 加载资源管理器
*/
module gamecomponent.managers {
	export class LoadingMgr {

		private static _ins: LoadingMgr;
		private _map: string[] = []
		private _hasLoad: string[] = []
		static get ins(): LoadingMgr {
			if (!this._ins) {
				this._ins = new LoadingMgr();
				let gameLoadedList = localGetItem("gameLoadedList");
				if (gameLoadedList && gameLoadedList.length > 0) {
					this._ins._hasLoad = JSON.parse(gameLoadedList);
				}
			}
			return this._ins;
		}

		//是否加载完成
		public isLoaded(gameid: string) {
			if (!checkGameJsLoad(gameid)) return false;
			return this._hasLoad.indexOf(gameid) != -1;
		}

		public isInLoadList(gameid: string) {
			return this._map.indexOf(gameid) != -1;
		}

		private _preLoader: LoadingRender;
		private _callBackHandle: Handler;
		private _isLoading: boolean;
		private _waitList: LoadingRender[] = []
		load(gameid: string, preAsset: any[], priority: number = 4) {
			if (this._hasLoad.indexOf(gameid) != -1 || this._map.indexOf(gameid) != -1) {
				return false;
			}
			this._map.push(gameid);
			if (this._isLoading) {//加载中 进入等待列表
				let preLoader = new LoadingRender(gameid, preAsset, priority);
				if (priority == 0) {
					this._waitList.unshift(preLoader);
				} else {
					this._waitList.push(preLoader);
				}
				return true;
			}

			if (preAsset && preAsset.length) {
				if (!this._preLoader) {
					this._preLoader = new LoadingRender(gameid, preAsset, priority);
					if (this._preLoader.startLoad()) {
						this._isLoading = true;
						return true;
					}
				}

			}
			return false;
		}

		//是否在加载中
		get isLoading() {
			return this._isLoading;
		}

		//缓存 hold 一遍
		private _assetList: string[] = []
		private retain(asset: string[]) {
			for (let index = 0; index < asset.length; index++) {
				if (this._assetList.indexOf(asset[index]) != -1) continue;
				this._assetList.push(asset[index]);
				let refasset = RefAsset.Get(asset[index]);
				refasset.retain();
			}
		}

		//获取进度
		getProgress(gameid: string) {
			if (this._preLoader && this._preLoader.gameId == gameid) {//如果是正在加载的 内容 那就显示进度
				return this._preLoader.progress;
			}

			for (let index = 0; index < this._waitList.length; index++) {
				let preload = this._waitList[index];
				if (preload && preload.gameId == gameid) {////如果是在等待列表 那就随便给个初始进度
					return 0.01;
				}
			}

			return 0;
		}

		cancleUnLoads() {
			//重置 其实就是清掉未加载的gameid
			this._map = this._hasLoad.concat();
			if (this._preLoader) {
				this._preLoader.preAsset && Laya.loader.cancelLoadByUrls(this._preLoader.preAsset);
				this._preLoader.clearLoadingRender();
				this._preLoader = null;
			} else {
				for (let index = 0; index < this._waitList.length; index++) {
					let preLoader = this._waitList[index];
					if (preLoader) {
						preLoader.preAsset && Laya.loader.cancelLoadByUrls(preLoader.preAsset);
						preLoader.clearLoadingRender();
						preLoader = null;
					}
				}
			}
			this._waitList.length = 0;//等待列表清空
			this._isLoading = false;
		}

		freeAndLoadNext() {
			if (this._preLoader) {
				if (this._hasLoad.indexOf(this._preLoader.gameId) == -1) {
					this._hasLoad.push(this._preLoader.gameId);
				}
				//缓存 hold 一遍
				this.retain(this._preLoader.preAsset);
				//再去清理
				this._preLoader.clearLoadingRender();
				this._preLoader = null;
			}
			if (this._waitList.length > 0) {
				this._preLoader = this._waitList.shift()
				if (this._preLoader && this._preLoader.startLoad()) {
					this._isLoading = true;
					return;
				}
			}
			this._isLoading = false;
		}
	}

	class LoadingRender {
		private _preLoader: PreLoad;
		private _gameId: string;
		private _preAssets: any[];
		private _priority: number;
		constructor(gameid?: string, preAssets?: any[], priority?: number) {
			this._gameId = gameid;
			this._preAssets = preAssets;
			this._priority = priority;
		}

		get progress() {
			return this._obj.progress || 0.001;
		}

		get gameId() {
			return this._gameId;
		}

		get preAsset() {
			return this._preAssets;
		}

		startLoad(): boolean {
			if (this._preLoader) return false;
			if (!this._preLoader) {
				this._preLoader = new PreLoad();
			}
			this._preLoader.on(LEvent.CHANGED, this, this.onUpdateProgress);
			for (let index = 0; index < this._preAssets.length; index++) {
				let asset = this._preAssets[index];
				let type = asset.indexOf(".sk") == -1 ? RefAsset.GENRAL : RefAsset.TEMPLET;
				this._preLoader.load(asset, type);
			}
			this.onUpdateProgress();
			return true;
		}

		private _obj: any = { progress: 0.001 }
		private onUpdateProgress(): void {
			if (this._isClear || this._isComplete) return;
			let totalCount = this._preLoader.totalCount;
			let loadCount = this._preLoader.loadCount;
			let v = loadCount / totalCount;
			if (v && this._obj.progress && this._obj.progress == v) return;
			Laya.Tween.clearTween(this._obj);
			Laya.Tween.to(this._obj, { progress: v }, 200, null, Handler.create(this, () => {
				if (this._obj.progress >= 1) {
					this.onLoadAssetCom();
				}
			}))
		}


		private _isComplete: boolean;
		//资源加载完
		private onLoadAssetCom(): void {
			this._isComplete = true;
			let gameLoadedList = localGetItem("gameLoadedList");
			let arr: string[] = [];
			if (gameLoadedList && gameLoadedList.length > 0) {
				arr = JSON.parse(gameLoadedList)
			}
			if (arr && arr.indexOf(this._gameId) == -1) {
				arr.push(this._gameId);
			}
			gameLoadedList = JSON.stringify(arr);
			localSetItem("gameLoadedList", gameLoadedList);
			let name = PageDef.getNameById(this._gameId);
			name && main.game.showTips(name + "更新完成！")
			LoadingMgr.ins.freeAndLoadNext();
			this.clearLoadingRender();
		}

		private _isClear: boolean;
		clearLoadingRender() {
			this._isClear = true;
			if (this._preLoader) {
				Laya.Tween.clearAll(this);
				Laya.timer.clearAll(this);
				this._preLoader.off(LEvent.CHANGED, this, this.onUpdateProgress)
				this._preLoader.offAll();
				for (let index = 0; index < this._preAssets.length; index++) {
					let asset = this._preAssets[index];
					this._preLoader.clear(asset);
				}
				this._preLoader = null;
				this._preAssets = null;
				this._gameId = null;
			}
		}

	}

	export class LoadingAni extends Laya.Sprite {
		private _img_bg: LImage;
		private _img_bg_mask: LImage;
		private _img_bg_front: Laya.Sprite;
		private _label: Label;
		constructor() {
			super();
			this._img_bg = new LImage("dating_ui/tongyong/load_bg.png");
			this._img_bg.anchorX = this._img_bg.anchorY = 0.5;
			this.addChild(this._img_bg);

			this._img_bg_mask = new LImage("dating_ui/tongyong/load_bg1.png");
			this._img_bg_mask.anchorX = this._img_bg_mask.anchorY = 0.5;
			// this.addChild(this._img_bg_mask);

			this._img_bg_front = new Laya.Sprite();
			this._img_bg_front.mask = this._img_bg_mask;
			this.addChild(this._img_bg_front);

			this._label = new Label();
			this._label.fontSize = 14;
			this._label.align = "center";
			this._label.bold = true;
			this._label.color = "#fff";
			this._label.width = 36;
			this._label.height = 14;
			this._label.anchorX = this._label.anchorY = 0.5;
			this.addChild(this._label);
			this.setData();
		}

		private _v: number = 0;
		setData(v: number = 0) {
			if (v > 1) v = 1;
			if (this._v == v) return;
			this._v = v;
			this._img_bg_front.graphics.clear();
			let endAngle = 360 * v
			this._img_bg_front.graphics.drawPie(0, 0, 20, -90, endAngle - 90, "#00ff47");
			this._label.changeText(Math.floor(v * 100).toString() + "%");
		}

		clear() {
			if (this._img_bg) {
				this._img_bg.removeSelf();
				this._img_bg.destroy();
				this._img_bg = null;
			}
			if (this._img_bg_front) {
				this._img_bg_front.removeSelf();
				this._img_bg_front.destroy();
				this._img_bg_front = null;
			}
			if (this._img_bg_mask) {
				this._img_bg_mask.removeSelf();
				this._img_bg_mask.destroy();
				this._img_bg_mask = null;
			}
			if (this._label) {
				this._label.removeSelf();
				this._label.destroy();
				this._label = null;
			}
		}
	}
}