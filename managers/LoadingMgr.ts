/**
* name 加载资源管理器
*/
module gamecomponent.managers {
	export class LoadingMgr {

		private static _ins: LoadingMgr;
		private _map: { [key: string]: string } = {}
		private _hasLoad: { [key: string]: string } = {}
		static get ins(): LoadingMgr {
			if (!this._ins) {
				this._ins = new LoadingMgr();
				let gameLoadedObj = localGetItem("gameLoadedObj");
				if (gameLoadedObj) {
					this._ins._hasLoad = JSON.parse(gameLoadedObj) || {};
				}
			}
			return this._ins;
		}

		//是否加载完成
		public isLoaded(gameid: string) {
			return this._hasLoad[gameid] == findGameVesion(gameid);
		}

		public isInLoadList(gameid: string) {
			return this._map[gameid] == findGameVesion(gameid);
		}

		private _preLoader: LoadingRender;
		private _callBackHandle: Handler;
		private _isLoading: boolean;
		private _waitList: LoadingRender[] = []
		load(gameid: string, preAsset: any[], priority: number = 4) {
			if (this.isLoaded(gameid) || this.isInLoadList(gameid)) {
				return false;
			}
			this._map[gameid] = findGameVesion(gameid);
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

		private _assetsLoader: { [key: string]: AssetsLoader } = {};
		//创建缓存池
		public createAssertLoader(gameId: string) {
			if (!this._assetsLoader[gameId]) {
				this._assetsLoader[gameId] = new AssetsLoader();
			}
			return this._assetsLoader[gameId];
		}

		/**
		 * 重新hold住游戏
		 * @param gameId 
		 * @param handle 
		 */
		public retain(gameId: string, assets: Array<string>, handle: Handler) {
			// let assertloader = this.createAssertLoader(gameId);
			// if (assertloader) {
			// 	assertloader.retain(assets, handle);
			// }
		}

		public update(diff: number) {
			this._assetsLoader
		}

		/**
		 * 清理
		 * @param ignore 忽略id
		 */
		public clearAssert(ignore?: string[] | string) {
			// for (let key in this._assetsLoader) {
			// 	if (this._assetsLoader.hasOwnProperty(key)) {
			// 		if (ignore && ignore.indexOf(key) != -1) continue;
			// 		let assertloader = this._assetsLoader[key];
			// 		if (assertloader) {
			// 			assertloader.clear(true);
			// 			assertloader.clearAssert();
			// 			assertloader = null;
			// 		}

			// 		delete this._assetsLoader[key];
			// 	}
			// }
		}

		//获取进度
		getProgress(gameid: string) {
			if (this._preLoader && this._preLoader.gameId == gameid) {//如果是正在加载的 内容 那就显示进度
				return this._preLoader.progress;
			}

			for (let index = 0; index < this._waitList.length; index++) {
				let preload = this._waitList[index];
				if (preload && preload.gameId == gameid) {////如果是在等待列表 那就随便给个初始进度
					return 0.001;
				}
			}

			return 0;
		}

		cancleUnLoads() {
			//重置 其实就是清掉未加载的gameid
			this._map = {};
			for (let key in this._hasLoad) {
				if (this._hasLoad.hasOwnProperty(key)) {
					this._map[key] = this._hasLoad[key];
				}
			}
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
				if (this._hasLoad[this._preLoader.gameId] != findGameVesion(this._preLoader.gameId)) {
					this._hasLoad[this._preLoader.gameId] = findGameVesion(this._preLoader.gameId);
				}
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

		private _assertloader: AssetsLoader;
		startLoad(): boolean {
			if (this._assertloader) return false;
			if (!this._assertloader) {
				this._assertloader = LoadingMgr.ins.createAssertLoader(this._gameId);
			}
			this._assertloader.on(LEvent.PROGRESS, this, this.onUpdateProgress);
			this._assertloader.load(this._preAssets, Handler.create(this, this.onLoadAssetCom), true, this._priority);
			return true;
		}

		private _obj: any = { progress: 0.001 }
		private onUpdateProgress(v: number): void {
			if (v && this._obj.progress && this._obj.progress == v) return;
			Laya.Tween.clearTween(this._obj);
			Laya.Tween.to(this._obj, { progress: v }, 200, null, Handler.create(this, () => {
				if (this._obj.progress >= 1) {
					this.onLoadAssetCom();
				}
			}))
		}

		//资源加载完
		private onLoadAssetCom(): void {
			let gameLoadedObj = localGetItem("gameLoadedObj");
			let obj: { [key: string]: string } = {};
			if (gameLoadedObj) {
				obj = JSON.parse(gameLoadedObj) || {}
			}
			obj[this._gameId] = findGameVesion(this._gameId);
			gameLoadedObj = JSON.stringify(obj);
			localSetItem("gameLoadedObj", gameLoadedObj);
			let name = PageDef.getNameById(this._gameId);
			name && main.game.showTips(name + "更新完成！")
			LoadingMgr.ins.freeAndLoadNext();
			this.clearLoadingRender();
		}

		clearLoadingRender() {
			this._assertloader = null;
			this._preAssets = null;
			this._gameId = null;
		}
	}

}