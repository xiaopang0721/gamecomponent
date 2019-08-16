/**
* name 房卡管理器数据单元
*/
module gamecomponent.managers {
	export class CardRoomMgr extends gamecomponent.managers.BaseMgr implements gamecomponent.object.IStoryCardRoomDataSource {
		//房间ID
		RoomID: string;
		//房间类型
		RoomType: number;
		//房间回合
		RoomRound: number;
		//房卡费用
		RoomPay: number;
		//付费类型
		PayType: number;
		//额外参数
		Agrs: string;

		constructor(g: Game) {
			super(g)
		}

		init() {

		}

		update(diff: number) {

		}


		deltaUpdate() {

		}


		clear(fource?: boolean) {
			super.clear(fource)
			//房间ID
			this.RoomID = "";
			//房间类型
			this.RoomType = 0;
			//房间回合
			this.RoomRound = 0;
			//房卡费用
			this.RoomPay = 0;
			//付费类型
			this.PayType = 0;
			//额外参数
			this.Agrs = "";
		}


	}
}