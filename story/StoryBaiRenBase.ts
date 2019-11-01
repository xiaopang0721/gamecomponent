/**
* 百人场剧情基类
*/
module gamecomponent.story {
	export abstract class StoryBaiRenBase extends gamecomponent.story.StoryBase {
		/**
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 */
		constructor(v: Game, mapid: string, mapLv: number) {
			super(v, mapid, mapLv);
			this._game.network.addHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
		}

		private onOptHandler(optcode: number, msg: any): void {
			if (msg.type == Operation_Fields.OPRATE_TELEPORT) {//登录操作错误类型
				switch (msg.reason) {
					case Operation_Fields.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS:             // 地图匹配加入成功
						this._game.setIsLockGame(true, false, "StoryBase.OPRATE_TELEPORT_MAP_MATHCH_JOIN_SUCESS");
						break;
				}
			}
		}

		serverClose() {
			if (!WebConfig.server_close) return;
			this._game.sceneObjectMgr.leaveStory(true);
			this._game.alert(StringU.substitute("亲爱的玩家，游戏服务器正在火速升级中，请稍候1分钟再进入游戏场，游戏有您更精彩~"), () => {
			}, () => {
			}, true);
		}

		dispose() {
			this._game.network.removeHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			super.dispose();
		}
	}
}