module gamecomponent.object {
	/**
	 * 玩家
	 */
	export class PlayerData extends game.object.PlayerDataField {
		public readonly NAN: number = 1;//性别男
		public readonly NV: number = 2;//性别女
		public readonly WU: number = 3;//性别未知
		protected _sceneObjectMgr: SceneObjectMgr;
		protected _playerInfo: PlayerInfo;
		private _game: Game;
		/**
		 * 场景对象管理器
		 */
		get sceneObjectMgr(): SceneObjectMgr {
			return this._sceneObjectMgr;
		}

		constructor(v: SceneObjectMgr) {
			super();
			this._game = v.game;
			this._playerInfo = new PlayerInfo();
			this._sceneObjectMgr = v;
			this._after_update = this.onUpdate;
		}

		get playerInfo() {
			return this._playerInfo;
		}

		onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			let ness: number = 0;
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_BYTE0)) {
				this._playerInfo.sex = this.GetSex();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_BIT0)) {
				this._playerInfo.isguest = this.IsIsGuest();
				this._playerInfo.isqmdl = this.IsIsQmdl();
				this._playerInfo.islxqd = this.IsIsLxqd();
				this._playerInfo.isxylp = this.IsIsXylp();
				this._playerInfo.is_shared = this.IsIsShare();

				this._playerInfo.is_can_qd = this.IsIsShowRedQianDao();
				this._playerInfo.is_can_lp = this.IsIsShowRedLunPan();
				this._playerInfo.is_show_alipay = this.IsIsShowAlipay()
				this._playerInfo.is_show_bank = this.IsIsShowBank();
				this._playerInfo.is_wx_open = this.IsIsOpenWX();
				this._playerInfo.is_outer_jump = this.IsIsOuterJump();
				this._playerInfo.is_need_bank = this.IsIsNeedBank();
				this._playerInfo.is_can_first_get = this.IsIsFirstPay();
				this._playerInfo.is_get_fitst_pay = this.IsIsFisrtPayGive();
				this._playerInfo.is_new_bulletin = this.IsIsNewBulletin();
				if (!WebConfig.isSingleEnter) {
					localSetItem("is_wx_open", this._playerInfo.is_wx_open ? "true" : "false");
				} else {
					localRemoveItem("is_wx_open");
				}
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_AGENCY_SHAREREWARD)) {
				this._playerInfo.agency_sharereward = this.GetAgencySharereward();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_AGENCY_SHAREMINPAY)) {
				this._playerInfo.agency_shareminpay = this.GetAgencyShareminpay();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_DAYSHAREGIVEMONEY)) {
				this._playerInfo.daysharegivemoney = this.GetDaysharegivemoney();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_CAN_TAKE_YONG_JIN)) {
				this._playerInfo.is_can_qmdl_lq = this.GetCanTakeYongJin() >= 1;
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_LAST_SHARE_TIME)) {
				this._playerInfo.last_share_time = this.GetLastShareTime();
				this._playerInfo.isCanFenXiang = !Sync.getIsToday(this._playerInfo.last_share_time, this._game.sceneGame.sync.serverTimeBys);
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_MAP_LEVEL)) {
				this._playerInfo.map_level = this.GetMapLevel();
				WebConfig.game_type = this._playerInfo.map_level;
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_GAME_ID)) {
				this._playerInfo.gameid = this.GetGameId();
				if (isNew) {
					WebConfig.isConnected = this._playerInfo.gameid ? true : false;
				} else {
					WebConfig.isConnected = false;
					this._sceneObjectMgr.CallchangeStory();
				}
				this._sceneObjectMgr.event(SceneObjectMgr.__EVENT_PLAYER_INFO_GAME_ID);
				logd("=======================WebConfig.isConnected", WebConfig.isConnected, isNew, "========", this._playerInfo.gameid)
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_WX_UNION_ID)) {
				this._playerInfo.wx_unionid = this.GetWxUnionId();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_MONEY)) {
				//下标值获取到后除以100，得到带两位小数点的金币数，GetMoney下标值只有这里能用
				this._playerInfo.money = EnumToString.getPointBackNum(this.GetMoney() / 100, 2)
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_SAVE_BOX_MONEY)) {
				this._playerInfo.savaBoxMoney = EnumToString.getPointBackNum(this.GetSaveBoxMoney() / 100, 2);
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_SAVE_BOX_RATE)) {
				this._playerInfo.savebox_rate = this.GetSaveBoxRate() * 0.00001;
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_SAVE_BOX_MIN)) {
				this._playerInfo.savebox_min = this.GetSaveBoxMin();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_SAVE_BOX_LAST_PROFIT)) {
				this._playerInfo.savebox_last_profit = this.GetSaveBoxLastProfit();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_SAVE_BOX_TOTAL_PROFIT)) {
				this._playerInfo.savebox_total_profit = this.GetSaveBoxTotalProfit();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_TOTAL_RECHARGE)) {
				this._playerInfo.total_recharge = this.GetTotalRecharge();
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_VIP_INFO_UPDATE, 2);
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_VIP_LEVEL)) {
				this._playerInfo.vip_level = this.GetVipLevel();
				this._playerInfo.vip_level = this._playerInfo.vip_level > 10 ? 10 : this._playerInfo.vip_level;
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_VIP_INFO_UPDATE, 1);
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_BYTE1)) {
				this._playerInfo.sign_in_days = this.GetSignInDays();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_LAST_SIGN_IN_TIME)) {
				this._playerInfo.last_signin_time = this.GetLastSignInTime();
				ness++;
			} if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_YESTERDAY_SCORE)) {
				this._playerInfo.total_turn_point = this.GetYesterdayScore();
				ness++;
			}

			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_TODAY_SCORE)) {
				this._playerInfo.today_score = this.GetTodayScore() || 0;
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_ACCOUNT)) {
				this._playerInfo.account = this.GetAccount();
				this._game.sceneObjectMgr.event(SceneObjectMgr.EVENT_ACCOUNT_UPDATE);
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_NICK_NAME)) {
				this._playerInfo.nickname = this.GetNickName();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_BIT0)) {
				this._playerInfo.isNicknameChanged = this.IsNicknameChanged();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_INVITE_CODE)) {
				this._playerInfo.invite_code = this.GetInviteCode();
				WebConfig.gwUrl = FreeStyle.getData(Web_operation_fields.FREE_STYLE_TYPES_BASECONFIG_C, "gwurl")
				WebConfig.ewmbaseUrl = WebConfig.gwUrl + "/qrcode?urlsize=9&urltext=" + encodeURIComponent(WebConfig.gwUrl) + "?invitecode="
				WebConfig.ewmUrl = WebConfig.ewmbaseUrl + this._playerInfo.invite_code;
				WebConfig.downLoadUrl = WebConfig.gwUrl + "?invitecode=" + this._playerInfo.invite_code;
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_MOBILE)) {
				this._playerInfo.mobile = this.GetMobile();
				localSetItem("mac_mobile", this._playerInfo.mobile)
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_REAL_NAME)) {
				this._playerInfo.real_name = this.GetRealName();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_USER_ID)) {
				this._playerInfo.userid = this.GetUserId();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_USER_NAME)) {
				this._playerInfo.username = this.GetUserName();
				localSetItem("mac_username", this._playerInfo.username)
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_HEAD_IMG)) {
				this._playerInfo.headimg = this.GetHeadImg() || "0";
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_HEAD_KUANG_IMG)) {
				this._playerInfo.headKuang = this.GetHeadKuangImg() || "0";
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_YING_HANG_KA)) {
				this._playerInfo.yinhangka = this.GetYingHangKa();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_ZHI_FU_BAO)) {
				this._playerInfo.zhifubao = this.GetZhiFuBao();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_SESSION_KEY)) {
				this._playerInfo.sessionKey = this.GetSessionKey();
				localSetItem("session_key", this._playerInfo.sessionKey);
				logd("==============session_key", this._playerInfo.sessionKey);
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_ANDROID)) {
				this._playerInfo.app_android = this.GetAndroid();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_IOS)) {
				this._playerInfo.app_ios = this.GetIos();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_LOGIN_POP_UP)) {
				this._playerInfo.login_popup = this.GetLoginPopUp();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_CARD_CONFIG)) {
				this._playerInfo.card_config = this.GetCardConfig();
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_VIP_RECEIVED)) {
				this._playerInfo.vip_received = this.GetVipReceived();
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_VIP_INFO_UPDATE, 3);
				ness++;
			}
			if (isNew || strmask.GetBit(PlayerData.PLAYERDATA_STR_GW_URL)) {
				this._playerInfo.gwUrl = FreeStyle.getData(Web_operation_fields.FREE_STYLE_TYPES_BASECONFIG_C, "gwurl");
				WebConfig.gwUrl = this._playerInfo.gwUrl;
				WebConfig.ewmbaseUrl = WebConfig.gwUrl + "/qrcode?urlsize=9&urltext=" + encodeURIComponent(WebConfig.gwUrl) + "?invitecode="
				WebConfig.ewmUrl = WebConfig.ewmbaseUrl + this._playerInfo.invite_code;
				WebConfig.downLoadUrl = WebConfig.gwUrl + "?invitecode=" + this._playerInfo.invite_code;
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_DE_ZHOU_MONEY)) {
				this._playerInfo.dezhouMoney = EnumToString.getPointBackNum(this.GetDeZhouMoney() / 100, 2)
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_DEZHOU_MONEY_UPDATE);
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_VALID_QI_FU_END_TIME)) {
				this._playerInfo.qifu_endtime = this.GetValidQiFuEndTime()
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_VALID_QI_FU_TYPE)) {
				this._playerInfo.qifu_type = this.GetValidQiFuType()
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_CAN_TAKE_YONG_JIN)) {
				this._playerInfo.yongjin = this.GetCanTakeYongJin() / 100
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_TOTAL_YONG_JIN)) {
				this._playerInfo.history_yongjin = this.GetTotalYongJin() / 100
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_DRAWING_REQUIRED_FLOW)) {
				this._playerInfo.drawingRequiredFlow = this.GetDrawingRequiredFlow();
				ness++;
			}
			if (isNew || mask.GetBit(PlayerData.PLAYERDATA_INT_DRAWING_CURRENT_FLOW)) {
				this._playerInfo.drawingCurrentFlow = this.GetDrawingCurrentFlow();
				ness++;
			}


			if (isNew || mask.GetBits(PlayerData.PLAYERDATA_INT_PLAYER_CARD_VALUE, 20)) {
				if (this._playerInfo.cards && this._playerInfo.cards.length) {
					this._playerInfo.cards = [];
				}
				for (let i: number = 0; i < 20; i++) {
					let car_value = this.GetPlayerCardValue(i);
					if (car_value) this._playerInfo.cards[i] = car_value;
				}
			}

			for (let key in this._playerInfo) {//兼容下
				if (this._playerInfo.hasOwnProperty(key)) {
					if (!WebConfig.info) WebConfig.info = {}
					WebConfig.info[key] = this._playerInfo[key];
				}
			}


			if (ness) {
				this._sceneObjectMgr.event(SceneObjectMgr.EVENT_PLAYER_INFO_UPDATE);
			}

			if (isNew) {
				this._sceneObjectMgr.event(SceneObjectMgr.___MAIN_PLAYER_CHANGE);
			}
		}

		update(diff: number) {


		}

		setEnterGameInfo(gameKey: string) {
			//设计为 {'zjh':3, 'ebgang':1}
			let infoAll = localGetItem('EnterGameInfo' + (this._playerInfo.account || 0));
			infoAll = infoAll && infoAll.length ? JSON.parse(infoAll) : {};
			let times = infoAll[gameKey];
			times = times ? times + 1 : 1;
			infoAll[gameKey] = times;
			localSetItem('EnterGameInfo' + (this._playerInfo.account || 0), JSON.stringify(infoAll));
		}

		getEnterGameInfo() {
			let infoAll = localGetItem('EnterGameInfo' + (this._playerInfo.account || 0));
			infoAll = infoAll && infoAll.length ? JSON.parse(infoAll) : {};
			return infoAll;
		}
	}

	export class PlayerInfo {
		last_share_time: number;//上次分享时间
		isCanFenXiang: boolean;//是否可以分享
		map_level: number = 0;//地图级别
		wx_unionid: string;//微信id
		gameid: string;//游戏id
		money: number;//金钱
		savaBoxMoney: number;//余额宝钱
		sex: number;//性别
		nickname: string;//玩家昵称
		isNicknameChanged: boolean;//昵称是否可以修改
		account: string;//账号
		real_name: string;//真实名字
		userid: string;//用户id
		username: string;//账号
		headimg: string;//头像id
		headKuang: string;//头像框
		mobile: string;//手机
		invite_code: string = "";//邀请码
		zhifubao: string;//支付宝
		sessionKey: string;//登陆密钥
		yinhangka: string;//银行卡
		isguest: boolean;//是否游客
		isqmdl: boolean;//是否全民代理
		islxqd: boolean;//是否连续签到
		isxylp: boolean;//是否幸运轮盘
		is_shared: boolean;//今日是否分享
		savebox_rate: number;// 余额宝利率
		savebox_min: number;//产生利息最低金额
		savebox_last_profit: number;//余额宝昨日收益
		savebox_total_profit: number;//余额宝累计收益
		cards: number[] = [];//玩家牌
		dezhouMoney: number;//德州带入的金币
		qifu_endtime: number;//祈福结束时间
		qifu_type: number;//祈福类型
		login_popup: string;//登录弹窗信息
		card_config: string;//房卡配置信息
		vip_received: string;//vip奖励领取标识
		total_recharge: number;//累计充值金额
		vip_level: number;//vip等级
		total_turn_point: number;//当前可以用的转盘积分
		sign_in_days: number;//连续签到天数
		last_signin_time: number;//上次签到时间
		drawingRequiredFlow: number;//兑换所需打码量
		drawingCurrentFlow: number;//当打码量
		yongjin: number;//可领取的佣金
		history_yongjin: number;//历史领取的佣金

		app_android: string
		app_ios: string
		gwUrl: string
		gameList: any

		is_can_qd: boolean;//签到小红点
		is_can_lp: boolean;//轮盘小红点
		is_can_qmdl_lq: boolean;//全面代理小红点
		is_new_bulletin: boolean;//新公告小红点
		is_wx_open: boolean;//微信开关
		is_outer_jump: boolean;//在线客服是否外跳
		is_need_bank: boolean;//是否需要判断绑定银行卡
		is_can_first_get: boolean//首充小红点
		is_get_fitst_pay: boolean;//首充领取标志

		agency_sharereward: number;
		agency_shareminpay: number;
		daysharegivemoney: number;//每日分享金额

		is_show_alipay: boolean;
		is_show_bank: boolean;

		today_score: number;//今日下注数

	}

	export class FreeStyle {
		private static __data: any;
		static setData(value: string): void {
			try {
				this.__data = JSON.parse(value);
			} catch (error) {
				logd('parse FreeStyle fail');
			}
		}

		static getData(type, key): any {
			if (!this.__data || !this.__data[type]) return null;
			if (!key) {
				return this.__data[type];
			}
			if (!this.__data[type][key]) return null;
			let data = this.__data[type][key];
			let count = 0;
			if (Object.getOwnPropertyNames(data).length == 1) {
				for (let mykey in data) {
					if (data.hasOwnProperty(mykey)) {
						return data[mykey];
					}
				}
			}
			return data;
		}
	}
}