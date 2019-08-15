module gamecomponent.scene {
	export class Camera {
		/*查看范围扩充*/
		static LOGIC_INNER_LOOK: number = 450;

		private static _ins: Camera
		static get ins(): Camera {
			if(!this._ins)
			{
				this._ins = new Camera();
			}
			return this._ins;
		}

		/*地震*/
		private _earthShock: Shock = new Shock();
		/*摄像机位置*/
		private _worldPostion: Vector2 = new Vector2();
		get worldPostion(): Vector2 {
			return this._worldPostion;
		}

		private _flipV: boolean = false;
		/**
		 * 镜头是否垂直翻转
		 */
		get flipV(): boolean {
			return this._flipV;
		}
		set flipV(v: boolean) {
			this._flipV = v;
		}

		/*所跟随的对象*/
		private _focusPos: Vector2;
		set focusPos(pos: Vector2) {
			this._focusPos = pos;
		}
		get focusPos() {
			return this._focusPos;
		}
		isFocus(pos: Vector2): boolean {
			return this._focusPos.equal(pos);
		}

		focusOffsetX: number = 0;
		focusOffsetY: number = 0;

		// viewPort宽度 	
		width: number = 800;
		// viewPort高度 
		height: number = 600;
		// 地图像素总宽度
		map_width_px: number = 0;
		// 地图像素总高度
		map_height_px: number = 0;
		// 缓冲区宽度/像素 	
		bufferWidth: number;
		// 缓冲区高度/像素 	
		bufferHeight: number;
		// 缓冲区位置的左边线 	
		bufferLeft: number;
		// 缓冲区位置的右边线 		
		bufferRight: number;
		// 缓冲区位置的上边线 
		bufferTop: number;
		// 缓冲区位置的下边线 		
		bufferBottom: number;

		// buffer的偏移（小图时有用 ）
		bufferOffsetX: number = 0;
		bufferOffsetY: number = 0;

		/*逻辑左值，右值，上值，下值*/
		logicLeft: number;
		logicRight: number;
		logicTop: number;
		logicBottom: number;

		/*视野内逻辑左值，右值，上值，下值*/
		private look_logicLeft: number;
		private look_logicRight: number;
		private look_logicTop: number;
		private look_logicBottom: number;

		// 摄像头的位置x，y,z
		private _x: number = 0;
		private _y: number = 0;

		/*窗口大小标记*/
		private _sizeFlag: number;
		// 镜头产生移动 
		get isResize(): boolean {
			return this._sizeFlag >= Laya.timer.currFrame;
		}

		// 是否启用滤镜 	
		enableFilter: boolean = true;

		/**
		 * 设置摄像机可视大小 
		 * @param newWidth 新高
		 * @param newHeight 新宽
		 */
		setSize(newWidth: number, newHeight: number): void {
			this.width = newWidth;
			this.height = newHeight;
			this.updateModeFollow();
			/*
			enableFilter = 
				Starling.current.viewPort.width <= 1920 &&
				Starling.current.viewPort.height <= 1080 &&
				bufferWidth < Starling.current.maxTextureSize && 
				bufferHeight < Starling.current.maxTextureSize;
				*/
		}

		/**
		 * 设置地图像素总大小 
		 * @param newWidth 新高
		 * @param newHeight 新宽
		 */
		setMapSize(newWidth: number, newHeight: number): void {
			this.map_width_px = newWidth;
			this.map_height_px = newHeight;
		}

		/*内部函数，设置位置*/
		private __location(newX: number, newY: number): void {
			this._x = newX;
			this._y = newY;

			//得出视口的大小
			let bw: number = Math.min(this.width, this.map_width_px);
			let bh: number = Math.min(this.height, this.map_height_px);
			//判断窗口是否发生改变
			if (bw != this.bufferWidth || bh != this.bufferHeight)
				this._sizeFlag = Laya.timer.currFrame;

			//设置窗口大小
			this.bufferWidth = bw;
			this.bufferHeight = bh

			this.centerPointX = Math.round(this.bufferWidth / 2) + this.focusOffsetX;
			this.centerPointY = Math.round(this.bufferHeight / 2) + this.focusOffsetY;

			//左线
			this.bufferLeft = this._x - this.centerPointX;
			//右线
			this.bufferRight = this.bufferLeft + this.bufferWidth;
			//上线
			this.bufferTop = this._y - this.centerPointY;
			//下线
			this.bufferBottom = this.bufferTop + this.bufferHeight;

			this.bufferOffsetX = 0;
			this.bufferOffsetY = 0;

			if (this.width > this.map_width_px) {
				this.bufferLeft = 0;
				this.bufferRight = this.bufferLeft + this.map_width_px;
				this.bufferOffsetX = (this.width - this.map_width_px) / 2;
			}
			else {
				//控制画面不得超过地图区域
				if (this.bufferLeft < 0) {
					this.bufferLeft = 0;
					this.bufferRight = this.bufferWidth;
				}
				if (this.bufferRight > this.map_width_px) {
					this.bufferRight = this.map_width_px;
					this.bufferLeft = this.bufferRight - this.bufferWidth;
				}
			}

			if (this.height > this.map_height_px) {
				this.bufferTop = 0;
				this.bufferBottom = this.bufferTop + this.map_height_px;
				this.bufferOffsetY = (this.height - this.map_height_px) / 2;
			}
			else {
				if (this.bufferTop < 0) {
					this.bufferTop = 0;
					this.bufferBottom = this.bufferHeight;
				}

				if (this.bufferBottom > this.map_height_px) {
					this.bufferBottom = this.map_height_px;
					this.bufferTop = this.bufferBottom - this.bufferHeight;
				}
			}
		}

		/**
		 * 视线范围中央点x，y 
		 */
		centerPointX: number;
		centerPointY: number;


		private _shockOffsetX: number;
		/**
		 * 震屏x
		 */
		get shockOffsetX(): number {
			return this._shockOffsetX;
		}
		private _shockOffsetY: number;
		/**
		 * 震屏y
		 */
		get shockOffsetY(): number {
			return this._shockOffsetY;
		}
		/**
		 * 更新摄像机 
		 * @param diff 时差
		 * @param width 摄像机宽度
		 * @param height 摄像机高度
		 */
		public update(): void {
			this.updateModeFollow();

			//震动效果
			if (this._earthShock.update()) {
				this._shockOffsetX = this._earthShock.offsetX;
				this._shockOffsetY = this._earthShock.offsetY;

				this.bufferLeft += this._shockOffsetX;
				this.bufferRight += this._shockOffsetX;
				this.bufferTop += this._shockOffsetY;
				this.bufferBottom += this._shockOffsetY;
			}
			else {
				this._shockOffsetX = 0;
				this._shockOffsetY = 0;
			}

			//逻辑坐标范围
			this.logicLeft = this.bufferLeft / SceneRes.CELL_WIDTH;
			this.logicRight = this.bufferRight / SceneRes.CELL_WIDTH;
			this.logicTop = this.bufferTop / SceneRes.CELL_HEIGHT;
			this.logicBottom = this.bufferBottom / SceneRes.CELL_HEIGHT;



			//更新逻辑范围，用于lookIn函数
			this.look_logicLeft = this.logicLeft - Camera.LOGIC_INNER_LOOK;
			this.look_logicRight = this.logicRight + Camera.LOGIC_INNER_LOOK;
			this.look_logicTop = this.logicTop - Camera.LOGIC_INNER_LOOK;
			this.look_logicBottom = this.logicBottom + Camera.LOGIC_INNER_LOOK;
		}


		/**
		 * 获得基于屏幕的X像素位置，通过逻辑X 
		 * @param x 逻辑x
		 * @return 
		 */
		getScenePxByCellX(x: number): number {
			if (!x) return - 100000;
			return x * SceneRes.CELL_WIDTH - this.bufferLeft + this.bufferOffsetX;
		}

		/**
		 * 获得基于屏幕的Y像素位置，通过逻辑Y 
		 * @param y 逻辑y
		 * @return 
		 */
		getScenePxByCellY(y: number): number {
			if (!y) return - 100000;
			let v = y * SceneRes.CELL_HEIGHT - this.bufferTop + this.bufferOffsetY;
			if (this._flipV) {
				v -= 2 * ((v - this.bufferOffsetY) - this.bufferHeight / 2);
			}
			return v;
		}

		/*通过实际像素获得相对于屏幕的位置*/
		private getSceneX(xPX: number): number {
			return xPX - this.bufferLeft - this.bufferOffsetX;
		}

		/*通过实际像素获得相对于屏幕的位置*/
		private getSceneY(yPX: number): number {
			return yPX - this.bufferTop - this.bufferOffsetY;
		}

		/**
		 * 通过当前屏幕的像素x获得逻辑位置x  
		 * @param x
		 * @return 
		 */
		getCellXByScene(x: number): number {
			let v: number = x - this.bufferLeft - this.bufferOffsetX;
			return v / SceneRes.CELL_WIDTH;
		}

		/**
		 * 通过当前屏幕的像素y获得逻辑位置y
		 * @param y
		 * @return 
		 */
		getCellYByScene(y: number, checkFlipV: boolean = true): number {
			let v: number = y - this.bufferTop - this.bufferOffsetY;
			if (checkFlipV && this._flipV) {
				v = this.bufferHeight - v;
			}
			return v / SceneRes.CELL_HEIGHT;
		}

		/*更新跟随模式*/
		private updateModeFollow(): void {
			if (!this._focusPos) {
				//逻辑坐标范围
				this.bufferLeft = NaN;
				this.bufferRight = NaN;
				this.bufferTop = NaN;
				this.bufferBottom = NaN;
				//logd('!this._followPostion', this._worldPostion.x, this._worldPostion.y)
				return;
			}
			this._worldPostion.x = this._focusPos.x;
			this._worldPostion.y = this._focusPos.y;

			//通过主玩家的实际坐标位置，得到屏幕中央偏移及格子中央偏移			
			let srX: number = this._worldPostion.x * SceneRes.CELL_WIDTH;
			let srY: number = this._worldPostion.y * SceneRes.CELL_HEIGHT;

			//设置窗口位置
			this.__location(srX, srY);
		}

		/**
		 * 是否存在于摄像头里（区域碰撞检测） 
		 * @param postion 位置
		 * @return 
		 */
		lookIn(postion: Vector2): boolean;
		/**
		 *  是否存在于摄像头里（区域碰撞检测）
		 * @param postionX
		 * @param postionY
		 * @return 
		 */
		lookIn(postionX: number, postionY: number): boolean;

		lookIn(...args: any[]): boolean {
			let look = false;
			let postionX: number, postionY: number;
			switch (args.length) {
				case 1:
					let pos = args[0];
					if (pos instanceof Vector2) {
						postionX = pos.x
						postionY = pos.y
						look = !(this.look_logicLeft > postionX || this.look_logicRight < postionX || this.look_logicTop > postionY || this.look_logicBottom < postionY);
					}
					break;
				case 2:
					if (!isNaN(args[0]) && !isNaN(args[1])) {
						postionX = args[0]
						postionY = args[1]
						look = !(this.look_logicLeft > postionX || this.look_logicRight < postionX || this.look_logicTop > postionY || this.look_logicBottom < postionY);
					}
					break;
			}
			return look;
		}

		/**
		 * 是否存在于摄像头里（区域碰撞检测） 不需要扩充
		 * @param postion 位置
		 * @return 
		 */
		lookIn2(postion: Vector2): boolean;
		/**
		 *  是否存在于摄像头里（区域碰撞检测）不需要扩充
		 * @param postionX
		 * @param postionY
		 * @return 
		 */
		lookIn2(postionX: number, postionY: number): boolean;

		lookIn2(...args: any[]): boolean {
			let look = false;
			let postionX: number, postionY: number;
			switch (args.length) {
				case 1:
					let pos = args[0];
					if (pos instanceof Vector2) {
						postionX = pos.x
						postionY = pos.y
						look = !(this.logicLeft > postionX || this.logicRight < postionX || this.logicTop > postionY || this.logicBottom < postionY);
					}
					break;
				case 2:
					if (!isNaN(args[0]) && !isNaN(args[1])) {
						postionX = args[0]
						postionY = args[1]
						look = !(this.logicLeft > postionX || this.logicRight < postionX || this.logicTop > postionY || this.logicBottom < postionY);
					}
					break;
			}
			return look;
		}

		lookInBuffer(x1: number, y1: number, width: number, height: number): boolean {
			// 判断两矩形是否相交、原理狠简单、如果相交、肯定其中一个矩形的顶点在另一个顶点内、
			let x2: number = x1 + width;
			let y2: number = y1 + height;

			let x3: number = this.bufferLeft;
			let y3: number = this.bufferTop;
			let x4: number = this.bufferRight;
			let y4: number = this.bufferBottom;

			return (((x1 >= x3 && x1 < x4) || (x3 >= x1 && x3 <= x2)) &&
				((y1 >= y3 && y1 < y4) || (y3 >= y1 && y3 <= y2))) ? true : false;

		}

		/**
		 * 屏幕震动 
		 * @param duration 持续时间，默认500ms
		 */
		shock(duration: number = 250): void {
			this._earthShock.start(duration);
		}

		/**
		 * 停止屏幕震动 
		 */
		shockStop(): void {
			this._earthShock.stop();
		}

		clear() {

		}
	}
}