/**
* 房卡剧情基类
*/
module gamecomponent.story {
	export abstract class StoryFishBase extends gamecomponent.story.StoryBase {

		/**
		 * 
		 * @param v 
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 * @param roomId 房间id
		 * @param roomType 房间类型
		 * @param dataSource 额外数据 需要加额外参数 
		 */
		constructor(v: SceneGame, mapid: string, mapLv: number) {
			super(v, mapid, mapLv)
			this._sceneGame.network.addHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
		}

		private onOptHandler(optcode: number, msg: any): void {
			if (msg.type == Operation_Fields.OPRATE_TELEPORT) {//登录操作错误类型
				switch (msg.reason) {
					case Operation_Fields.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS:             // 地图匹配加入成功
						this._sceneGame.setIsLockGame(true, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS");
						break;
				}
			}
		}

		abstract resize(w: number, h: number): void

		dispose() {
			this._sceneGame.network.removeHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			super.dispose();
		}
	}
}