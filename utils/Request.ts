/**
* 网络请求
*/
module utils {
	export class Request {
		static failFunc: Handler;
		static sucessFunc: Handler;
		static defTimeoutFunc: Handler;
		static defWaitFunc: Handler;
		// 请求队列
		private static _queue: Array<RequestInfo> = [];
		//阻塞式转圈圈请求（超时出现弹窗）
		static SENDMODE_A: number = 1;
		//阻塞式不转圈圈请求（超时出现弹窗）
		static SENDMODE_B: number = 2;
		//非阻塞式请求（超时不处理）
		static SENDMODE_C: number = 3;

		/**
		 * 阻塞式转圈圈请求（超时出现弹窗）
		 * @param url 
		 * @param data
		 * @param callback 
		 * @param errorback 
		 * @param errorback 
		 * @param waitFunc 
		 */
		static sendA(url: string, data: any, callback?: Handler, timeoutFunc?: Handler, waitFunc?: Handler): void {
			if (!url) {
				throw new Error("地址null");
			}
			let info = new RequestInfo();
			info.url = url;

			info.data = data;
			info.callback = Handler.create(this, this.complete, [info, callback], false);
			info.timeoutFunc = (timeoutFunc || this.defTimeoutFunc);
			info.failback = this.failFunc;
			info.sucessback = this.sucessFunc;
			info.waitFunc = (waitFunc || this.defWaitFunc);
			this._queue.push(info);
			this.checkQueue();
		}

		/**
		 * 检查队列
		 */
		private static checkQueue(): void {
			let info = this._queue[0];
			info && info.trySend();
		}

		/**
		 * 请求完成时
		 * @param info 
		 */
		private static complete(info: RequestInfo, callback: Handler, value: any): void {
			let idx = this._queue.indexOf(info);
			idx != -1 && this._queue.splice(idx, 1);
			callback && callback.runWith(value);
			this.checkQueue();
		}

		// /**
		//  * 测试
		//  */
		// static test(): void {
		// 	this.sendA("http://wwww.baidu.com", "11111",
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		})
		// 	);
		// 	this.sendA("http://wwww.baidu.com", "22222",
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		})
		// 	);
		// 	this.sendA("http://wwww.baidu.com", "3333",
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		}),
		// 		Handler.create(this, (v) => {
		// 			logd(v)
		// 		})
		// 	);
		// }
	}

	/**
	 * 请求结构体
	 */
	export class RequestInfo {
		static TIMEOUT = 10000;		// 超时时间

		static STATE_NONE = 0;		// 无
		static STATE_WAIT = 1;		// 等待
		static STATE_COMPLETE = 2;	// 完成
		static STATE_PAUSE = 3;		// 暂停
		private _request: HttpRequest;
		/**
		 * 地址
		 */
		url: string;
		/**
		 * post body
		 */
		data: string;
		/**
		 * 等候函数
		 */
		waitFunc: Handler;
		/**
		 * 出错函数
		 */
		timeoutFunc: Handler;
		/**
		 * 完成回调函数
		 */
		callback: Handler;
		/**
		 * 错误回调函数
		 */
		failback: Handler;
		/**
		 * 成功返回函数
		 */
		sucessback: Handler;
		/**
		 * 超时时间
		 */
		timeout: number;
		/**
		 * 状态
		 */
		state: number;

		/**
		 * 是否等待数据返回
		 */
		get isWait(): boolean {
			return this.state == RequestInfo.STATE_WAIT;
		}

		/**
		 * 是否已完成
		 */
		get isComplete(): boolean {
			return this.state == RequestInfo.STATE_COMPLETE;
		}

		/**
		 * 是否暂停
		 */
		get isPause(): boolean {
			return this.state == RequestInfo.STATE_PAUSE;
		}
		/**
		 * 暂停
		 */
		pause(): void {
			this.state = RequestInfo.STATE_PAUSE;
		}

		/**
		 * 继续
		 */
		continue(): void {
			this.state = RequestInfo.STATE_NONE;
			this.trySend();
		}

		constructor() {
			this.state = RequestInfo.STATE_NONE;
			Laya.timer.loop(1000, this, this.checkTimeout);
		}
		/**
		 * 尝试发送
		 */
		trySend(): void {
			if (this.isWait || this.isPause) {
				return;
			}
			this.state = RequestInfo.STATE_WAIT;
			// 等待函数
			this.waitFunc && this.waitFunc.run();

			this.timeout = Laya.timer.currTimer + RequestInfo.TIMEOUT;
			if (!this._request) {
				this._request = new HttpRequest();
				this._request.http.timeout = RequestInfo.TIMEOUT;
			}
			let data = parseObjToUrlParameter(this.data);
			this._request.once(LEvent.COMPLETE, this, (value: any) => {
				this.state = RequestInfo.STATE_COMPLETE;
				Laya.timer.clear(this, this.checkTimeout);
				logd('RequestInfo COMPLETE:', this.url, data, 'info:' + value);
				logd("-------------------", value)
				Laya.timer.clear(this, this.trySend);
				this._request.offAll();
				value = JSON.parse(value)
				if (this.callback != null && value)
					this.callback.runWith(value);
				if (this.failback != null && value && value.success != 0)
					this.failback.runWith(value);
				if (this.sucessback != null && value && value.success == 0)
					this.sucessback.runWith(this.url);
			});
			this._request.once(LEvent.ERROR, this, (...args) => {
				logd('RequestInfo ERROR:', this.url, data, 'info:' + args);
				if (this._request.http.status != 500) {
					// 出错3000后再次尝试
					this.doTimeout(false);
					Laya.timer.once(3000, this, this.trySend);
				}
			});

			this._request.send(this.url, data, "post");
		}

		private doTimeout(realTimeOut: boolean = true): void {
			Laya.timer.clear(this, this.trySend);
			this._request.offAll();

			this.state = RequestInfo.STATE_NONE;
			if (this.timeoutFunc && realTimeOut) {
				let args = this.timeoutFunc.args;
				if (!args) {
					args = [];
					this.timeoutFunc.args = args;
				}
				args.indexOf(this) == -1 && args.push(this);
				this.timeoutFunc.run();
			}
			this.trySend();
		}

		/**
		 * 校验是否超时
		 */
		private checkTimeout(): void {
			if (this.isWait && this.timeout < Laya.timer.currTimer) {
				this.doTimeout();
			}
		}
	}
}