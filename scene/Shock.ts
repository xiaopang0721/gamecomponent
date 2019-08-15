module gamecomponent.scene {
	export class Shock {
		/*地震偏移X*/
		offsetX: number;
		/*地震偏移Y*/
		offsetY: number;

		private _isRunning: Boolean = false;
		/*开始时间*/
		private _startTime: number;
		/*持续时间*/
		private _duration: number;
		/*结束时间*/
		private _overTime: number;

		constructor() {
			// test
			// this.start(1000000000);
		}

		/**
		 * 震动开始 
		 * @param duration 持续时间 单位/ms
		 */
		start(duration: number): void {
			this._isRunning = true;
			//时间计算
			this._startTime = Laya.timer.currTimer;
			this._duration = duration;
			this._overTime = this._startTime + this._duration;
		}

		//每次刷新的时间
		private PreEndTime: number = 0;
		/**
		 * 震动更新心态 
		 * @param diff 时间差
		 */
		update(): Boolean {
			if (!this._isRunning) return false;
			//防止帧率太高，抖动太厉害了
			//			if(PreEndTime > getTimer())return true;
			//			PreEndTime = getTimer() + 33;
			this.offsetX = MathU.randomBoolen() ? 6 : -6;
			this.offsetY = MathU.randomBoolen() ? 6 : -6;
			if (Laya.timer.currTimer > this._overTime) {
				this.stop();
			}
			return true;
		}

		/**
		 * 结束 
		 */
		stop(): void {
			this._isRunning = false;
			this.offsetX = 0;
			this.offsetY = 0;
		}

		isShocking(): Boolean {
			return this._isRunning;
		}
	}
}