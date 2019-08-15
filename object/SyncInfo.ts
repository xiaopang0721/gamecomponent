/**
* 同步对象
*/
module gamecomponent.object {
    // export class SyncInfo extends SyncField {
    export class SyncInfo extends core.obj.GuidObject {
        static MAX_NETDELAY:number = 460;
        private _date: Date;
        // 延迟时间
        private _pings: Array<Ping> = [];
        private _netDelay:number = SyncInfo.MAX_NETDELAY;
        // 网络延迟
        get netDelay(): number {
            return this._netDelay;
        }

        // 场景对象管理器
        private _sceneObjectMgr: SceneObjectMgr;
        constructor(v: SceneObjectMgr) {
            super();
            this._sceneObjectMgr = v;
            this._date = new Date();
            this._after_update = this.onUpdate;
            // 每2秒ping一次服务器
            Laya.timer.loop(2000, this, this.ping);
        }

        private ping(): void {
            let time = this._date.getTime();
            let timeout = time - SyncInfo.MAX_NETDELAY;
            while(this._pings[0] && this._pings[0].time < timeout){
                this._pings.shift();
            }
            let ping = new Ping(time);
            this._pings.push(ping);
            // this._sceneObjectMgr.game.network.call_ping(ping.id);
        }

        private reply(id:number):void{
            for(let i = 0; i < this._pings.length; i ++){
                let ping = this._pings[i]
                if(ping.id == id){
                    this._netDelay = ping.getDelay(this._date.getTime());
                    logd("netDelay:", this._netDelay);
                    this._pings.splice(i, 1);
                    return;
                }
            }
            this._netDelay = SyncInfo.MAX_NETDELAY;
            logd("netDelay:", this._netDelay);
        }

        private onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
            // if (mask.GetBit(SyncField.SYNC_INT_FIELD_SYNC_ID)) {
            //     this.reply(this.GetSyncID());
            // }
        }

        dispose(): void {
            Laya.timer.clear(this, this.ping);
            super.dispose();
        }
    }

    class Ping{
        static lastID = 0;
        private _id:number;
        get id():number{
            return this._id;
        }
        private _time:number;
        get time():number{
            return this._time;
        }

        getDelay(v:number):number{
            return v - this._time;
        }

        constructor(t:number) {
            this._id = Ping.lastID ++;
            this._time = t;
        }
    }
}