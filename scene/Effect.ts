/**
* 特效基类
*/
module gamecomponent.scene{
	export class Effect{
		//根贴图编码
		get __ROOT_ID(): number{
			return this._texture ? this._texture["__ROOT_ID"] : 0;
		}
		
		// 朝向
		protected _toward: number;
		public get toward(): number {
			return this._toward;
		}
		public set toward(value: number) {
			if (this._toward == value) return;
			this._toward = value;
		}
		// 绘制时的素材朝向
		protected _drawDirect: number;
		// 绘制时是否水平翻转
		protected _drawHorizonal: boolean;

		// 特效启动时间 
		protected _startTime: number;
		// 每帧时长 (直接固定死)
		protected _frameTime: number = 83;
		// 帧数量
		protected _frameCount: number;
		// 获得特效的时长 
		protected _duration: number;
		// 当前帧
		protected _curFrameIndex: number;
		// 是否循环播放 注意：循环播放为true时，必须手工释放
		protected _loop: boolean;

		// 延迟时间
		private _delayTimer:number = 0;
		set delayTimer(v:number){
			this._delayTimer = v;
			this._startTime = Laya.timer.currTimer + this._delayTimer;
		}


		setLoop(v:boolean){
			this._loop = v;
		}
		
		// 是否已经播放到末尾 
		isPlayEnd: boolean;
		// 是否置于场景底部 
		atBottom: boolean;
		/**
		 * 特效跟随WorldObject，如果为null，说明没有跟随任何对象
		 * 注意(fly模式优先于anchorObject模式优先于anchorPostion)
		 */
		// anchorObject:Unit;
		/**
		 * 特效跟随地图场景的位置 Vector2 
		 * 注意(fly模式优先于anchorObject模式优先于anchorPostion)
		 */
		anchorPostion: Vector2;

		anchorPosX:number=0;
		anchorPosY:number=0

		/**是否uiShow */
		is_uiShow:boolean = false;

		protected _texture: Texture;
		protected _regX:number = 0;
		protected _regY:number = 0;
		protected _drawX: number;
		protected _drawY: number;
		protected _drawW: number;
		protected _drawH: number;
		protected _drawMix: Matrix;

		protected _scale:number = 1;
		
		protected _offsetX:number = 0;
		protected _offsetY:number = 0;

		protected _data:string;
		get data():string{
			return this._data;
		}
		
		protected _fps:number;

		protected _tempMix: Matrix;

		constructor(){
			this._tempMix = new Matrix();
			this.reset();
		}

		get width():number{
			return this._drawW;
		}

		get height():number{
			return this._drawH;
		}

		setData(data: string, fps:number = 12):void{
			this._data = data;
			this.setFps(fps);
		}
		
		// 设置数据
		setFps(v:number){
			this._fps = v;
			this._frameTime = Math.floor(1000 / v);
			this._startTime = Laya.timer.currTimer + this._delayTimer;
		}

		set scale(v:number){
			this._scale = v;
		}

		// 设置偏移
		setOffset(x:number, y:number):void{
			this._offsetX = x;
			this._offsetY = y;
		}

		updateTexture(): void {
			//hold素材，不要被释放
			let currTimer = Laya.timer.currTimer;
			if(this._startTime > currTimer){
				return;
			}
			//判断播放时间是否结束，循环的除外
			if (!this._loop && (currTimer - this._startTime) >= this._duration) {
				this.isPlayEnd = true;
				return;
			}
			//获得无限完整动画循环之后剩余的时间
			let totalTime = this._frameTime * this._frameCount;
			let frameYu: number = (currTimer - this._startTime) % totalTime;
			//定位到帧位置
			this._curFrameIndex = MathU.parseInt(frameYu / this._frameTime);
			if (this._curFrameIndex >= this._frameCount){
				this._curFrameIndex = this._frameCount - 1;
			}	
		}

		// 更新变换信息
		protected updateTransform(camera: Camera):void{
			let pos: Vector2;
			let posX:number, posY:number;
			// if (this.anchorObject) {
			// 	if(this.anchorObject.userData instanceof AvatarBase){
			// 		posX = this.anchorObject.userData.pos.x;
			// 		posY = this.anchorObject.userData.pos.y;
			// 	}
			// 	else{
			// 		posX = this.anchorObject.pos.x;
			// 		posY = this.anchorObject.pos.y;
			// 	}
			// } else 
            if (this.anchorPostion) {
				posX = this.anchorPostion.x;
				posY = this.anchorPostion.y;
			}
			else if(this.anchorPosX > 0 && this.anchorPosY > 0){
				posX = this.anchorPosX;
				posY = this.anchorPosY;
			}
			if(!this.is_uiShow){
				this._drawX = camera.getScenePxByCellX(posX) + this._offsetX;
				this._drawY = camera.getScenePxByCellY(posY) + this._offsetY;
			}
			else{
				this._drawX = posX + this._offsetX;
				this._drawY = posY + this._offsetY
			}
			if(this._texture){
				this._drawW = this._texture.sourceWidth;
				this._drawH = this._texture.sourceHeight;
			}
		}
		
		// 绘制
		onDraw(g: Graphics, camera: Camera): void {
			if(!this._texture || this._startTime > Laya.timer.currTimer){
				return;
			}
			this.updateTransform(camera);
			g.drawTexture(this._texture, this._drawX, this._drawY, this._drawW, this._drawH, this._drawMix);
			this._texture = null;
			this._drawMix = null;
		}

		// 释放 
		reset(): void {
			this.toward = Direct.BOTTOM;

			// this.anchorObject = null;
			this.anchorPostion = null;
			this.atBottom = false;
			this._loop = false;
			this.isPlayEnd = false;
			this.is_uiShow = false;
			this._duration = 600000;
			this._startTime = 0;
			this._delayTimer = 0;
			this._frameCount = 0;
			this._curFrameIndex = 0;
			this._regX = 0;
			this._regY = 0;
			this._scale = 1;
			this._offsetX = 0;
			this._offsetY = 0;
			this._texture = null;
			this._drawMix = null;
			this._data = null;
		}
	}
}