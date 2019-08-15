module gamecomponent {
	export class SceneGame extends GameBase {

		private static _ins: SceneGame;
		public static get ins() {
			if (!this._ins) {
				this._ins = new SceneGame();
			}
			return this._ins;
		}

		get uiRoot() {
			return this._game.uiRoot;
		}

		constructor() {
			super(main.game);
			this.tryCreatedSceneRoot();
			this.sceneObjectMgr.on(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
		}

		public inScene: boolean;
		/**进入新地图 */
		private onIntoNewMap(info: any): void {
			if (typeof info == "string") {
				this.inScene = false;
			} else {
				this.inScene = true;
			}
		}

		protected _scenes: Array<SceneRootBase> = [];
		/**
		 * 场景
		 */
		get scenes(): Array<SceneRootBase> {
			return this._scenes;
		}

		get mainScene(): SceneRoot {
			return this._scenes[0] as SceneRoot;
		}


		/**
	  * 弹窗提示
	  * @param str  字符串
	  * @param ecb 确定
	  * @param ccb 取消
	  * @param isOnlyOK  是否只有一个按钮 =》确定
	  * @param okSkin 确定的皮肤
	  */
		public alert(str: string, ecb: Function = null, ccb: Function = null, isOnlyOK: boolean = true, okSkin?: string, cancleSkin?: string): void {
			this._game.alert(str, ecb, ccb, isOnlyOK, okSkin, cancleSkin)
		}

		/**
    * 提示
    * @param str 
    * @param isTop 是否顶层
    */
		public showTips(...args): void {
			this._game.showTips(args);
		}

		//红点管理器
		private _redPointCheckMgr: RedPointCheckMgr;
		public get redPointCheckMgr(): RedPointCheckMgr {
			if (!this._redPointCheckMgr) {
				this._redPointCheckMgr = new RedPointCheckMgr(this._game);
			}
			return this._redPointCheckMgr;
		}

		//scale特效管理器
		private _scaleEffectFactory: ScaleEffectFactory;
		public get scaleEffectFactory(): ScaleEffectFactory {
			if (!this._scaleEffectFactory) {
				this._scaleEffectFactory = new ScaleEffectFactory(this._game);
			}
			return this._scaleEffectFactory;
		}

		//房卡数据单元管理器
		private _cardRoomMgr: CardRoomMgr;
		public get cardRoomMgr(): CardRoomMgr {
			if (!this._cardRoomMgr) {
				this._cardRoomMgr = new CardRoomMgr(this._game);
			}
			return this._cardRoomMgr;
		}

		onUpdate(diff: number): void {
			if (!this.inScene) {
				this._redPointCheckMgr && this._redPointCheckMgr.update(diff);
			}
			this._scaleEffectFactory && this._scaleEffectFactory.update(diff);

			if (this._checkVesionTime < 0) {
				this._checkVesionTime = 60000;
				this.checkClientVesion();
			} else {
				this._checkVesionTime -= diff;
			}

			!WebConfig.appVersion && WebConfig.getAppVersion();//获取app版本号
		}

		private _vesion_byteArray: ByteArray;
		private _checkPingTime: number = 0;
		private _checkVesionTime: number = 60000;
		private _checkLoack: boolean;
		public checkClientVesion(isShowTips?: boolean) {
			if (isDebug) return;
			if (this.inScene) return;
			if (!this._game.isLoadComplete) return;
			if (isShowTips) {
				if (this._checkLoack) {
					this._game.showTips("操作太频繁,请稍后重试!")
					return;
				}
				this._checkLoack = true;
			}

			if ((WebConfig.onAndroid || WebConfig.onIOS) && !WebConfig.after && WebConfig.info && WebConfig.appVersion) {
				let app_version = WebConfig.onAndroid ? WebConfig.info.app_android : WebConfig.info.app_ios;
				if (app_version && WebConfig.appVersion != app_version) {
					let newbb = 0, oldbb = 0;
					let ch: boolean;
					try {
						newbb = parseInt(app_version.toString().replace(/\./g, ""));
						oldbb = parseInt(WebConfig.appVersion.toString().replace(/\./g, ""));
					} catch (error) {
						ch = true;
					}
					if (ch || newbb > oldbb) {
						let data = {};
						data["invitecode"] = WebConfig.getInviteCode() || "";
						data["is_dan"] = WebConfig.isSingleEnter ? Web_operation_fields.GAME_APP_TYPE_1 : Web_operation_fields.GAME_APP_TYPE_2;
						let url = WebConfig.gwUrl + (Laya.Browser.onAndroid ? "/game/packAndroid" : "/game/packIos");
						utils.Request.sendA(url, data, Handler.create(this, (value: any) => {
							this._checkLoack = false;
							if (value && value.success == 0) {
								if (Laya.Browser.onAndroid && !value.path) { //android没获取到path就等待下个CD
									return;
								} else {
									this._game.alert(StringU.substitute("检测到App有最新版本{0}，当前版本{1}，是否需要重新下载更新?", app_version, WebConfig.appVersion), () => {
										WebConfig.openUrl(value.path || WebConfig.gwUrl)
									}, (isclose) => {
										!isclose && (WebConfig.after = true);
									}, false, "ui/dating_ui/tongyong/btn_liji.png", "ui/dating_ui/tongyong/btn_shaohou.png")
								}
							}
							// else {
							// WebConfig.openUrl(WebConfig.gwUrl)
							// }
						}))

						return;
					}
				}
			}

			if (WebConfig.yihou) return;
			Laya.loader.load("version_h5_min.bin?v=" + MathU.randomRange(1, 1000000), Handler.create(this, (data: any) => {
				this._checkLoack = false;
				if (!data) return;
				if (!this._vesion_byteArray) this._vesion_byteArray = new ByteArray();
				this._vesion_byteArray.clear();
				this._vesion_byteArray.buffer = data;
				let conf_url_value: any = StringU.readZlibData(this._vesion_byteArray);
				let arr = conf_url_value.split("\n");
				if (!arr || arr.length < 2) return;
				let client_version = arr[1].replace("\r", "");
				let defaultVesion = Vesion["_defaultVesion"];
				if (client_version && defaultVesion && defaultVesion != client_version) {
					let newbb = 0, oldbb = 0;
					let ch: boolean;
					try {
						newbb = parseInt(client_version.toString().replace(/\./g, ""));
						oldbb = parseInt(defaultVesion.toString().replace(/\./g, ""));
					} catch (error) {
						ch = true;
					}
					if (ch || newbb > oldbb) {
						this._game.alert(StringU.substitute("检测到有最新版本{0}，当前版本{1}，是否需要重新加载更新?", client_version, defaultVesion), () => {
							WebConfig.openHelloImg();
							location.reload(true);
						}, (isclose) => {
							!isclose && (WebConfig.yihou = true);
						}, false, "ui/dating_ui/tongyong/btn_gengxin.png", "ui/dating_ui/tongyong/btn_yihou.png");
						return;
					}
					else if (newbb < oldbb) {
						this._game.alert("检测到当前版本有变更，请重新加载！！！", () => {
							WebConfig.openHelloImg();
							location.reload(true);
						}, (isclose) => {
							!isclose && (WebConfig.yihou = true);
						}, false, "ui/dating_ui/tongyong/btn_gengxin.png", "ui/dating_ui/tongyong/btn_yihou.png");
						return;
					}
				}

				isShowTips && this._game.showTips("当前已经是最新版本");
				this._checkLoack = false;
			}))
		}

		// 尝试初始化场景
		public tryCreatedSceneRoot(): void {
			//初始化场景
			if (!this._scenes.length) {
				let scene: SceneRootBase;
				let sceneCount = 1;
				let sceneScle = 1;
				for (let i = 0; i < sceneCount; i++) {
					scene = new SceneRoot(this);
					scene.selfScale = sceneScle;
					Laya.stage.addChildAt(scene, 0);
					this._scenes.push(scene);
				}

				for (let i = 0; i < sceneCount; i++) {
					scene = new UIShowRoot(this);
					scene.selfScale = sceneScle;
					Laya.stage.addChild(scene);
					this._scenes.push(scene);
				}
				this._game.onResize(this._game.clientWidth, this._game.clientHeight, this._game.clientScale);
			}
		}


		private _isLockGame: boolean;
		get isLockGame(): boolean {
			return this._isLockGame;
		}

		/**
		 * 游戏掉线锁屏 
		 */
		setIsLockGame(v: boolean, playAni?: boolean, sign?: string) {
			if (v) {
				logd("====================锁定===========", sign)
			} else {
				logd("====================解锁===========", sign)
			}
			this._isLockGame = v;
			if (this instanceof Game) {
				if (v) {
					let page = this.uiRoot.general.getPage(PageDef.PAGE_WAITEFFECT) as WaitEffectPage;
					if (page && page.isOpened) {
						(page && playAni) ? page.playAni() : page.closeAni();
					} else {
						this.uiRoot.general.open(PageDef.PAGE_WAITEFFECT, (page: WaitEffectPage) => {
							(page && playAni) ? page.playAni() : page.closeAni();
						})
					}
				} else {
					this.uiRoot.general.close(PageDef.PAGE_WAITEFFECT)
				}
			}
		}


		clear() {
			if (this._redPointCheckMgr) {
				this._redPointCheckMgr.clear();
				this._redPointCheckMgr = null;
			}
			if (this._scaleEffectFactory) {
				this._scaleEffectFactory.clear(true);
				this._scaleEffectFactory = null;
			}
			if (this._cardRoomMgr) {
				this._cardRoomMgr.clear(true);
				this._cardRoomMgr = null;
			}
		}
	}
}