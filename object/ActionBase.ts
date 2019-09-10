/**
* name 行为基类
*/
module gamecomponent.object {
	export class ActionBase extends core.obj.GuidObject implements ISceneObject {
		owner: Unit;//归属
		private _pos: Vector2;
		get pos(): Vector2 {
			return this._pos;
		}
		set pos(v: Vector2) {
			if (this._pos && v) {
				throw new Error("为什么要new 那么多次")
			}
			this._pos = v;
		}
		private _targe_pos: Vector2;
		get targe_pos(): Vector2 {
			return this._targe_pos;
		}
		set targe_pos(v: Vector2) {
			if (this._targe_pos && v) {
				throw new Error("为什么要new 那么多次")
			}
			this._targe_pos = v;
		}
		skew_x: number = 0;//斜旋转x
		skew_y: number = 0;//斜旋转y
		rotateAngle: number = 0;//旋转角度
		_scaleX: number = 1;
		get scaleX() {
			return this._scaleX;
		}
		set scaleX(v: number) {
			this._scaleX = v;
		}
		scaleY: number = 1;
		size: number = 1;
		sortScore: number = 0;//
		disable: boolean;//置灰
		light: boolean;//高光
		visible: boolean = true;//隐藏
		index: number;//序列
		isUIShow: Boolean;//是否UI
		isFinalPos: boolean;//是否是终点坐标
		toggle: boolean;
		toggleEnable: boolean;//toggle 开关
		toggleDistance: number = -20;//toggle 距离
		constructor() {
			super()
		}

		update(diff: number) {

		}

		isCanClear: boolean;
		public clear() {
			if (!this.isCanClear) {
				throw new Error("可以清了吗？")
			}
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
			this._targe_pos = null
			this._pos = null
			this.owner = null
		}
	}
}