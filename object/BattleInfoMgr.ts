module gamecomponent.object {
    const BATTLE_TYPE_PASS = 1;         //过~~
    const BATTLE_TYPE_BET = 2;          //下注
    const BATTLE_TYPE_PLAY_CARD = 3;    //出牌(斗地主和跑得快出牌)
    const BATTLE_TYPE_COMPARE = 4;      //比牌
    const BATTLE_TYPE_MING_PAI = 5;     //明牌(斗地主发牌)
    const BATTLE_TYPE_JIAODIZHU = 6;    //叫地主
    const BATTLE_TYPE_SEE_CARD = 7;     //看牌(斗地主没地主重新开始,跑得快先手)
    const BATTLE_TYPE_GUZHUYIZHI = 8;   //孤注一掷
    const BATTLE_TYPE_ADD_CHIP = 9;     //加注
    const BATTLE_TYPE_START = 10;       //游戏开始下底注(跑得快抢关)
    const BATTLE_TYPE_SETTLEMENT = 11   //结算
    const BATTLE_TYPE_BANKER = 12       //抢庄（斗地主春天）
    const BATTLE_TYPE_BETRATE = 13      //定闲家可下注倍数
    const BATTLE_TYPE_XIQIAN = 14       //喜钱
    const BATTLE_TYPE_DEAL = 15         //发牌
    const BATTLE_TYPE_BUY = 16          //买保险
    const BATTLE_TYPE_DOUBLE = 17       //双倍下注
    const BATTLE_TYPE_PART = 18         //分牌
    const BATTLE_TYPE_ASK = 19          //要牌
    const BATTLE_TYPE_STOP = 20         //停牌
    const BATTLE_TYPE_AREA_BET = 21     //按区域下注
    const BATTLE_TYPE_BLACKJACK_BET = 22 //21点下注
    const BATTLE_TYPE_SHUIGUOJI_LOTTERY = 23 //水果机开奖
    const BATTLE_TYPE_SHOW_CARD = 24 //牌九明牌
    const BATTLE_TYPE_SHOW_EBGANG = 25 //二八杠明牌
    const BATTLE_TYPE_BCBM_LOTTERY = 26 //奔驰宝马开奖
    const BATTLE_TYPE_ROLL_DICE = 27 //摇骰子
    const BATTLE_TYPE_CARDS_RESULT = 28 //游戏开牌结果
    const BATTLE_TYPE_BAIRENDEZHOU_CARD_ZUHE = 29 //百人德州牌型组合
    const BATTLE_TYPE_SHISANSHUI_COMPARE = 30;  //十三水比牌
    const BATTLE_TYPE_ZOO_LOTTERY = 31 //飞禽走兽开奖
    const BATTLE_TYPE_SHISANSHUI_DAQIANG = 32;  //十三水打枪
    const BATTLE_TYPE_DISCARD = 33;  //弃牌
    const BATTLE_TYPE_FANPAI = 34;  //21点翻牌
    const BATTLE_TYPE_SIMPLE_CARD = 35;  //十三水简易牌型(斗地主底牌)
    const BATTLE_TYPE_QUANLEIDA = 36;   //全垒打结算
    const BATTLE_TYPE_SPECIAL = 37; //特殊牌结算(跑得快炸弹现结)
    const BATTLE_TYPE_SPECIAL_CARD = 38;    //特殊牌型
    const BATTLE_TYPE_SSS_CARD_TYPE = 39;    //十三水结算牌型
    const BATTLE_TYPE_SPONSOR_VOTE = 40;    //发起投票
    const BATTLE_TYPE_VOTEING = 41;         //投票中
    const BATTLE_TYPE_QIANGGUAN_END = 42;   //跑得快抢关结束
    const BATTLE_TYPE_QIANGDIZHU_END = 43;   //斗地主抢地主结束
    const BATTLE_TYPE_CARD_RULE = 44;   //房卡规则信息

    export class BattleInfoBase {
        protected _typ: number;
        protected _index: number;
        constructor(typ: number, index: number) {
            this._typ = typ;
            this._index = index;
        }

        get Type(): number {
            return this._typ;
        }

        get SeatIndex(): number {
            return this._index;
        }
    }
    export class BattleInfoPass extends BattleInfoBase {
        constructor(index: number) {
            super(BATTLE_TYPE_PASS, index);
        }
    }
    export class BattleInfoBet extends BattleInfoBase {
        protected _bet_val: number;
        protected _see_card: number;
        protected _round: number;
        constructor(index: number, bet_val: number, see_card: number, round: number) {
            super(BATTLE_TYPE_BET, index);
            this._bet_val = bet_val;
            this._see_card = see_card;
            this._round = round;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get SeeCard(): number {
            return this._see_card;
        }

        get round(): number {
            return this._round;
        }
    }
    export class BattleInfoPlayCard<T extends gamecomponent.object.MapInfoLogObject> extends BattleInfoBase {
        protected _cards: Array<T>;
        protected _cardtyp: number;
        protected _len: number;
        protected _val: number;
        protected _round: number;
        protected _lunshu: number;
        constructor(index: number, typ: number, len: number, val: number, round: number, lunshu: number) {
            super(BATTLE_TYPE_PLAY_CARD, index);
            this._cards = new Array<T>();
            this._cardtyp = typ;
            this._len = len;
            this._val = val;
            this._round = round;
            this._lunshu = lunshu;
        }

        get Cards(): Array<T> {
            return this._cards;
        }
        get CardType(): number {
            return this._cardtyp;
        }
        get Len(): number {
            return this._len;
        }
        get Val(): number {
            return this._val;
        }
        get Round(): number {
            return this._round;
        }
        get LunShu(): number {
            return this._lunshu;
        }
    }
    export class BattleInfoSimpleCard<T extends gamecomponent.object.MapInfoLogObject> extends BattleInfoBase {
        protected _cards: Array<T>;
        protected _tou: number;
        protected _zhong: number;
        protected _wei: number;
        protected _round: number;
        protected _lunshu: number;
        constructor(index: number, tou: number, zhong: number, wei: number, round: number, lunshu: number) {
            super(BATTLE_TYPE_SIMPLE_CARD, index);
            this._cards = new Array<T>();
            this._tou = tou;
            this._zhong = zhong;
            this._wei = wei;
            this._round = round;
            this._lunshu = lunshu;
        }

        get Cards(): Array<T> {
            return this._cards;
        }
        get TouDun(): number {
            return this._tou;
        }
        get ZhongDun(): number {
            return this._zhong;
        }
        get WeiDun(): number {
            return this._wei;
        }

        get Round(): number {
            return this._round;
        }

        get LunShu(): number {
            return this._lunshu;
        }
    }
    export class BattleInfoShowEBGCard extends BattleInfoBase {
        protected _cards: Array<any>;
        protected _cardtyp: number;
        protected _len: number;
        protected _val: number;
        constructor(index: number, typ: number, len: number, val: number) {
            super(BATTLE_TYPE_SHOW_EBGANG, index);
            this._cards = new Array<any>();
            this._cardtyp = typ;
            this._len = len;
            this._val = val;
        }

        get Cards(): Array<any> {
            return this._cards;
        }
        get CardType(): number {
            return this._cardtyp;
        }
        get Len(): number {
            return this._len;
        }
        get Val(): number {
            return this._val;
        }
    }
    export class BattleInfoCardRule extends BattleInfoBase {
        protected _rules: Array<any>;
        constructor(index: number) {
            super(BATTLE_TYPE_CARD_RULE, index);
            this._rules = new Array<any>();
        }

        get Rules(): Array<any> {
            return this._rules;
        }
    }
    export class BattleInfoBetRate extends BattleInfoBase {
        protected _bankerMoney: number;
        protected _bankerRate: number;
        protected _antes: number;
        protected _round: number;
        constructor(index: number, money: number, rate: number, antes: number, round: number) {
            super(BATTLE_TYPE_BETRATE, index);
            this._bankerMoney = money;
            this._bankerRate = rate;
            this._antes = antes;
            this._round = round;
        }
        get BankerMoney(): number {
            return this._bankerMoney;
        }
        get BankerRate(): number {
            return this._bankerRate;
        }
        get Antes(): number {
            return this._antes;
        }
        get Round(): number {
            return this._round;
        }
    }

    export class BattleInfoCompare extends BattleInfoBase {
        protected _bet_val: number;
        protected _target_idx: number;
        protected _win_idx: number;
        protected _see_card: number;
        constructor(index: number, index1: number, bet_val: number, index2: number, see_card: number) {
            super(BATTLE_TYPE_COMPARE, index);
            this._bet_val = bet_val;
            this._target_idx = index1;
            this._win_idx = index2;
            this._see_card = see_card;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get TargetIdx(): number {
            return this._target_idx;
        }

        get WinIdx(): number {
            return this._win_idx;
        }

        get SeeCard(): number {
            return this._see_card;
        }
    }

    export class BattleInfoSeeCard extends BattleInfoBase {
        protected _round: number;
        private _extra: number;
        constructor(index: number, round: number, extra: number) {
            super(BATTLE_TYPE_SEE_CARD, index);
            this._round = round;
            this._extra = extra;
        }

        get extra(): number {
            return this._extra;
        }

        get round(): number {
            return this._round;
        }
    }

    export class BattleInfoGuzhuyizhi extends BattleInfoBase {
        protected _target_idx: number;
        protected _win_idx: number;
        protected _bet_val: number;
        constructor(index: number, target_idx: number, index2: number, bet_val: number) {
            super(BATTLE_TYPE_GUZHUYIZHI, index);
            this._target_idx = target_idx;
            this._win_idx = index2;
            this._bet_val = bet_val;
        }

        get TargetIdx(): number {
            return this._target_idx;
        }

        get WinIdx(): number {
            return this._win_idx;
        }

        get BetVal(): number {
            return this._bet_val;
        }
    }

    export class BattleInfoAddChip extends BattleInfoBase {
        protected _bet_val: number;
        protected _see_card: number;
        constructor(index: number, bet_val: number, see_card: number) {
            super(BATTLE_TYPE_ADD_CHIP, index);
            this._bet_val = bet_val;
            this._see_card = see_card;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get SeeCard(): number {
            return this._see_card;
        }
    }

    export class BattleInfoStart extends BattleInfoBase {
        protected _bet_val: number;
        protected _round: number;
        constructor(index: number, bet_val: number, round: number) {
            super(BATTLE_TYPE_START, index);
            this._bet_val = bet_val;
            this._round = round;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get round(): number {
            return this._round;
        }
    }

    export class BattleInfoBanker extends BattleInfoBase {
        protected _bet_val: number;
        protected _round: number;
        constructor(index: number, bet_val: number, round: number) {
            super(BATTLE_TYPE_BANKER, index);
            this._bet_val = bet_val;
            this._round = round;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get Round(): number {
            return this._round;
        }
    }

    export class BattleInfoSettle extends BattleInfoBase {
        protected _bet_val: number;
        protected _round: number;
        protected _lunshu: number;
        constructor(index: number, bet_val: number, round: number, lunshu: number) {
            super(BATTLE_TYPE_SETTLEMENT, index);
            this._bet_val = bet_val / 100;
            this._round = round;
            this._lunshu = lunshu;
        }

        get SettleVal(): number {
            return this._bet_val;
        }

        get round(): number {
            return this._round;
        }

        get LunShu(): number {
            return this._lunshu;
        }
    }

    export class BattleInfoSssCardType extends BattleInfoBase {
        protected _tou_val: number;
        protected _zhong_val: number;
        protected _wei_val: number;
        protected _round: number;
        constructor(index: number, tou_val: number, zhong_val: number, wei_val: number, round: number) {
            super(BATTLE_TYPE_SSS_CARD_TYPE, index);
            this._tou_val = tou_val;
            this._zhong_val = zhong_val;
            this._wei_val = wei_val;
            this._round = round;
        }

        get typeVal() {
            return this._tou_val >= 10 ? [this._tou_val] : [this._tou_val, this._zhong_val, this._wei_val]
        }

        get round(): number {
            return this._round;
        }
    }

    export class BattleInfoSpecial extends BattleInfoBase {
        protected _val: number;
        protected _round: number;
        constructor(index: number, val: number, round: number) {
            super(BATTLE_TYPE_SPECIAL, index);
            this._val = val;
            this._round = round;
        }

        get SpecialVal(): number {
            return this._val;
        }

        get round(): number {
            return this._round;
        }
    }

    export class BattleInfoSpecialCard extends BattleInfoBase {
        protected _cardType: number;
        constructor(index: number, cardType: number) {
            super(BATTLE_TYPE_SPECIAL_CARD, index);
            this._cardType = cardType;
        }

        get cardType(): number {
            return this._cardType;
        }
    }

    export class BattleInfoXiQian extends BattleInfoBase {
        protected _bet_val: number;
        constructor(index: number, bet_val: number) {
            super(BATTLE_TYPE_XIQIAN, index);
            this._bet_val = bet_val;
        }

        get BetVal(): number {
            return this._bet_val;
        }
    }

    export class BattleInfoDeal extends BattleInfoBase {
        protected _cards: Array<any>;
        protected _card_type: number;
        constructor(index: number, type: number) {
            super(BATTLE_TYPE_DEAL, index);
            this._cards = new Array<any>();
            this._card_type = type;
        }

        get Cards(): Array<any> {
            return this._cards;
        }

        get CardType(): number {
            return this._card_type;
        }
    }

    export class BattleInfoRollDice extends BattleInfoBase {
        protected _dices: Array<number>;
        constructor(index: number) {
            super(BATTLE_TYPE_ROLL_DICE, index);
            this._dices = new Array<number>();
        }

        get Dices(): Array<number> {
            return this._dices;
        }
    }

    export class BattleInfoBuy extends BattleInfoBase {
        protected _pos: number;
        protected _opt_type: number;
        protected _bet_val: number;
        constructor(index: number, pos: number, opt_type: number, bet_val: number) {
            super(BATTLE_TYPE_BUY, index);
            this._pos = pos;
            this._opt_type = opt_type;
            this._bet_val = bet_val;
        }

        get Pos(): number {
            return this._pos;
        }

        get OptType(): number {
            return this._opt_type;
        }

        get BetVal(): number {
            return this._bet_val;
        }
    }

    export class BattleInfoDouble extends BattleInfoBase {
        protected _pos: number;
        protected _bet_val: number;
        constructor(index: number, pos: number, bet_val: number) {
            super(BATTLE_TYPE_DOUBLE, index);
            this._pos = pos;
            this._bet_val = bet_val;
        }

        get Pos(): number {
            return this._pos;
        }


        get BetVal(): number {
            return this._bet_val;
        }
    }

    export class BattleInfoPart extends BattleInfoBase {
        protected _pos: number;
        protected _bet_val: number;
        constructor(index: number, pos: number, bet_val: number) {
            super(BATTLE_TYPE_PART, index);
            this._pos = pos;
            this._bet_val = bet_val;
        }

        get Pos(): number {
            return this._pos;
        }

        get BetVal(): number {
            return this._bet_val;
        }
    }

    export class BattleInfoStop extends BattleInfoBase {
        protected _pos: number;
        constructor(index: number, pos: number) {
            super(BATTLE_TYPE_STOP, index);
            this._pos = pos;
        }

        get Pos(): number {
            return this._pos;
        }
    }

    export class BattleInfoAsk extends BattleInfoBase {
        protected _card: number;
        protected _card_type: number;
        constructor(index: number, card: number, type: number) {
            super(BATTLE_TYPE_ASK, index);
            this._card = card;
            this._card_type = type;
        }

        get Card(): number {
            return this._card;
        }

        get CardType(): number {
            return this._card_type;
        }
    }

    export class BattleInfoFanPai extends BattleInfoBase {
        protected _card: number;
        protected _card_type: number;
        constructor(index: number, card: number, type: number) {
            super(BATTLE_TYPE_FANPAI, index);
            this._card = card;
            this._card_type = type;
        }

        get Card(): number {
            return this._card;
        }

        get CardType(): number {
            return this._card_type;
        }
    }

    export class BattleInfoAreaBet extends BattleInfoBase {
        protected _bet_val: number;
        protected _bet_index: number;
        constructor(index: number, bet_val: number, bet_index: number) {
            super(BATTLE_TYPE_AREA_BET, index);
            this._bet_val = bet_val;
            this._bet_index = bet_index;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get BetIndex(): number {
            return this._bet_index;
        }
    }

    export class BattleInfoBlackJackBet extends BattleInfoBase {
        protected _bet_val: number;
        protected _pos: number;
        constructor(index: number, bet_val: number, pos: number) {
            super(BATTLE_TYPE_BLACKJACK_BET, index);
            this._bet_val = bet_val;
            this._pos = pos;
        }

        get BetVal(): number {
            return this._bet_val;
        }

        get Pos(): number {
            return this._pos;
        }
    }

    export class BattleInfoShowCards extends BattleInfoBase {
        protected _cards: Array<any>;
        protected _card_type: number;
        constructor(index: number, card_type: number) {
            super(BATTLE_TYPE_SHOW_CARD, index);
            this._cards = new Array<any>();
            this._card_type = card_type;
        }

        get Cards(): Array<any> {
            return this._cards;
        }

        get CardType(): number {
            return this._card_type;
        }
    }

    export class BattleInfoSGJ extends BattleInfoBase {
        protected _typ: number;
        protected _prizeType: number;
        protected _prizeTotalMoney: number;
        protected _prizeContent: any[];
        protected _jacketContent: any[];
        constructor(index: number) {
            super(BATTLE_TYPE_SHUIGUOJI_LOTTERY, index);
            this._prizeContent = [];
            this._jacketContent = [];
        }

        get prizeType(): number {
            return this._prizeType;
        }

        set prizeType(val: number) {
            this._prizeType = val;
        }

        get prizeTotalMoney(): number {
            return this._prizeTotalMoney;
        }

        set prizeTotalMoney(val: number) {
            this._prizeTotalMoney = val;
        }

        get prizeContent(): any[] {
            return this._prizeContent;
        }

        public addPrizeContent(obj: any): void {
            this._prizeContent.push(obj);
        }

        get jacketContent(): any[] {
            return this._jacketContent;
        }

        public addJacketContent(obj: any): void {
            this._jacketContent.push(obj);
        }
    }

    export class BattleLogCardsResult extends BattleInfoBase {
        protected _results: Array<any>;
        constructor(index: number) {
            super(BATTLE_TYPE_CARDS_RESULT, index);
            this._results = new Array<any>();
        }

        get Results(): Array<any> {
            return this._results;
        }
    }

    export class BattleInfoBCBMLottery extends BattleInfoBase {
        protected _lotteryIndex: number;
        protected _lotteryPos: number;
        protected _startTime: number;
        constructor(index: number, lotteryIndex: number, pos: number, startTime: number) {
            super(BATTLE_TYPE_BCBM_LOTTERY, index);
            this._lotteryIndex = lotteryIndex;
            this._lotteryPos = pos;
            this._startTime = startTime;
        }

        get lotteryIndex(): number {
            return this._lotteryIndex;
        }

        get lotteryPos(): number {
            return this._lotteryPos;
        }

        get startTime(): number {
            return this._startTime;
        }
    }

    export class BattleInfoZooLottery extends BattleInfoBase {
        protected _lotteryIndex: number;
        protected _startTime: number;
        constructor(index: number, lotteryIndex: number, startTime: number) {
            super(BATTLE_TYPE_ZOO_LOTTERY, index);
            this._lotteryIndex = lotteryIndex;
            this._startTime = startTime;
        }

        get lotteryIndex(): number {
            return this._lotteryIndex;
        }

        get startTime(): number {
            return this._startTime;
        }
    }

    export class BattleInfoMingPai extends BattleInfoBase {
        protected _cards: Array<any>;
        protected _round: number;
        protected _lunshu: number;
        constructor(index: number, round: number, lunshu: number) {
            super(BATTLE_TYPE_MING_PAI, index);
            this._cards = new Array<any>();
            this._round = round;
            this._lunshu = lunshu;
        }

        get Cards(): Array<any> {
            return this._cards;
        }

        get round(): number {
            return this._round;
        }

        get lunshu(): number {
            return this._lunshu;
        }
    }

    export class BattleInfoJiaoDiZhu extends BattleInfoBase {
        protected _opt_type: number;
        constructor(index: number, opt_type: number) {
            super(BATTLE_TYPE_JIAODIZHU, index);
            this._opt_type = opt_type;
        }

        get OptType(): number {
            return this._opt_type;
        }
    }

    export class BattleInfoBrdzCardsZuhe extends BattleInfoBase {
        protected _cardszuhe: Array<any>;
        constructor(index: number) {
            super(BATTLE_TYPE_BAIRENDEZHOU_CARD_ZUHE, index);
            this._cardszuhe = new Array<any>();
        }

        get CardsZuhe(): Array<any> {
            return this._cardszuhe;
        }
    }

    export class BattleInfoShiSanShuiCompare extends BattleInfoBase {
        protected _dun: number;
        protected _val: number;
        constructor(index: number, dun: number, val: number) {
            super(BATTLE_TYPE_SHISANSHUI_COMPARE, index);
            this._dun = dun;
            this._val = val;
        }

        get Dun(): number {
            return this._dun;
        }

        get Val(): number {
            return this._val;
        }
    }

    export class BattleInfoQuanLeiDa extends BattleInfoBase {
        protected _touDun: number;
        protected _zhongDun: number;
        protected _weiDun: number;
        constructor(index: number, tou: number, zhong: number, wei: number) {
            super(BATTLE_TYPE_QUANLEIDA, index);
            this._touDun = tou;
            this._zhongDun = zhong;
            this._weiDun = wei;
        }

        get touDun(): number {
            return this._touDun;
        }

        get zhongDun(): number {
            return this._zhongDun;
        }

        get weiDun(): number {
            return this._weiDun;
        }
    }

    export class BattleInfoShiSanShuiDaQiang extends BattleInfoBase {
        protected _attacker: number;
        protected _touVal: number;
        protected _zhongVal: number;
        protected _weiVal: number;
        constructor(index: number, attacker: number, touVal: number, zhongVal: number, weiVal: number) {
            super(BATTLE_TYPE_SHISANSHUI_DAQIANG, index);
            this._attacker = attacker;
            this._touVal = touVal;
            this._zhongVal = zhongVal;
            this._weiVal = weiVal;
        }

        get attacker(): number {
            return this._attacker;
        }

        get touVal(): number {
            return this._touVal;
        }

        get zhongVal(): number {
            return this._zhongVal;
        }

        get weiVal(): number {
            return this._weiVal;
        }
    }

    export class BattleInfoDisCard extends BattleInfoBase {
        constructor(index: number) {
            super(BATTLE_TYPE_DISCARD, index);
        }
    }

    export class BattleInfoSponsorVote extends BattleInfoBase {
        private _state: number;
        private _tpResult: number;
        constructor(index: number, state: number, tpResult: number) {
            super(BATTLE_TYPE_SPONSOR_VOTE, index);
            this._state = state;
            this._tpResult = tpResult;
        }
        get state() {
            return this._state;
        }
        get tpResult() {
            return this._tpResult;
        }
    }

    export class BattleInfoVoting extends BattleInfoBase {
        private _tpType: number
        constructor(index: number, tpType: number) {
            super(BATTLE_TYPE_VOTEING, index);
            this._tpType = tpType;
        }
        get tpType(): number {
            return this._tpType;
        }
    }

    export class BattleInfoQiangGuanEnd extends BattleInfoBase {
        private _qiang_pos: number
        private _qiang_type: number
        constructor(index: number, _qiang_pos: number, _qiang_type: number) {
            super(BATTLE_TYPE_QIANGGUAN_END, index);
            this._qiang_pos = _qiang_pos;
            this._qiang_type = _qiang_type;
        }
        get qiang_pos(): number {
            return this._qiang_pos;
        }
        get qiang_type(): number {
            return this._qiang_type
        }
    }

    export class BattleInfoQiangDZEnd extends BattleInfoBase {
        private _qiang_pos: number
        constructor(index: number, _qiang_pos: number, _qiang_type: number) {
            super(BATTLE_TYPE_QIANGDIZHU_END, index);
            this._qiang_pos = _qiang_pos;
        }
        get qiang_pos(): number {
            return this._qiang_pos;
        }
    }

    export class BattleInfoMgr<T extends gamecomponent.object.MapInfoLogObject> {
        protected _map_info: MapInfoT<T>;
        protected _index: number;
        protected _infos: Array<BattleInfoBase>;
        protected _create_card_fun: Function;
        protected _users;
        public get info() {
            return this._infos;
        }
        public get users() {
            return this._users;
        }
        constructor(map_info: MapInfoT<T>, create_card_fun: Function) {
            this._map_info = map_info;
            this._index = 0;
            this._infos = new Array<BattleInfoBase>();
            this._create_card_fun = create_card_fun;
        }

        public ResetData(log: String) {
            if (log == "" || log == null) {
                throw "battle log is null";
            }
            //解析前先清掉旧数据
            this._infos.length = 0;
            this._index = 0;

            this.loadDataFormLog(log);
        }

        private loadDataFormLog(log: String): void {
            if (log == "") {
                return;
            }

            let arr = log.split("#");
            if (arr.length == 0) {
                throw "bad battle log str:" + log;
            }

            this._users = JSON.parse(arr[0]);
            let end_index = parseInt("0x" + arr[1]);

            this._map_info.Reset();
            this._map_info.SetUInt32(MapInfo.MAP_INT_BATTLE_INDEX, end_index);
            for (let i = 0; i <= end_index; i++) {
                this._map_info.SetUInt32(MapInfo.MAP_INT_BATTLE_BEING + i, parseInt("0x" + arr[2 + i]));
            }
            this.OnUpdate();
        }

        OnUpdate(): void {
            //重写一下GetFloat
            let __getfloat = this._map_info.GetFloat;
            this._map_info.GetFloat = function (index) {
                let val = this.GetInt32(index);
                return val / 100;
            };


            let index = this._index;
            if (this._map_info.GetBattleIndex() == 0) {
                this._infos.length = 0;
                this._index = 0;
                return;
            }
            while (this._map_info.GetBattleIndex() > index) {
                let seatIndex = this._map_info.GetUInt16(MapInfo.MAP_INT_BATTLE_BEING + index, 0);
                let typ = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 0);
                let len = this._map_info.GetUInt16(MapInfo.MAP_INT_BATTLE_BEING + index, 1);
                switch (typ) {
                    case BATTLE_TYPE_PASS: {
                        let obj = new BattleInfoPass(seatIndex);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BET: {
                        let see_card = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoBet(seatIndex, bet_val, see_card, round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_PLAY_CARD: {
                        let _typ = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 0);
                        let _len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 1);
                        let _val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 2);
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let lunshu = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoPlayCard<T>(seatIndex, _typ, _len, _val, round, lunshu);
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 3);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 3 + Math.floor(i / 4), i % 4)
                            let card = this._create_card_fun();
                            card.Init(val);
                            obj.Cards.push(card);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SIMPLE_CARD: {
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let lunshu = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let _tou = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 0);
                        let _zhong = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 1);
                        let _wei = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 2);
                        let obj = new BattleInfoSimpleCard<T>(seatIndex, _tou, _zhong, _wei, round, lunshu);
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 3);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 3 + Math.floor(i / 4), i % 4)
                            let card = this._create_card_fun();
                            card.Init(val);
                            obj.Cards.push(card);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SHOW_EBGANG: {
                        let _typ = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let rule_type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let obj = new BattleInfoShowEBGCard(seatIndex, _typ, cards_len, rule_type);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.Cards.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_CARD_RULE: {
                        let rules_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoCardRule(seatIndex);
                        for (let i = 0; i < rules_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.Rules.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_JIAODIZHU: {
                        let obj = new BattleInfoJiaoDiZhu(seatIndex, this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1));
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_COMPARE: {
                        let _target_idx = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _win_idx = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let _see_card = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let _val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoCompare(seatIndex, _target_idx, _val, _win_idx, _see_card);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BETRATE: {
                        let _rate = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _antes = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let _round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let _money = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoBetRate(seatIndex, _money, _rate, _antes, _round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SEE_CARD: {
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1)
                        let extra = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2)
                        let obj = new BattleInfoSeeCard(seatIndex, round, extra);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_GUZHUYIZHI: {
                        let target_idx = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1)
                        let win_idx = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoGuzhuyizhi(seatIndex, target_idx, win_idx, bet_val);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_ADD_CHIP: {
                        let see_card = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoAddChip(seatIndex, bet_val, see_card);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_START: {
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoStart(seatIndex, bet_val, round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BANKER: {
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoBanker(seatIndex, this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2), round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SETTLEMENT: {
                        let round: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let lunshu: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoSettle(seatIndex, this._map_info.GetInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2), round, lunshu);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SPECIAL: {
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoSpecial(seatIndex, this._map_info.GetInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2), round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SSS_CARD_TYPE: {
                        let tou_val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let zhong_val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let wei_val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let round = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 0);
                        let obj = new BattleInfoSssCardType(seatIndex, tou_val, zhong_val, wei_val, round);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SPECIAL_CARD: {
                        let obj = new BattleInfoSpecialCard(seatIndex, this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1));
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_XIQIAN: {
                        let obj = new BattleInfoXiQian(seatIndex, this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2));
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_QUANLEIDA: {
                        let tou = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let zhong = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let wei = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let obj = new BattleInfoQuanLeiDa(seatIndex, tou, zhong, wei);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_DEAL: {
                        let type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoDeal(seatIndex, type);
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            // let card = this._create_card_fun();
                            // card.Init(val);                    
                            obj.Cards.push(val + 1);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_ROLL_DICE: {
                        let obj = new BattleInfoRollDice(seatIndex);
                        for (let i = 1; i <= 3; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, i)
                            obj.Dices.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BUY: {
                        let pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let optType = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let bet_val = this._map_info.GetFloat(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoBuy(seatIndex, pos, optType, bet_val);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_DOUBLE: {
                        let pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoDouble(seatIndex, pos, bet_val);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_PART: {
                        let pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoPart(seatIndex, pos, bet_val);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_STOP: {
                        let pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoStop(seatIndex, pos);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_ASK: {
                        let card = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoAsk(seatIndex, card + 1, type);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_FANPAI: {
                        let card = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoFanPai(seatIndex, card + 1, type);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_AREA_BET: {
                        let bet_index = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoAreaBet(seatIndex, bet_val, bet_index);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BLACKJACK_BET: {
                        let pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let bet_val = this._map_info.GetFloat(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoBlackJackBet(seatIndex, bet_val, pos);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SHOW_CARD: {
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let care_type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoShowCards(seatIndex, care_type);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.Cards.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SHUIGUOJI_LOTTERY: {
                        let obj = new BattleInfoSGJ(seatIndex);
                        obj.prizeType = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let prizeNum: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        obj.prizeTotalMoney = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let indexNum: number = Math.ceil(prizeNum / 4);
                        for (let i: number = 0; i < prizeNum; i++) {
                            let idx: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 3 + Math.floor(i / 4), i % 4);
                            let money: number = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 3 + indexNum + indexNum + i);
                            let type: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + indexNum + 3 + Math.floor(i / 4), i % 4);
                            let prizeObj: any = {
                                index: idx - 1,
                                money: money,
                                type: type
                            }
                            obj.addPrizeContent(prizeObj);
                        }
                        let totalLen: number = 3 + prizeNum + indexNum + indexNum;
                        prizeNum = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        if (prizeNum > 0) {
                            indexNum = Math.ceil(prizeNum / 4);
                            for (let i: number = 0; i < prizeNum; i++) {
                                let type: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + totalLen + Math.floor(i / 4), i % 4);
                                let money: number = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + totalLen + indexNum + i);
                                let prizeObj: any = {
                                    type: type,
                                    money: money
                                }
                                obj.addJacketContent(prizeObj);
                            }
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_CARDS_RESULT: {
                        let obj = new BattleLogCardsResult(seatIndex);
                        let val_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        for (let i = 0; i < val_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.Results.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BCBM_LOTTERY: {
                        let lotteryIndex: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let lotteryPos: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let time: number = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoBCBMLottery(seatIndex, lotteryIndex, lotteryPos, time);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_ZOO_LOTTERY: {
                        let lotteryIndex: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let time: number = this._map_info.GetUInt32(MapInfo.MAP_INT_BATTLE_BEING + index + 2);
                        let obj = new BattleInfoZooLottery(seatIndex, lotteryIndex, time);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_MING_PAI: {
                        let round: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let lunshu: number = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 3);
                        let obj = new BattleInfoMingPai(seatIndex, round, lunshu);
                        let cards_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        for (let i = 0; i < cards_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.Cards.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_BAIRENDEZHOU_CARD_ZUHE: {
                        let obj = new BattleInfoBrdzCardsZuhe(seatIndex);
                        let val_len = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        for (let i = 0; i < val_len; i++) {
                            let val = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 2 + Math.floor(i / 4), i % 4)
                            obj.CardsZuhe.push(val);
                        }
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SHISANSHUI_COMPARE: {
                        let dun = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let val = this._map_info.GetInt16(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoShiSanShuiCompare(seatIndex, dun, val);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SHISANSHUI_DAQIANG: {
                        let _attacker = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _touVal = this._map_info.GetInt16(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _zhongVal = this._map_info.GetInt16(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 0);
                        let _weiVal = this._map_info.GetInt16(MapInfo.MAP_INT_BATTLE_BEING + index + 2, 1);
                        let obj = new BattleInfoShiSanShuiDaQiang(seatIndex, _attacker, _touVal, _zhongVal, _weiVal);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_DISCARD: {
                        let obj = new BattleInfoDisCard(seatIndex);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_SPONSOR_VOTE: {
                        let _state = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _tpResult = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoSponsorVote(seatIndex, _state, _tpResult);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_VOTEING: {
                        let _tpType = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let obj = new BattleInfoVoting(seatIndex, _tpType);
                        this._infos.push(obj);
                        break;
                    }
                    case BATTLE_TYPE_QIANGGUAN_END: {
                        let _qiang_pos = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 1);
                        let _qiang_type = this._map_info.GetByte(MapInfo.MAP_INT_BATTLE_BEING + index + 1, 2);
                        let obj = new BattleInfoQiangGuanEnd(seatIndex, _qiang_pos,_qiang_type);
                        this._infos.push(obj);
                        break;
                    }
                    default: {
                        break;
                    }
                }
                index += len;
            }
            this._index = this._map_info.GetBattleIndex();
            this._map_info.GetFloat = __getfloat
        }
    }
}