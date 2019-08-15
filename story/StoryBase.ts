/**
* 剧情基类
*/
module gamecomponent.story {
	export abstract class StoryBase implements gamecomponent.object.IInLook {
		protected _game: Game;
		protected _mapinfo: MapInfo;
		protected _mapid: string;
		public maplv: number;

		//是否断线重连
		protected _isReConnected: boolean;
		set isReConnected(v: boolean) {
			this._isReConnected = v;
		}
		get isReConnected() {
			return this._isReConnected;
		}

		/**
		 * 
		 * @param v 
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 */
		constructor(v: Game, mapid: string, mapLv: number) {
			this._game = v;
			this._mapid = mapid;
			this.maplv = mapLv;
			this.init();
		}

		setMapinfo(mapf: MapInfo) {
			this._mapinfo = mapf;
			this.updateMapLv();
		}

		clearMapInfo() {
			if (this._mapinfo) {
				this._game.sceneObjectMgr.off(MapInfo.EVENT_MAP_INT_MAP_BYTE, this, this.updateMapLv);
				this._mapinfo = null;
				this._game.sceneObjectMgr.event(SceneObjectMgr.EVENT_MAPINFO_CHANGE);
			}
		}

		protected updateMapLv() {
			let mapLv = this._mapinfo.GetMapLevel();
			this.maplv = this.maplv || mapLv;
			if (this.maplv) {
				this._game.sceneObjectMgr.off(MapInfo.EVENT_MAP_INT_MAP_BYTE, this, this.updateMapLv);
				this._game.sceneObjectMgr.event(SceneObjectMgr.EVENT_MAPINFO_CHANGE);
			} else {
				this._game.sceneObjectMgr.on(MapInfo.EVENT_MAP_INT_MAP_BYTE, this, this.updateMapLv);
			}
		}

		//地图对应资源
		public get mapUrl(): string {
			return null;
		}

		get mapid() {
			return this._mapid;
		}

		get mapinfo() {
			return this._mapinfo;
		}

		// 初始化
		abstract init();

		/**
		 * 进入地图
		 * @param mapId 
		 */
		abstract enterMap(): boolean;
		/**
		 * 离开地图
		 * @param mapId 
		 */
		abstract leavelMap(): boolean;
		/**
		 * 清理
		 */
		abstract clear();

		update(diff: number) {

		}

		// 清理
		dispose() {
			this._game.sceneObjectMgr.off(MapInfo.EVENT_MAP_INT_MAP_BYTE, this, this.updateMapLv);
			this.clear();
			this.clearMapInfo();
			this._mapid = null;
			this.maplv = null;
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
			this._game.sceneObjectMgr.clearOfflineObject();
		}

		//视图对象创建
		inLook(obj: any, isFollow: boolean = false): AvatarBase {
			return null;
		}

		//更新视图对象
		updateInLook(obj: GuidObject): string {
			return null
		}

	}
}