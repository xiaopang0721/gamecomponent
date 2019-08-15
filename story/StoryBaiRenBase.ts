/**
* 百人场剧情基类
*/
module gamecomponent.story {
	export abstract class StoryBaiRenBase extends gamecomponent.story.StoryBase {
		/**
		 * @param mapid 游戏id
		 * @param mapLv 游戏等级
		 */
		constructor(v: SceneGame, mapid: string, mapLv: number) {
			super(v, mapid, mapLv);
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

		serverClose() {
			if (!WebConfig.server_close) return;
			this._sceneGame.sceneObjectMgr.leaveStory(true);
			this._sceneGame.alert(StringU.substitute("为了您更好的游戏体验，服务器正在更新中。为避免造成不必要的损失，更新期间无法进入游戏，给您造成的不便我们深表歉意，感谢您的配合。"), () => {
			}, () => {
			}, true, CompoentPath.ui_dating_tongyong + "btn_qd.png");
		}

		dispose() {
			this._sceneGame.network.removeHanlder(Protocols.SMSG_OPERATION_FAILED, this, this.onOptHandler);
			super.dispose();
		}
	}
}