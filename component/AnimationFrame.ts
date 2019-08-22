/**
* ui 模块序列帧动画 容器 
*/
module gamecomponent.component {
	export class AnimationFrame extends laya.display.Sprite {

		private _effect: EffectFrame;

		private _start: number = 0;
		private _total: number = 0;
		private _data: string = "";
		private _dataFix: string = "";
		private _fps: number = 0;

		private _isPlaying: boolean = false;
		private _needOverEvent: boolean = false;
		private _haveEventComplete: boolean = false;

		/**
		 * 
		 * @param value 配置信息
		 * @param needCenter 是否需要居中
		 * @param addUpdate 是否需要自定义心跳 默认要
		 */
		constructor(value: any, needCenter: boolean = false) {
			super();
			this._data = value.source;
			this._dataFix = value.fileName;
			this._fps = value.interval;
			this._start = value.start ? value.start : 0;
			this._total = value.frameCount ? value.frameCount : 0;
			let total: number = value.frameCount;
			this._effect = ObjectPools.malloc(EffectFrame, null, total, this._fps) as EffectFrame;
			if (value.sourcePath)
				this._effect.setAssetPath(value.sourcePath);
			if (!needCenter)
				this._effect.centrePoint = new Vector2(0, 0);
			//默认不触发鼠标点击
			this.setMouseEnabled(false);

			//如果有设置大小
			if (value.width && value.height) {
				if (value.height1)
					this.size(value.width, value.height1);
				else
					this.size(value.width, value.height);
			}
			// this.frameLoop(1, this, this.onDraw);
		}

		/**
		 * 设置是否接受鼠标事件
		 * @param value 
		 */
		setMouseEnabled(value: boolean) {
			this.mouseEnabled = value;
			if (this._effect) {
				this._effect.setMouseEnabled(value);
			}
		}

		get isPlaying(): boolean {
			return this._isPlaying && this._effect && !this._effect.isPlayEnd;
		}
		/**
		 * 开始播放
		 * @param start 
		 * @param isLoop 
		 * @param isNeedStopLastFram 是否播放完停留在最后一帧
		 */
		play(isLoop: boolean = false, reverse: boolean = false, isNeedStopLastFram: boolean = false): void {
			if (!this._effect) return;
			this._effect.isPlayEnd = false;
			this._haveEventComplete = false;
			this._effect.setLoop(isLoop);
			this._effect.setStopLastFrame(isNeedStopLastFram);
			this._effect.setData(this._data, this._fps, this._start, this._dataFix, reverse);
			this._isPlaying = true;
		}

		playFrame(isLoop: boolean = false): void {
			if (!this._effect) return;
			this._effect.isPlayEnd = false;
			this._effect.setLoop(isLoop);
			let loadArr: any = [];
			for (let i: number = 0; i < this._total; i++) {
				loadArr.push(CompoentPath.custom_atlas + this._data + "/" + (10000 + i) + ".jpg");
			}
			this._effect.setDataFrames(this._data, loadArr, this._fps, this._start, this._dataFix);
			this._isPlaying = true;
		}


		//帧率
		set interval(value: number) {
			if (this._effect)
				this._effect.setFps(value);
		}

		//绘制
		onDraw(): void {
			this.graphics.clear();
			if (this._effect) {
				if (!this._effect.isPlayEnd || (this._effect.isPlayEnd && this._effect.getStopLastFrame())) {
					this._effect.updateTexture();
					this._effect.onDraw(this.graphics);
				}
				//非循环 播放结束了就抛出事件
				else if (this._needOverEvent && !this._effect.loop && !this._haveEventComplete) {
					this.event(LEvent.COMPLETE);
					this._haveEventComplete = true;
				}
			}
		}

		/**
         * <p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
         * <p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
         * @param type		事件的类型。
         * @param caller	事件侦听函数的执行域。
         * @param listener	事件侦听函数。
         * @param args		（可选）事件侦听函数的回调参数。
         * @return 此 EventDispatcher 对象。
         */
		on(type: string, caller: any, listener: Function, args?: Array<any>): EventDispatcher {
			let onEvent = super.on(type, caller, listener, args);
			if (type == LEvent.COMPLETE)
				this._needOverEvent = true;//有监听结束事件
			return onEvent;
		}

		/**
         * 从 EventDispatcher 对象中删除侦听器。
         * @param type		事件的类型。
         * @param caller	事件侦听函数的执行域。
         * @param listener	事件侦听函数。
         * @param onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
         * @return 此 EventDispatcher 对象。
         */
		off(type: string, caller: any, listener: Function, onceOnly?: boolean): EventDispatcher {
			if (type == LEvent.COMPLETE)
				this._needOverEvent = false;//移除监听结束事件
			return super.off(type, caller, listener, onceOnly);
		}

		//清理
		clear(): void {
			this.graphics.clear();
			if (this._effect) {
				this._effect.isPlayEnd = true;
				this._haveEventComplete = true;
			}
			this._isPlaying = false;
		}

		//移除
		removeSelf(needClear: boolean = true): any {
			if (needClear)
				this.clear();
			super.removeSelf();
		}

		//销毁
		destroy(destroyChild?: boolean): void {
			this._effect && ObjectPools.free(this._effect);
			this._effect = null;
			this._needOverEvent = false;
			this._haveEventComplete = false;
			this.removeSelf(true);
			super.destroy(destroyChild);
		}
	}
}