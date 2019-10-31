/**
* 场景对象管理器
*/
module gamecomponent.managers {
    export class SceneObjectMgr extends core.obj.GuidObjectTable {
        /***************自定义事件******************* */
        static readonly EVENT_OPRATE_SUCESS: string = "SceneObjectMgr.EVENT_OPRATE_SUCESS"

        /*************专用勿用*********** */
        //对象被移除
        static __DELETE_OBJECT: string = "SceneObjectMgr.__DELETE_OBJECT";
        //主玩家有变化 防止监听错误
        static ___MAIN_PLAYER_CHANGE: string = "SceneObjectMgr.___MAIN_PLAYER_CHANGE";
        //mapinfo游戏id
        static __EVENT_PLAYER_INFO_GAME_ID: string = "SceneObjectMgr.__EVENT_PLAYER_INFO_GAME_ID";
        //房卡类型变更
        static __EVENT_PLAYER_CARDROOM_CHUANGE: string = "SceneObjectMgr.__EVENT_PLAYER_CARDROOM_CHUANGE";
        //加入房间触发游戏更新
        static __EVENT_JOIN_CARDROOM_GAME_UPDATE: string = "SceneObjectMgr.__EVENT_JOIN_CARDROOM_GAME_UPDATE";


        /***************场景事件******************** */
        //地图传送
        static EVENT_LOAD_MAP: string = "SceneObjectMgr.EVENT_LOAD_MAP";
        //地图精灵变更
        static EVENT_UNIT_CHANGE: string = "SceneObjectMgr.EVENT_UNIT_CHANGE";
        //地图精灵行为有变化
        static EVENT_UNIT_ACTION: string = "SceneObjectMgr.EVENT_UNIT_ACTION";
        //地图精灵金币有变化
        static EVENT_UNIT_MONEY_CHANGE: string = "SceneObjectMgr.EVENT_UNIT_MONEY_CHANGE";
        //地图精灵祈福时间有变化
        static EVENT_UNIT_QIFU_TIME_CHANGE: string = "SceneObjectMgr.EVENT_UNIT_QIFU_TIME_CHANGE";
        //地图精灵名称发生变化
        static EVENT_UNIT_NAME_CHANGE: string = "SceneObjectMgr.EVENT_UNIT_NAME_CHANGE";
        //mapinfo改变
        static EVENT_MAPINFO_CHANGE: string = "SceneObjectMgr.EVENT_MAPINFO_CHANGE";
        //主玩家更新
        static EVENT_PLAYER_INFO_UPDATE: string = "SceneObjectMgr.EVENT_PLAYER_INFO_UPDATE";
        //游戏列表变更
        static EVENT_GAMELIST_UPDATE: string = "SceneObjectMgr.EVENT_GAMELIST_UPDATE";
        //主玩家精灵有变化
        static EVENT_MAIN_UNIT_CHANGE: string = "SceneObjectMgr.EVENT_MAIN_UNIT_CHANGE";
        //精灵信息变化
        static EVENT_ADD_UNIT: string = "SceneObjectMgr.EVENT_ADD_UNIT";
        //移除精灵
        static EVENT_REMOVE_UNIT: string = "SceneObjectMgr.EVENT_REMOVE_UNIT";
        //德州带入金币变化
        static EVENT_DEZHOU_MONEY_UPDATE: string = "SceneObjectMgr.EVENT_DEZHOU_MONEY_UPDATE";
        //vip信息变更
        static EVENT_VIP_INFO_UPDATE: string = "SceneObjectMgr.EVENT_VIP_INFO_UPDATE";
        //配置更新
        static EVENT_FREE_STYLE_UPDATE: string = "SceneObjectMgr.EVENT_FREE_STYLE_UPDATE";
        //红包更新
        static EVENT_HONGBAO_UPDATE: string = "SceneObjectMgr.EVENT_HONGBAO_UPDATE";
        //地图id
        private _mapid: string;

        /**
         * 地图对象
         */
        get mapInfo(): MapInfo {
            if (!this._story) return null;
            return this._story.mapinfo;
        }

        //精灵对象集合
        private _unitDic: { [key: string]: Unit };
        get unitDic() {
            return this._unitDic;
        }

        /**
         * 通过位置获取精灵
         */
        getUnitByIdx(idx): Unit {
            for (let key in this._unitDic) {
                if (this._unitDic.hasOwnProperty(key)) {
                    let unit = this._unitDic[key];
                    if (unit && unit.GetIndex() == idx) {
                        return unit;
                    }
                }
            }

            return null;
        }

        private _mapAssetInfo: MapAssetInfo;
        /**
         * 地图信息
         */
        get mapAssetInfo(): MapAssetInfo {
            return this._mapAssetInfo;
        }

        // 应用程序引用
        private _game: Game;
        public get game() {
            return this._game;
        }
        public get sceneGame() {
            return this._game.sceneGame;
        }
        constructor(v: Game) {
            super();
            this._game = v;
            this._mapAssetInfo = new MapAssetInfo();
            this._unitDic = {};
        }

        update(diff: number) {
            this._story && this._story.update(diff);
            this.ForEachObject(function (guidObject: any) {
                guidObject && guidObject.update && guidObject.update(diff);
            });

            if (this._story) {
                //捕鱼 且地图没下来 不进
                if (this._story instanceof StoryFishBase && !this._story.mapinfo) return;
                //房卡 且地图没下来 不进
                if (this._story instanceof StoryRoomCardBase && !this._story.mapinfo) return;
                //百人场 且地图没下来 不进
                if (this._story instanceof StoryBaiRenBase && !this._story.mapinfo) return;
                let newMapid: string = this._story.mapid;
                if (newMapid && newMapid != this._mapid) {
                    this._mapid = newMapid;
                    //加载素材信息
                    this._mapAssetInfo.onLoadedComplete = () => {
                        //触发传送事件
                        this.ForEachObject((obj) => {

                        })
                        this.event(SceneObjectMgr.EVENT_LOAD_MAP, this._mapAssetInfo);
                    }
                    this._mapAssetInfo.load(newMapid, this._story.mapUrl, this._story.maplv);
                }
            }
        }

        // 创建对象
        CreateObject(k: string, u: number): GuidObject {
            // logd("SceneObjectMgr:CreateObject guid:" + k + ", oid:" + u);
            //地图这块要修改要知会下
            let obj: GuidObject;
            let prefix: String = getPrefix(k);
            switch (prefix) {
                case GlobalDef.TYPE_MAP:
                    logd("create map info", k, u);
                    let startIdx = k.indexOf(".");
                    let endIdx = k.lastIndexOf("_");
                    let map_id = k.substr(startIdx + 1, endIdx - 2);
                    let mapid = map_id.substr(0, 1).toUpperCase() + map_id.substr(1, map_id.length);
                    let comm = StringU.substitute("new game{0}.data.{1}MapInfo({2})", map_id, mapid, "this")
                    let mapinfo = eval(comm);
                    let isNew = !this._story;
                    this.intoStory(map_id, mapinfo.GetMapLevel(), undefined, undefined, true);
                    this._story.isReConnected = isNew || WebConfig.isConnected;
                    this._story.setMapinfo(mapinfo);
                    obj = mapinfo;
                    break;
                case GlobalDef.TYPE_UNIT:
                    obj = new Unit(this);
                    this._unitDic[k] = obj as Unit;
                    this.event(SceneObjectMgr.EVENT_ADD_UNIT, obj);
                    break;
                case GlobalDef.TYPE_PLAYER:
                    obj = new PlayerData(this);
                    this.setMainPlayer(obj as PlayerData);
                    break;
                case "globalobject":
                    obj = new GlobalData(this._game);
                    this.setGloabel(obj as GlobalData);
                    break;
                default:
                    obj = new GuidObject();
                    break;
            }
            obj.guid = k;
            obj.oid = u;
            this.AttachObject(obj);
            return obj;
        }

        ReleaseObject(o: GuidObject): void {
            if (!o) return;
            // logd("SceneObjectMgr:ReleaseObject guid:" + k);
            if (this._story && o == this._story.mapinfo) {
                this._story.clearMapInfo();
                if (this._story instanceof StoryNormalBase) {
                    this._story.destroyed && this.clearStory();
                } else {
                    this.clearStory()
                }
            }
            else if (o == this._mainPlayer) {
                this.setMainPlayer(null);
            }
            if (o instanceof Unit) {
                delete this._unitDic[o.guid];
                this.event(SceneObjectMgr.EVENT_REMOVE_UNIT, o);
            }
            //事件触发
            this.event(SceneObjectMgr.__DELETE_OBJECT, o);
            super.ReleaseObject(o);
        }

        /**
         * 通过oid查找对象
         * @param oid 
         */
        findByOid(oid: number): GuidObject {
            return this.Get(this._u_2_guid[oid]);
        }

        private _mainPlayer: PlayerData;
        /**
         * 主玩家对象
         */
        get mainPlayer(): PlayerData {
            return this._mainPlayer;
        }
        // 设置主玩家对象
        private setMainPlayer(v: PlayerData) {
            this._mainPlayer = v;
            v && logd("setMainPlayer");
            this.event(SceneObjectMgr.___MAIN_PLAYER_CHANGE, v);
        }

        private _gloabel: GlobalData;
        /**
         * 主玩家对象
         */
        get gloabel(): GlobalData {
            return this._gloabel;
        }
        // 设置主玩家对象
        private setGloabel(v: GlobalData) {
            this._gloabel = v;
        }

        private _mainUnitGuid: string;
        /**
         * 主玩家精灵guid
         */
        get mainUnitGuid(): string {
            return this._mainUnitGuid;
        }

        private _mainUnit: Unit;
        /**
         * 主玩家精灵对象
         */
        get mainUnit(): Unit {
            return this._mainUnit;
        }
        // 设置主玩家精灵对象
        private setMainUnit(v: Unit) {
            this._mainUnit = v;
            this.event(SceneObjectMgr.EVENT_MAIN_UNIT_CHANGE, v);
        }

        /**
         * 当主玩家加入时
         * @param guid 
         */
        onMainUnitJoin(guid: string): void {
            this._mainUnitGuid = guid;
            let mainUnit = this.Get(guid) as Unit;
            this.setMainUnit(mainUnit);
        }

        // 清理
        clear(): void {
            this.clearObjs();
            this.clearStory(true);
            this._mainPlayer = null;
        }

        // 清理对象	
        clearObjs(): void {
            this.ForEachObject((other: any) => {
                //事件触发
                this.event(SceneObjectMgr.__DELETE_OBJECT, other);
            });
            this._unitDic = {}
            super.clearObjs();
        }
        //////////////////////////剧情相关接口/////////////////////////
        private _story: StoryBase;


        /******************************剧情对应接口*************************************** */
        /**
         * 剧情信息
         */
        get story(): StoryBase {
            return this._story;
        }

        /**
         * 进入剧情
         * @param mapid 地图id枚举 BrniuniuPageDef.GAME_NAME
         * @param maplv 地图等级枚举 Web_operation_fields.GAME_ROOM_CONFIG_BRNIUNIU_1
         * @param enterMap 是否直接进入地图
         */
        public intoStory(mapid: string, maplv: string, enterMap?: boolean, dataSource?: IStoryCardRoomDataSource, fource?: boolean) {
            if (!fource && WebConfig.isConnected) {
                this._game.showTips("正在断线重连中...")
                return;//你需要断线重连
            }
            if (WebConfig.server_close) {
                this._game.alert(StringU.substitute("为了您更好的游戏体验，服务器正在更新中。为避免造成不必要的损失，更新期间无法进入游戏，给您造成的不便我们深表歉意，感谢您的配合。"), () => {
                }, () => {
                }, true, window["DatingPageDef"].ui_dating_tongyong + "btn_qd.png");
                return;//服务器更新重启
            }
            if (this._story) return;
            let map_id = mapid.substr(0, 1).toUpperCase() + mapid.substr(1, mapid.length);
            if (fource) {//断线重连进来的         
                if (WebConfig.game_type == Web_operation_fields.GAME_ROOM_CONFIG_CARD_ROOM) {//房卡类型
                    let comm = StringU.substitute("new game{0}.story.{1}Story({2},{3},{4},{5})", map_id.toLocaleLowerCase(), map_id, "this._game", "mapid", "maplv", "dataSource");
                    this._story = eval(comm);
                } else {
                    let comm = StringU.substitute("new game{0}.story.{1}Story({2},{3},{4})", map_id.toLocaleLowerCase(), map_id, "this._game", "mapid", "maplv");
                    this._story = eval(comm);
                }
            } else {//手动点进去的
                let pageDef = getPageDef(mapid);
                if (WebConfig.hudgametype == window["DatingPageDef"].TYPE_CARD && !pageDef["__enterMapLv"]) {//房卡类型
                    let comm = StringU.substitute("new game{0}.story.{1}Story({2},{3},{4},{5})", map_id.toLocaleLowerCase(), map_id, "this._game", "mapid", "maplv", "dataSource");
                    this._story = eval(comm);
                } else {
                    let comm = StringU.substitute("new game{0}.story.{1}Story({2},{3},{4})", map_id.toLocaleLowerCase(), map_id, "this._game", "mapid", "maplv");
                    this._story = eval(comm);
                }
            }
            enterMap && this.enterMap();
        }

        public enterMap() {
            if (this._story) {
                if (!this._story.mapinfo)//没有mapinfo 才需要发协议
                {
                    if (this._story.enterMap()) {
                        return true;
                    }
                }
            }
            return false;
        }

        //取消匹配
        public cancleMathch() {
            if (this._story) {
                if (!this._story.mapinfo) {
                    this._game.network.call_cancel_match();
                    return true;
                }
            }
            return false;
        }

        public leaveStory();
        public leaveStory(b: boolean)
        /**
         * 离开地图
         * @param needStroy 是否离开场景 (有些可能还需要在场景 里面)
         */
        public leaveStory(...args) {
            if (this._story) {
                if (args && args.length && this._story instanceof gamecomponent.story.StoryNormalBase) {
                    this._story.destroyed = args[0];
                }
                if (this._story.mapinfo) {
                    if (this._story.leavelMap()) {
                        this._game.setIsLockGame(true, false, "SceneObjectMgr.leaveStory");
                    }
                } else {
                    this.clearStory();
                }
            }
        }


        //改变剧情回调
        private _changeStoryCallBack: Function;
        /**
        * 改变剧情
        * @param mapid 地图id枚举 BrniuniuPageDef.GAME_NAME
        * @param maplv 地图等级枚举 Web_operation_fields.GAME_ROOM_CONFIG_BRNIUNIU_1
        * @param enterMap 是否直接进入地图
        */
        public changeStory(callBack: Function): void {
            //如果当前有剧情
            this.leaveStory(true);
            this._changeStoryCallBack = () => {
                callBack && callBack();
                callBack = null;
            }
        }

        //离开场景 
        private clearStory(force?: boolean) {
            if (!this._story) return;
            //断线强制清理
            if (force || !this._story.mapinfo) {//mapinfo还在 不能清剧情 
                let old_mapid = this._story.mapid;
                this._mapid = "";
                this._story.dispose();
                this._story = null;
                this.event(SceneObjectMgr.EVENT_LOAD_MAP, old_mapid);
                //计算金钱
                if (force) {
                    this._changeStoryCallBack = null;
                } else {
                    this.CallchangeStory();
                }
            }
        }

        public CallchangeStory() {
            if (WebConfig.isConnected) return;
            if (this._changeStoryCallBack != null)//需要就回调
            {
                this._changeStoryCallBack();
                this._changeStoryCallBack = null;
            }
        }

        /********************************************************************* */



        /********************************************************************* */

        // 客户端模拟的对象uid
        private static _offlineLastUID: number = 4294967295;
        // 创建假unit对象
        createOfflineObject(prefix: string, myObject?: any): GuidObject {
            // if (object && !(object instanceof GuidObject)) {
            //     throw new Error("对象类型不对")
            // }
            SceneObjectMgr._offlineLastUID--;
            let obj;
            let uid = SceneObjectMgr._offlineLastUID;
            let guid = makeGuid(prefix, uid);
            if (myObject) {
                obj = new myObject(this);
                obj.guid = guid;
                obj.oid = uid;
                this.AttachObject(obj);
                return obj;
            }
            else {
                obj = this.CreateObject(guid, uid);
            }
            return obj;
        }

        /**
         *  清理假unit对象
         * @param obj 传单个 不传 清所有
         */
        clearOfflineObject(obj?: GuidObject): void {
            if (obj && !(obj instanceof GuidObject)) {
                throw new Error("对象类型不对")
            }
            if (obj) {
                if (obj.oid >= SceneObjectMgr._offlineLastUID) {
                    this.ReleaseObject(obj);
                } else {
                    throw new Error("不是假对象你不能清")
                }
            } else {
                this.ForEachObject((obj: any) => {
                    if (obj instanceof GuidObject) {
                        obj.oid >= SceneObjectMgr._offlineLastUID && this.ReleaseObject(obj);
                    }
                })
            }
        }
    }
}
