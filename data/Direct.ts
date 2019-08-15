/**
* name 
*/
module gamecomponent.data {
    export class Direct {
        public static UP: number = 0;
        public static UPPER_RIGHT: number = 1;
        public static RIGHT: number = 2;
        public static BOTTOM_RIGHT: number = 3;
        public static BOTTOM: number = 4;
        public static BOTTOM_LEFT: number = 5;
        public static LEFT: number = 6;
        public static UPPER_LEFT: number = 7;
        public static MAX_DIRECT: number = 8;

		/**
		 * 90角度的弧度值 
		 */
        public static ANGLE_RADIANS_90: number = Math.PI / 2;
		/**
		 * 45角度的弧度值 
		 */
        public static ANGLE_RADIANS_45: number = Math.PI / 4;

		/**
		 * 30角度的弧度值 
		 */
        public static ANGLE_RADIANS_30: number = Math.PI / 6;

		/**
		 * 15角度的弧度值 
		 */
        public static ANGLE_RADIANS_15: number = Math.PI / 12;

		/**
		 * 120角度的弧度值 
		 */
        public static ANGLE_RADIANS_120: number = Math.PI / 2 + Math.PI / 6;//roc.data.Direct.ANGLE_RADIANS_90 + roc.data.Direct.ANGLE_RADIANS_30;

		/**
		 * 360角度弧度值
		 */
        public static ANGLE_RADIANS_360: number = Math.PI * 2;

		/**
		 * 转换成8方向的数值,Math.round
		 * @param angle 0-2PI的弧度值
		 * @return 
		 * 
		 */
        public static GetDirect(angle: number): number {
            let direct: number = angle + this.ANGLE_RADIANS_90 / this.ANGLE_RADIANS_45;
            let d: number = Math.round(direct) % this.MAX_DIRECT;
            return d;
        }

        /**
 * 转换成8方向的数值,Math.round
 * @param angle 0-2PI的弧度值
 * @return 
 * 
 */
        public static GetDirect2(vec2: number): number {
            switch (vec2) {
                case 0:
                    return Direct.UP;
                case 1:
                    return Direct.UPPER_RIGHT;
                case 2:
                    return Direct.RIGHT;
                case 3:
                    return Direct.BOTTOM_RIGHT;
                case 4:
                    return Direct.BOTTOM;
                case 5:
                    return Direct.BOTTOM_LEFT;
                case 6:
                    return Direct.LEFT;
                case 7:
                    return Direct.UPPER_LEFT;
            }
            return vec2;
        }

		/**
		 * 转换绝对的0-7的8方向枚举，例如-1就是枚举7 
		 * @param direct
		 * @return 
		 * 
		 */
        public static AbsDirect(direct: number): number {
            return (direct + 8) % this.MAX_DIRECT;
        }

		/**
		 * 根据8方向数值获得弧度 
		 * @param direct 0-7方向
		 * @return 
		 * 
		 */
        public static GetAngle(direct: number): number {
            return (direct + 6) % this.MAX_DIRECT * this.ANGLE_RADIANS_45;
        }

		/**
		 * 根据原点到目标点，计算出8方向 
		 * @param sx 源点x
		 * @param sy 原点y
		 * @param dx 目标点x
		 * @param dy 目标点y
		 * @return 0-7方向
		 * 
		 */
        public static ATan2(sx: number, sy: number, dx: number, dy: number): number {
            dx -= sx;
            dy -= sy;
            let ang: number = Math.atan2(dy, dx);
            ang = (ang >= 0) ? ang : 2 * Math.PI + ang;
            ang = Math.round((ang * 100)) / 100;
            return this.GetDirect(ang);
        }

        constructor() {

        }
    }
}