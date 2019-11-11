/**
* url工厂
*/
module utils {
	export class RandomUrlFactory {
		private _serverUrlList: any[] = []
		private _handle: Handler;
		private _waitHandleList: Handler[] = [];
		private _url: string;
		private _platformUrl: string = Laya.URL.basePath + (!WebConfig.isDebug ? "conf/platformUrl.bin?v=" : "conf/platformUrl.json?v=");
		private static _ins: RandomUrlFactory;
		constructor() {
			Laya.loader.on(LEvent.ERROR, this, (url) => {
				if (url && this._url == url) {
					this.startHandle(this._handle);
				}
			})
		}

		static get ins(): RandomUrlFactory {
			if (!this._ins) {
				this._ins = new RandomUrlFactory();
			}
			return this._ins
		}

		private _isLoading: boolean;
		/**
		 * 获取url
		 * @param type 类型
		 * @param completeHandler 回调
		 */
		getUrl(handle: Handler) {
			let server_url = WebConfig.serviceurl;
			if (server_url) {
				let arr = server_url.split(":");
				if (arr.length > 1 && parseInt(arr[1]) < 65535) {
					if (handle) {
						handle.runWith({ index: 0, url: server_url });
						handle && handle.recover();
						handle = null;
					}
					return;
				}
			}
			if (this._isLoading) {
				this._waitHandleList.push(handle);
				return;
			}
			//开始处理回调
			this.startHandle(handle);
		}

		private startHandle(handle: Handler) {
			this._isLoading = true;
			this._handle = handle;
			let needLoad = !this._serverUrlList.length;
			if (needLoad) {//列表为空 去加载
				this._url = this._platformUrl + (isDebug ? MathU.randomRange(1, 1000000).toString() : cur_vesion);
				logd("生成一个新地址", this._url);
				Laya.loader.load(this._url, Handler.create(this, this.completeHandler));
			} else {//否则去回调
				this.doHandle();
			}
		}


		/**
		 * 回收url
		 * @param type 类型
		 */
		recoverUrl(url: string) {
			let indx = this._serverUrlList.indexOf(url);
			if (indx == -1) return;
			logd("回收 url", url);
			this._serverUrlList.splice(indx, 1);
		}

		//加载完成 解析数据
		private completeHandler(data: any) {
			if (isDebug) {
				let conf_url_value = Laya.loader.getRes(this._url);
				Laya.loader.clearRes(this._url);
				if (conf_url_value) {
					this._serverUrlList = conf_url_value.server_url[WebConfig.platform] || conf_url_value.server_url["default"];
				}
			} else {
				let conf_url = Laya.loader.getRes(this._url);
				Laya.loader.clearRes(this._url);
				if (conf_url) {
					let conf_url_byteArray = new ByteArray(conf_url);
					let conf_url_value: any = JSON.parse(StringU.readZlibData(conf_url_byteArray));
					this._serverUrlList = conf_url_value.server_url[WebConfig.platform] || conf_url_value.server_url["default"];
				}
			}

			this.doHandle();
		}

		private doHandle() {
			let idx = MathU.randomRange(0, this._serverUrlList.length - 1);
			logd("创建 url", this._serverUrlList[idx]);
			if (this._handle) {
				this._handle.runWith({ index: idx, url: this._serverUrlList[idx] });
				this._handle && this._handle.recover();
				this._handle = null;
			}

			if (this._waitHandleList.length > 0) {
				this.startHandle(this._waitHandleList.shift());
			}
			this._isLoading = false;
		}
	}
}