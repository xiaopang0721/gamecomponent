/**
* name 
*/
module gamecomponent.object {
	export class GlobalData extends game.object.GlobalObjectField {
		private _globalInfo: GlobalInfo;
		private _game: Game;
		constructor(v: Game) {
			super();
			this._game = v;
			this._after_update = this.onUpdate;
			this._globalInfo = new GlobalInfo();
		}

		onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			let ness: number = 0;
			
		}
	}

	class GlobalInfo {
		client_version: string
		android_version: string
		ios_version: string
		app_android: string
		app_ios: string
		gameList: string
	}
}