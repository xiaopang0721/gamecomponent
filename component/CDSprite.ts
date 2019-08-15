module gamecomponent.component {
    /**
     * CD冷却
     */
    export class CDSprite extends Laya.Sprite {
        static END_CD: string = "end_cd";

        private _radius: number;
        private _game: Game;

        //是否在冷却中
        public isCooling: boolean = false;

        //文本
        private _labelCD: Label;
        //CD结束时间(毫秒)
        private _endTime: number;
        //CD开始时间(毫秒)
        private _startTime: number;
        //CD总时间
        private _totalTime: number;

        //cd
        private _cdSprite: Sprite;
        private _isWeb: boolean;

        constructor() {
            super();
        }

        get cdmask()
        {
            return this._cdSprite;
        }

        /**
         * 初始化CD信息
         * @param width 宽度
         * @param height 高度
         * @param radius CD半径
         * @param alpha 透明度
         * @param isNeedText 是否需要显示倒计时文本
         */
        init(v: Game, width: number, height: number, radius: number, alpha: number, isNeedText: boolean = true): void {
            this._game = v;
            this.width = width;
            this.height = height;
            this._radius = radius;
            if (!this._cdSprite) {
                this._cdSprite = new Sprite();
                this._cdSprite.size(width, height);
                this.addChild(this._cdSprite);
                this._cdSprite.alpha = alpha;
            }
            //需要显示文本
            if (isNeedText) {
                if (!this._labelCD) {
                    this._labelCD = new Label();
                    this._labelCD.font = "Helvetica";
                    this._labelCD.fontSize = 28;
                    this._labelCD.color = "#ffffff";
                    this._labelCD.stroke = 2;
                    this._labelCD.strokeColor = "#000000";
                    this._labelCD.bold = true;
                    this._labelCD.align = "center";
                    this._labelCD.width = this.width;
                }
                if (!this._labelCD.parent) {
                    this.addChild(this._labelCD);
                    this._labelCD.pos(0, this.height / 2 - 15);
                }
            }
        }

        /**
         * 开始cd
         * @param endTime CD时长(毫秒)
         * @param isWeb 是否是web时间
         */
        public startCD(endTime: number, isWeb: boolean = true): void {
            if (endTime <= 0 || this.isCooling) return;
            this._isWeb = isWeb;
            if (this._cdSprite) {
                this._cdSprite.visible = true;
            }
            //开始CD的时间
            this._startTime = isWeb ? this._game.sceneGame.sync.serverWebTimeBys * 1000 : this._game.sceneGame.sync.serverTimeBys * 1000;
            this._endTime = endTime;
            this._totalTime = endTime - this._startTime;
            this.isCooling = true;
            if (this._labelCD) {
                this._labelCD.text = Math.floor(this._totalTime / 1000).toString();
            }
        }

        //cd心跳
        updateCD(): void {
            if (!this.isCooling) return;
            let now_time = this._isWeb ? this._game.sceneGame.sync.serverWebTimeBys * 1000 : this._game.sceneGame.sync.serverTimeBys * 1000;
            let remain_time: number = this._endTime - now_time;
            if (remain_time <= 0) {
                //时间到了
                this.stopCD();
            }
            else {
                this.drawCD(remain_time / this._totalTime * 360);
                if (remain_time > 0) {
                    if (this._labelCD)
                        this._labelCD.text = Math.floor(remain_time / 1000).toString();
                }
            }
        }

        //绘制cd
        private drawCD(angle: number): void {
            angle = 360 - angle;
            if (this._cdSprite) {
                this._cdSprite.graphics.clear();
                this._cdSprite.graphics.drawPie(this.width / 2, this.height / 2, this._radius, angle - 90, - 90, "#000000");
            }
        }

        //停止cd 
        public stopCD(): void {
            if (!this.isCooling) return;
            this.isCooling = false;
            this._endTime = 0;
            this._startTime = 0;
            Laya.timer.clear(this, this.updateCD);
            if (this._cdSprite) {
                this._cdSprite.visible = false;
            }
            if (this._labelCD) {
                this._labelCD.text = "";
            }
            this.event(CDSprite.END_CD);
        }

        public destroy(): void {
            if (this._cdSprite) {
                this._cdSprite.destroy(true);
                this._cdSprite = null;
            }
            if (this._labelCD) {
                this._labelCD.destroy(true);
                this._labelCD = null;
            }
            super.destroy(true);
        }
    }
}