/**
* name 管理器基类
*/
module gamecomponent.managers {
	export class BaseMgr extends Laya.EventDispatcher {
		private _time: number = 0;
		protected _game: Game;
		//帧间隔
		protected _delta: number = 1000;
		constructor(v?: Game) {
			super();
			this._game = v || main.game;
			this._game.sceneGame.sceneObjectMgr.on(SceneObjectMgr.EVENT_OPRATE_SUCESS, this, this.onSucessHandler);
		}

		protected onSucessHandler(data: any) {

		}

		init()
		{
			
		}

		update(diff: number) {
			if (this._time < 0) {
				this.deltaUpdate();
				this._time = this._delta;
				return;
			}
			this._time -= diff;
		}

		/**
		 * 帧间隔心跳
		 */
		deltaUpdate() {

		}

		hasClear: boolean;

		clear(fource?:boolean) {
			this._game.sceneGame.sceneObjectMgr.off(SceneObjectMgr.EVENT_OPRATE_SUCESS, this, this.onSucessHandler);
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
		}
	}
}