/**UI帧动画类
* name 
*/
module gamecomponent.component{
	import Component = laya.ui.Component;
	export class UIFrameAnimation{
		poolName: string = 'UIFrameAnimation';
		private _fps:number;				//帧率
		private _isLoop:boolean;			//是否循环播放
		private _isPlaying:boolean;			//是否播放中
		private _comps:any[];			//动画对象列表
		private _frames:any[][];			//动画对象帧列表
		private _propList:any[];
		private _flagEnd:boolean[];			//动画对象播放状态
		private _startTime:number;			//动画开始时间
		private _curFrame:number;			//当前帧
		private _totalFrame:number;			//总帧数
		private _tweenUpdateHandler:Handler;//缓动动画更新回调函数
		private _completeHandler:Handler;	//动画完成回调函数
		private _updateHandler:Handler;		//动画更新回调函数

		public isFree:boolean = true;

		constructor(fps:number = 12){
			this._totalFrame = 0;
			this._fps = fps;
			this._comps = [];
			this._frames = [];
			this._flagEnd = [];
			this._propList = [];
			this._tweenUpdateHandler = Handler.create(this, this.onTweenUpdate, null, false);
		}
		/**
		 * 进池 （相当于对象dispose函数）
		 */
		intoPool(...arg): void {
			this.reset();
			this.isFree = true;
		}
		/**
		 * 出池 （相当于对象初始化函数）
		 */
		outPool(...arg): void {
			if(arg && arg.length) this._fps = arg[0];
			this.isFree = false;
		}
		/**动画完成回调函数*/
		set completeHandler(h:Handler){
			this._completeHandler = h;
		}
		/**动画更新回调函数*/
		set updateHandler(h:Handler){
			this._updateHandler = h;
		}
		/**是否播放中*/
		get isPlaying():boolean{
			return this._isPlaying;
		}
		/**添加动画对象和帧列表*/
		public addTarget(comp:any,props:any[],frames:any[]):void{
			if(!comp || !frames || !frames.length) return;
			this._comps[this._comps.length] = comp;
			this._propList[this._propList.length] = props;
			this._frames[this._frames.length] = frames;
			let frame:number = frames[frames.length-1].frame;
			if(frame > this._totalFrame) this._totalFrame = frame;
		}
		/**删除动画对象和帧列表*/
		public removeTarget(comp:any):void{
			if(!comp) return;
			let index:number = this._comps.indexOf(comp);
			if(index == -1) return;
			this._comps.splice(index,1);
			this._frames.splice(index,1);
			this._propList.splice(index,1);
		}
		/**开始播放*/
		public play(isLoop:boolean=false,fps:number = 0):void{
			if(this._isPlaying) this.stop();
			if(fps) this._fps = fps;
			this._isLoop = isLoop;
			this._curFrame = -1;
			this._startTime = Laya.timer.currTimer;
			let len = this._comps? this._comps.length : 0;
			for(let i:number = 0; i < len; i++)
				this.updateTween(this._comps[i], 0);
			this._isPlaying = true;
		}
		/**更新动画*/
		private updateTween(comp:any, index:number):void{
			let idx:number = this._comps.indexOf(comp);
			if(idx == -1) return;
			if(index >= this._frames[idx].length){
				if(this._flagEnd.length <= idx) this._flagEnd.length = idx+1;
				this._flagEnd[idx] = true;
				this.checkAndLoop();
				return;
			}
			let prev:number = index ? this._frames[idx][index-1].frame : 0;
			let props:any = this._propList[idx][index];
			let frameObj:any = this._frames[idx][index];
			let time:number = (frameObj.frame-prev)*1000/this._fps;
			props.update = this._tweenUpdateHandler;
			let ease:Function = frameObj.hasOwnProperty("ease")? frameObj.ease : Laya.Ease.linearNone;
			Laya.Tween.to(comp, props, time, ease, Handler.create(this, this.updateTween, [comp, index+1]));
		}
		//缓动动画更新
		private onTweenUpdate():void{
			let frame:number = Math.floor((Laya.timer.currTimer - this._startTime)*this._fps/1000);
			if(frame > this._totalFrame || this._curFrame == frame) return;
			if(this._updateHandler) this._updateHandler.runWith(frame);
			this._curFrame = frame;
		}
		/**检测并循环播放*/
		private checkAndLoop():void{
			if(this._flagEnd.length < this._comps.length) return;
			let index:number = this._flagEnd.indexOf(undefined);
			if(index != -1) return;
			this._flagEnd.length = 0;
			this._isPlaying = false;
			if(this._isLoop) this.play(true);
			else if(this._completeHandler) this._completeHandler.run();
		}
		/**停止播放*/
		public stop():void{
			let len = this._comps? this._comps.length : 0;
			for(let i:number = 0; i < len; i++)
				Laya.Tween.clearAll(this._comps[i]);
			this._flagEnd.length = 0;
			this._isPlaying = false;
		}
		/**销毁*/
		public reset():void{
			if(this._isPlaying) this.stop();
			if(this._completeHandler){
				this._completeHandler.recover();
				this._completeHandler = null;
			}
			if(this._updateHandler){
				this._updateHandler.recover();
				this._updateHandler = null;
			}
			this._comps.length = this._frames.length = this._propList.length = 0;
			this._fps = 12;
			this._startTime = this._curFrame = this._totalFrame = 0;
			this._isLoop = this._isPlaying = false;
		}
	}
}