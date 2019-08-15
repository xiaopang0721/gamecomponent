/**
* 房卡剧情基类
*/
module gamecomponent.story {
	export abstract class StoryRoomCardBase extends gamecomponent.story.StoryBase implements gamecomponent.object.IStoryCardRoomDataSource {
		//房间ID
		RoomID: string;
		//房间类型
		RoomType: number;
		//房间回合
		RoomRound: number;
		//付费类型
		PayType: number;
		//额外参数
		Agrs: string;

		/**
		 * 
		 * @param v 
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 * @param roomId 房间id
		 * @param roomType 房间类型
		 * @param dataSource 额外数据 需要加额外参数 
		 */
		constructor(v: SceneGame, mapid: string, mapLv: number, dataSource: gamecomponent.object.IStoryCardRoomDataSource) {
			super(v, mapid, mapLv)
			if (dataSource as gamecomponent.object.IStoryCardRoomDataSource) {
				this.RoomID = dataSource.RoomID;
				this.RoomType = dataSource.RoomType;
				this.RoomRound = dataSource.RoomRound;
				this.PayType = dataSource.PayType;
				this.Agrs = dataSource.Agrs;
			}
			this._sceneGame.sceneObjectMgr.on(MapInfo.EVENT_MAP_STR_CARD_ROOM_ID, this, this.onUpdateRoomId);
			this._sceneGame.network.addHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			this.init();
		}

		private onUpdateRoomId() {
			if (!this._mapinfo) return;
			this.RoomID = this._mapinfo.roomId;
		}

		private createRoom() {
			//各种判断
			this._sceneGame.network.call_create_room(this._mapid, this.maplv, this.RoomRound, this.PayType, this.Agrs);
			this._sceneGame.setIsLockGame(true, false, "StoryRoomCardBase.createRoom");
			return true;
		}

		private joinRoom(): boolean {
			// 这边maplv当成房间号来用
			if (this.mapinfo) return false;
			this._sceneGame.network.call_join_room(this._mapid, this.RoomID);
			this._sceneGame.setIsLockGame(true, false, "StoryRoomCardBase.joinRoom");
			return true;
		}

		enterMap() {
			//各种判断
			if (this.mapinfo) return false;
			if (this.RoomType == 1) {
				return this.createRoom();
			} else if (this.RoomType == 2) {
				return this.joinRoom();
			}
			return false;
		}

		leavelMap() {
			//各种判断
			this._sceneGame.network.call_leave_game();
			return true;
		}

		startRoomCardGame(guid: string, card_id: string) {
			if (WebConfig.server_close) {
				this._sceneGame.sceneObjectMgr.leaveStory(true);
				this._sceneGame.alert(StringU.substitute("为了您更好的游戏体验，服务器正在更新中。为避免造成不必要的损失，更新期间无法进入游戏，给您造成的不便我们深表歉意，感谢您的配合。"), () => {
				}, () => {
				}, true, CompoentPath.ui_dating_tongyong + "btn_qd.png");
				return;
			}
			this._sceneGame.network.call_start_roomcard_game(this._mapid, this.maplv, guid, card_id);
		}

		endRoomCardGame(seatIndex: number, card_id: string) {
			this._sceneGame.network.call_end_roomcard_game(this._mapid, parseInt(this.RoomID), seatIndex, card_id);
		}

		// 是否房卡游戏里的房主
		isCardRoomMaster() {
			let mainUnit: Unit = this._sceneGame.sceneObjectMgr.mainUnit;
			if (!mainUnit) return false;
			return mainUnit.GetRoomMaster() == 1;
		}

		private _status: number;
		private onOptHandler(optcode: number, msg: any): void {
			if (msg.type == Operation_Fields.OPRATE_TELEPORT) {//登录操作错误类型
				switch (msg.reason) {
					case Operation_Fields.OPRATE_TELEPORT_MAP_CREATE_ROOM_SUCCESS:             // 地图创建房间成功
						this._sceneGame.setIsLockGame(false, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS");
						this._status = msg.reason;
						break;
					case Operation_Fields.OPRATE_TELEPORT_MAP_JOIN_ROOM_SUCCESS:             // 地图加入房间成功
						this._sceneGame.setIsLockGame(false, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_CANCLE_SUCESS");
						this._status = msg.reason;
						break;
				}
			} else if (msg.type == Operation_Fields.OPRATE_CARDROOM) {//房卡操作错误类型
				this._sceneGame.setIsLockGame(false, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_CANCLE_SUCESS");
				switch (msg.reason) {
					case Operation_Fields.OPRATE_CARDROOM_DISMISSED:             // 房主解散房间
						this._sceneGame.showTips("该房间已解散");
						break;
				}
			}
		}

		dispose() {
			super.dispose();
			this._sceneGame.network.removeHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			this._sceneGame.sceneObjectMgr.off(MapInfo.EVENT_MAP_STR_CARD_ROOM_ID, this, this.onUpdateRoomId);
		}

	}
}