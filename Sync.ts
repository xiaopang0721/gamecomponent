/**
* 同步时间 
*/
module gamecomponent {
	export class Sync {

		/**
		 * 星期日 
		 */
		public static SUNDAY: number = 0;
		/**
		 * 星期一 
		 */
		public static MONDAY: number = 1;
		/**
		 * 星期二 
		 */
		public static TUESDAY: number = 2;
		/**
		 * 星期三 
		 */
		public static WEDNESDAY: number = 3;
		/**
		 * 星期四 
		 */
		public static THURSDAY: number = 4;
		/**
		 * 星期五 
		 */
		public static FRIDAY: number = 5;
		/**
		 * 星期六 
		 */
		public static SATURDAY: number = 6;

		/**
		 * 一天多少秒
		 */
		public static DAY_SECONDS: number = 86400;
		public static UTC_SECONDS: number = 28800;

		/*web服务器时间 单位秒*/
		private _serverWebTime: number = 0;
		/*web服务器时间同步的时间单位毫秒*/
		private _ostWeb: number = 0;

		/*服务器时间 单位秒*/
		private _serverTime: number = 0;
		/*服务器时间同步的时间单位毫秒*/
		private _ost: number = 0;
		/*服务器运行时间 单位毫秒*/
		private _systemRunTime: number = 0;
		/*服务器运行时间同步的时间 单位毫秒*/
		private _osrt: number = 0;
		/*服务器运行时间同步的时间 单位毫秒*/
		private _oserverRunt: number = 0;
		/*自然时间的服务器启动时间 单位秒*/
		private _serverStartTime: number = 0;

		/*需要同步时间*/
		private _hasSyncTime: boolean;

		/*时间同步损耗*/
		private _syncLoss: number = 0;


		//事件
		private static _date: Date = new Date();

		// 应用程序引用
		private _game: Game;
		constructor(v: Game) {
			this._game = v;
		}

		//初始化
		public init(): void {

			this._game.sceneGame.network.addHanlder(Protocols.MSG_SYNC_MSTIME, this, this.onUpdateSync);
		}

		private onUpdateSync(optcode: number, msg: hanlder.both_sync_mstime) {
			this.syncServerTime(msg.time_now);
			this.syncSystemRunTime(msg.mstime_now);
		}

		/**
		 * 更新同步的时间
		 */
		public synctimeUpdate(value: number): void {
			if (!value) return;
			let date: Date = new Date();
			let time: number = date.getDate() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
			if (time >= value) {
				this._syncLoss = time - value
			}
			else {
				this._syncLoss = time + 24 * 3600000 - value
			}
			logd("同步时间消耗：", this._syncLoss);
		}

		/**
		 * web服务器同步时间
		 */
		public syncServerWebTime(value: number): void {
			this._serverWebTime = value;
			this._ostWeb = Laya.timer.currTimer;
			// logd("同步服务器时间",Sync.getTimeStr(this._serverTime*1000),Sync.getTimeStr(this._ost))
		}
		/**
		 * 获取当前web服务器时间(秒)
		 */
		public get serverWebTimeBys(): number {
			if (this._serverWebTime) {
				// logd("当前服务器时间",Sync.getTimeStr(this._serverTime*1000),Sync.getTimeStr(Laya.timer.currTimer),Sync.getTimeStr(this._ost))
				return this._serverWebTime + (Laya.timer.currTimer - this._ostWeb) / 1000;
			}
			else {
				return Date.now() / 1000;
			}
		}

		/**
		 * 服务器同步时间
		 */
		public syncServerTime(value: number): void {
			this._serverTime = value;
			this._ost = Laya.timer.currTimer;
			// logd("同步服务器时间",Sync.getTimeStr(this._serverTime*1000),Sync.getTimeStr(this._ost))
		}

		/**
		 * 服务器同步时间
		 */
		public syncSystemRunTime(value: number): void {
			this._systemRunTime = value;
			this._osrt = Laya.timer.currTimer;
		}

		/**
		 * 获取当前服务器时间(秒)
		 */
		public get serverTimeBys(): number {
			if (this._serverTime) {
				// logd("当前服务器时间",Sync.getTimeStr(this._serverTime*1000),Sync.getTimeStr(Laya.timer.currTimer),Sync.getTimeStr(this._ost))
				return this._serverTime + (Laya.timer.currTimer + this._syncLoss - this._ost) / 1000;
			}
			else {
				this._hasSyncTime = true;
				return Date.now() / 1000;
			}
		}

		/**
		 * 获取当前服务器运行时间(毫秒)
		 */
		public get systemRunTimeByms(): number {
			if (this._systemRunTime) {
				return (this._systemRunTime + this._syncLoss - this._osrt) + Laya.timer.currTimer;
			}
			else {
				this._hasSyncTime = true;
				return 0;
			}
		}

		private _nextCheckTime: number = 0;

		public update(diff: number): void {
			if (this._hasSyncTime) {
				if (this._nextCheckTime > diff) {
					this._nextCheckTime -= diff;
				}
				else {
					this._game.sceneGame.network.call_sync_mstime(0, 0, 0);
					this._hasSyncTime = false;
					this._nextCheckTime = 30000;
				}
			}
		}
		/**
		 * 获取小时
		 * @param value  时间戳毫秒
		 */
		public static getHours(value: number): number {
			this._date.setTime(value);
			return this._date.getHours();
		}

		/**
		 * 获取当月天
		 * @param value  时间戳毫秒
		 */
		public static getDays(value: number): number {
			this._date.setTime(value);
			return this._date.getDate();
		}

		/**
		 * 获取时间字符串 2017-3-20 09:09:10
		 * @param value  时间戳毫秒
		 */

		public static getTimeStr(value: number): string {
			this._date.setTime(value);
			return this._date.getFullYear() + "-" + (this._date.getMonth() + 1) + "-" + this._date.getDate() + " " +
				StringU.paddingLeft(this._date.getHours().toString(), "0", 2) + ":" + StringU.paddingLeft(this._date.getMinutes().toString(), "0", 2) + ":" + StringU.paddingLeft(this._date.getSeconds().toString(), "0", 2);
		}

		/**
		 * 获取当前时间戳是否在对应区间内
		 * @param value 当前时间戳秒
		 * @param min 当前时间小值 9：00:00
		 * @param max 当前时间大值 10：00:00
		 */
		public static getTimeByStrMinAndMax(value: number, min: string, max: string) {
			let curTime = value * 1000;

			let minArr = min.split(":");
			let minHH = parseInt(minArr[0]);
			let minMM = parseInt(minArr[1]);
			let minSS = parseInt(minArr[2]);

			this._date.setTime(curTime);
			this._date.setHours(minHH);
			this._date.setMinutes(minMM);
			this._date.setSeconds(minSS);
			let minTime = this._date.getTime();

			let maxArr = max.split(":");
			let maxHH = parseInt(maxArr[0]);
			let maxMM = parseInt(maxArr[1]);
			let maxSS = parseInt(maxArr[2]);

			this._date.setTime(curTime);
			this._date.setHours(maxHH);
			this._date.setMinutes(maxMM);
			this._date.setSeconds(maxSS);
			let maxTime = this._date.getTime();

			if (minTime <= curTime && maxTime >= curTime) {
				return true;
			}

			return false;
		}

		/**
		 * 获取时间字符串 2018.3.20
		 * @param value  时间戳毫秒
		 */

		public static getTimeStr1(value: number): string {
			this._date.setTime(value);
			return this._date.getFullYear() + "." + (this._date.getMonth() + 1) + "." + this._date.getDate();
		}

		/**
		 * 获取时间字符串 3.20
		 * @param value  时间戳毫秒
		 */

		public static getTimeStr2(value: number): string {
			this._date.setTime(value);
			return (this._date.getMonth() + 1) + "." + this._date.getDate();
		}

		/**
		 * 获取时间字符串 2019-03-04
		 * @param value  时间戳毫秒
		 */

		public static getTimeStr3(value: number): string {
			this._date.setTime(value * 1000);
			let year = this._date.getFullYear();
			let month = this._date.getMonth() + 1;
			let date = this._date.getDate();
			return year + "-" + StringU.paddingLeft(month.toString(), "0", 2) + "-" + StringU.paddingLeft(date.toString(), "0", 2);
		}

		/**
		 * 获取星期几
		 * @param value  时间戳毫秒
		 */
		public static getTimeWeekDay(value: number): number {
			this._date.setTime(value);
			return this._date.getDay();
		}

		/**
		 * 获取一个时间戳所在的周一到周日日期
		 */
		public static getTimeWeek(value: number): string {
			let startWeek = 1;//周一开始
			let startDate, endDate;
			let dayWeek = this.getTimeWeekDay(value * 1000);
			dayWeek = dayWeek == 0 ? 7 : dayWeek;

			this._date.setTime(value * 1000);
			let diff = startWeek - dayWeek;
			this._date.setDate(this._date.getDate() + diff);
			startDate = this.getTimeStr2(this._date.getTime());

			this._date.setDate(this._date.getDate() + 6);
			endDate = this.getTimeStr2(this._date.getTime());
			return startDate + "-" + endDate;
		}

		/**
		 * 获取当日时间 秒
		 * @param value  时间毫秒
		 */
		public static getDayTime(value: number): number {
			this._date.setTime(value);
			return this._date.getHours() * 60 * 60 + this._date.getMinutes() * 60 + this._date.getSeconds();
		}

		/**
		 * 获取时间字符串 09:09:10
		 * @param value  时间戳毫秒
		 */
		public static getTimeShortStr(value: number): string {
			this._date.setTime(value);
			return StringU.paddingLeft(this._date.getHours().toString(), "0", 2) + ":" + StringU.paddingLeft(this._date.getMinutes().toString(), "0", 2) + ":" + StringU.paddingLeft(this._date.getSeconds().toString(), "0", 2);
		}

		/**
		 * 获取时间字符串 09:09:10:00
		 * @param value  时间戳毫秒
		 */
		public static getTimeShortStr1(value: number): string {
			this._date.setTime(value);
			return this._date.getHours() + ":" + this._date.getMinutes() + ":" + this._date.getSeconds() + ":" + this._date.getMilliseconds();
		}

		/**
		 * 获取当日零点时间
		 * @param value  时间戳秒
		 * @return 返回时间秒
		 */
		public static getDayZeroTime(value: number): number {
			this._date.setTime(value * 1000);
			this._date.setHours(0);
			this._date.setMinutes(0);
			this._date.setSeconds(0);
			this._date.setMilliseconds(0);
			return this._date.getTime() / 1000;
		}

		/**
		 * 获取时间字符串 09:09:10
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr2(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = MathU.parseInt(value % 3600);
			let m: number = MathU.parseInt(value / 60);
			let s: number = MathU.parseInt(value % 60);
			return StringU.paddingLeft(h.toString(), "0", 2) + ":" + StringU.paddingLeft(m.toString(), "0", 2) + ":" + StringU.paddingLeft(s.toString(), "0", 2);
		}

		/**
		 * 获取时间字符串 09:10(分秒)
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr3(value: number): string {
			let m: number = MathU.parseInt(value / 60);
			let s: number = MathU.parseInt(value % 60);
			return StringU.paddingLeft(m.toString(), "0", 2) + ":" + StringU.paddingLeft(s.toString(), "0", 2);
		}

		/**
		 * 获取时间字符串 09:10(时分)
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr4(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = value - h * 3600;
			let m: number = MathU.parseInt(value / 60);
			return StringU.paddingLeft(h.toString(), "0", 2) + ":" + StringU.paddingLeft(m.toString(), "0", 2);
		}

		/**
		 * 获取时间字符串 9天9小时9分钟9秒
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr5(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = value - h * 3600;
			let d: number = MathU.parseInt(h / 24);
			h = h - d * 24;
			let m: number = MathU.parseInt(value / 60);
			let s: number = MathU.parseInt(value % 60);
			let str: string = "";
			if (d > 0) str += d + "天";
			if (h > 0) str += h + "小时";
			if (m > 0) str += m + "分钟";
			str += s + "秒";
			return str;
		}

		/**
		 * 获取时间字符串 几天或几小时或几分钟或几秒
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr6(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = value - h * 3600;
			let d: number = MathU.parseInt(h / 24);
			if (d > 0) return d + "天";
			h = h - d * 24;
			if (h > 0) return h + "小时";
			let m: number = MathU.parseInt(value / 60);
			if (m > 0) return m + "分钟";
			let s: number = MathU.parseInt(value % 60);
			return s + "秒";
		}

		/**
		 * 获取时间字符串 10月1日
		 * @param value  时间戳秒
		 */
		public static getTimeStr7(value: number): string {
			this._date.setTime(value * 1000);
			return (this._date.getMonth() + 1) + L.GetLang(146) + this._date.getDate() + L.GetLang(147);
		}

		/**
		 * 获取时间字符串 9天9小时或 9小时9分钟 或 9分钟9秒 如果不足1分钟 显示 53秒
		 * @param value  剩余时间秒
		 */
		public static getTimeShortStr8(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = value - h * 3600;
			let d: number = MathU.parseInt(h / 24);
			h = h - d * 24;
			let m: number = MathU.parseInt(value / 60);
			let s: number = MathU.parseInt(value % 60);
			let str: string = "";
			if (d > 0) str += d + "天";
			if (h > 0) str += h + "小时";
			if (d > 0 && h > 0) return str;

			if (m > 0) str += m + "分钟";
			if (h > 0 && m > 0) return str;

			if (str.length == 0) str += s + "秒";
			return str;
		}

		/**
	 * 获取时间字符串 几天几小时或小时分或几分钟几秒
	 * @param value  剩余时间秒
	 */
		public static getTimeShortStr9(value: number): string {
			let h: number = MathU.parseInt(value / 3600);
			value = value - h * 3600;
			let d: number = MathU.parseInt(h / 24);
			if (d > 0) {
				h = h - d * 24;
				return d + "天" + h + "小时";
			}
			h = h - d * 24;
			if (h > 0) {
				let m: number = MathU.parseInt(value / 60);
				return h + "小时" + m + "分钟";
			}
			let m: number = MathU.parseInt(value / 60);
			if (m > 0) {
				let s: number = MathU.parseInt(value % 60);
				return m + "分钟" + s + "秒";
			}
			let s: number = MathU.parseInt(value % 60);
			return s + "秒";
		}

		/**
		 *获取时间，1200(时，分) 
		 */
		public static getNumTime(value: number): number {
			this._date.setTime(value);
			let hours = this._date.getHours() * 100;
			let minutes = this._date.getMinutes();
			let time = hours + minutes;
			return time;
		}

		/**
		 * 是否当天时间
		 * @param value  时间秒
		 */
		public static getIsToday(value: number, value1: number): boolean {
			this._date.setTime(1000 * value);
			let dayStr = "" + this._date.getFullYear() + this._date.getMonth() + this._date.getDate();
			this._date.setTime(1000 * value1);
			let dayStr1 = "" + this._date.getFullYear() + this._date.getMonth() + this._date.getDate();
			return Boolean(dayStr == dayStr1);
		}


		/**对应年月日时间戳
		 */
		public static getYearMonthDayTime(value: number): number {
			this._date.setTime(value * 1000);
			let hours = this._date.getHours() * 60 * 60 * 1000;
			let minutes = this._date.getMinutes() * 60 * 1000;
			let second = this._date.getSeconds() * 1000;
			let time = this._date.getTime() - hours - minutes - second;
			return time * 0.001;
		}

		/**
		 * 释放
		 */
		public dispose(): void {
			this._nextCheckTime = 0;
			this._game.sceneGame.network.removeHanlder(Protocols.MSG_SYNC_MSTIME, this, this.onUpdateSync);
		}
	}
}