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
			//注册后台地址
			RandomUrlFactory.ins.getUrl(Handler.create(this, (obj: any) => {
				if (!obj) return;
				WebConfig.setPlatformUrl(obj.url);
			}))
			CompoentPath.map_far = StringU.substitute(Path.map_far, WebConfig.baseplatform);
			CompoentPath.map = StringU.substitute(Path.map, WebConfig.baseplatform);
			this.tryCreatedSceneRoot();
			this.sceneObjectMgr.on(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
		}

		public inScene: boolean;
		/**进入新地图 */
		private onIntoNewMap(info: any): void {
			LoadingMgr.ins.cancleUnLoads();//进出地图取消掉未加载完成的
			JsLoader.ins.clear();
			if (typeof info == "string") {
				this.inScene = false;
				updateGameJS();
			} else {
				this.inScene = true;
				clearJSGame(info.id);
			}
		}

		protected _scenes: Array<SceneRootBase> = [];
		/**
		 * 场景
		 */
		get scenes(): Array<SceneRootBase> {
			return this._scenes;
		}

		/**
		 * 场景
		 */
		get scenesWithOperator(): Array<SceneOperator> {
			return this._scenes as Array<SceneOperator>;
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
			super.onUpdate(diff);
			this._scaleEffectFactory && this._scaleEffectFactory.update(diff);
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


		clearMgr() {

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