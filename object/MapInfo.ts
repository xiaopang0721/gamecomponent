module gamecomponent.object {

	export class MapInfo extends game.object.MapField {
		//地图状态变更
		static EVENT_STATUS_CHECK: string = "MapInfo.EVENT_STATUS_CHECK";
		static EVENT_MAP_INT_MAP_BYTE: string = "MapInfo.MAP_INT_MAP_BYTE";
		static EVENT_MAP_STR_CARD_ROOM_ID: string = "MapInfo.MAP_STR_CARD_ROOM_ID";

		private _id: string;
		private _mapState: number;

		get mapState() {
			return this._mapState;
		}

		get id(): string {
			return this._id;
		}
		set id(v: string) {
			this._id = v;
		}

		private _width: number;
		get width(): number {
			return this._width;
		}
		private _height: number;
		get height(): number {
			return this._height;
		}
		//地图结束时间
		private _mapEndTime: number;
		get mapEndTime(): number {
			return this._mapEndTime;
		}
		private _roomId: string = "null";
		/**
		 * 房间id
		 */
		get roomId() {
			return this._roomId;
		}

		// 场景对象管理器
		protected _sceneObjectMgr: SceneObjectMgr;
		constructor(v: SceneObjectMgr) {
			super();
			this._sceneObjectMgr = v;
			//更新完毕之后
			this._after_update = this.onUpdate;
		}

		//当对象更新发生时
		protected onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			if (isNew || strmask.GetBit(MapField.MAP_STR_INSTANCE_I_D)) {
				this._id = this.GetMapID();
			}
			if (isNew || mask.GetBit(MapField.MAP_STR_CARD_ROOM_ID)) {
				let roomId = this.GetCardRoomId()
				if (this._roomId != roomId) {
					this._roomId = roomId;
					this._sceneObjectMgr.event(MapInfo.EVENT_MAP_STR_CARD_ROOM_ID)
					roomId && this._sceneObjectMgr.event(SceneObjectMgr.__EVENT_PLAYER_CARDROOM_CHUANGE)
				}
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_MAP_BYTE)) {
				this._sceneObjectMgr.event(MapInfo.EVENT_MAP_INT_MAP_BYTE)
				let mapState = this.GetMapState()
				if (this._mapState != mapState) {
					this._mapState = mapState;
					this._sceneObjectMgr.event(MapInfo.EVENT_STATUS_CHECK);
				}
			}
		}



		update(diff: number): void {

		}

		// dispose(): void {
		// 	this._sceneObjectMgr = null;
		// 	super.dispose();
		// }


	}

	export class MapInfoT<T extends gamecomponent.object.MapInfoLogObject> extends MapInfo {
		protected _battleInfoMgr: BattleInfoMgr<T>;
		public get battleInfoMgr() {
			return this._battleInfoMgr;
		}
		constructor(v: SceneObjectMgr, create_card_fun: Function) {
			super(v);
			this._sceneObjectMgr = v;
			this._battleInfoMgr = new BattleInfoMgr<T>(this, create_card_fun);
			//更新完毕之后
			this._after_update = this.onUpdate;
		}
		//当对象更新发生时
		protected onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			super.onUpdate(flags, mask, strmask);
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			if (isNew || mask.GetBit(MapField.MAP_INT_BATTLE_INDEX)) {
				this._battleInfoMgr.OnUpdate();
			}
		}

		//战斗日志转成字符串
		public getBattleInfoToString(): string {
			throw "not implement";
		}

		//战斗日志转成对象
		public getBattleInfoToObj(): any {
			throw "not implement";
		}
	}
}
