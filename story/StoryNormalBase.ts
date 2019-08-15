/**
* 普通场剧情基类
*/
module gamecomponent.story {
	export abstract class StoryNormalBase extends gamecomponent.story.StoryBase {

		protected _last_maplv: number;//上一场的 房间等级
		protected _offlineUnit: UnitOffline;

		destroyed: boolean;


		/**
		 * 
		 * @param v 
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 * @param roomId 房间id
		 * @param roomType 房间类型
		 * @param dataSource 额外数据 需要加额外参数 
		 */
		constructor(v: Game, mapid: string, mapLv: number) {
			super(v, mapid, mapLv)
			this._game.network.addHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
		}

		init() {
			this.createofflineUnit();
		}

		/**
		 * 创建假的精灵对象
		 */
		abstract createofflineUnit()

		clearMapInfo() {
			if (this._mapinfo) {
				this._game.setIsLockGame(false, false, "StoryBase.clearMapInfo");
			}
			super.clearMapInfo()
		}

		protected updateMapLv() {
			super.updateMapLv();
			if (this.maplv) {
				this._game.setIsLockGame(false, false, "StoryBase.updateMapLv");
			}
		}

		set isMatchGame(v: boolean) {
			if (v) {
				if (!this.mapinfo) {
					if (this._game.sceneObjectMgr.enterMap()) {
						this._game.setIsLockGame(true, false, "StoryBase.isMatchGame");
					}
					logd("开始匹配")
				} else {
					logd("=========================已经匹配了")
				}
			} else {
				if (this._status == Operation_Fields.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS) {//加入成功才能取消
					if (this._game.sceneObjectMgr.cancleMathch()) {
						this._game.setIsLockGame(true, false, "StoryBase.isMatchGame");
					}
					logd("取消匹配")
				} else {
					logd("等待取消匹配返回")
				}
			}
		}

		private _status: number;
		private onOptHandler(optcode: number, msg: any): void {
			if (msg.type == Operation_Fields.OPRATE_TELEPORT) {//登录操作错误类型
				switch (msg.reason) {
					case Operation_Fields.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS:             // 地图匹配加入成功
						this._game.setIsLockGame(false, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS");
						this._status = msg.reason;
						break;
					case Operation_Fields.OPRATE_TELEPORT_MAP_MATHCH_CANCLE_SUCESS:             // 地图匹配取消成功
						this._game.setIsLockGame(false, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_CANCLE_SUCESS");
						this._status = msg.reason;
						break;
				}
			}
		}

		dispose() {
			this._game.network.removeHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			this._last_maplv = null;
			this._offlineUnit = null;
			super.dispose();
		}

		clear() {
			this.destroyed = false;
		}

	}
}