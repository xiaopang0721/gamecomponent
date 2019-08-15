/**
* name 小红点检查管理器
*/
module gamecomponent.managers {
	export class RedCheckMgr {
		private _game: Game;
		private _event: Laya.EventDispatcher;
		static EVENT_CHECK: string = "RedCheckMgr.EVENT_CHECK";
		constructor(game: Game) {
			this._game = game;
			this._event = new Laya.EventDispatcher();
			
		}

		update(diff: number) {
			
		}

		public get event() {
			return this._event;
		}

		checkTargetNow() {
			this.event.event(RedCheckMgr.EVENT_CHECK);
		}
		
	}
}