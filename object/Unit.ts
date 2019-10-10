/**
* name 
*/
module gamecomponent.object {
	export class Unit extends game.object.UnitField implements IClear {
		static EVENT_TYPE_CHANGED: string = "Unit.EVENT_TYPE_CHANGED";
		isCanClear: boolean;
		// 场景对象管理器
		protected _sceneObjectMgr: SceneObjectMgr;
		get sceneObjectMgr(): SceneObjectMgr {
			return this._sceneObjectMgr;
		}
		constructor(v: SceneObjectMgr) {
			super();
			this._sceneObjectMgr = v;
			//更新完毕之后
			this._after_update = this.onUpdate;
		}

		private _type: number;
		get type() {
			return this._type;
		}

		//当对象更新发生时
		protected onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			if (isNew || mask.GetBit(UnitField.UNIT_INT_TYPE)) {
				this._type = this.GetType();
				this.event(Unit.EVENT_TYPE_CHANGED, this);
			}
			if (isNew || mask.GetBit(UnitField.UNIT_INT_BYTE1)) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_UNIT_CHANGE)
			}
			if (isNew || mask.GetBit(UnitField.UNIT_INT_BIT1)) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_UNIT_ACTION)
			}
			if (isNew || mask.GetBit(UnitField.UNIT_INT_MONEY)) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_UNIT_MONEY_CHANGE)
			}
			if (isNew || mask.GetBits(UnitField.UNIT_INT_Q_F_END_TIME, 6)) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_UNIT_QIFU_TIME_CHANGE)
			}
			if (isNew || strmask.GetBit(UnitField.UNIT_STR_NAME)) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_UNIT_NAME_CHANGE)
			}
		}

		clear() {

		}
	}
}