/**
* name 
*/
module gamecomponent.component {
	export class PieMask extends Laya.Sprite {
		constructor() {
			super();
		}

		private _radius: number;
		public init(width: number, height: number, radius: number, alpha: number) {
			this.size(width, height);
			this._radius = radius;
			this.alpha = alpha;
		}

		public drawCD(angle: number): void {
			angle = 360 - angle;
			this.graphics.clear();
			this.graphics.drawPie(this.width / 2, this.height / 2, this._radius, angle - 90, - 90, "#000000");
		}
	}
}