module gamecomponent.scene {
    export class AvatarBase implements gamecomponent.object.ISortDrawObject {
        protected _baseData: gamecomponent.object.ActionBase;
        get baseData() {
            return this._baseData;
        }

        //场景位置
        protected _pos: Vector2;
        get pos(): Vector2 {
            return this._pos;
        }

        protected _pivotX: number = 0;
        protected _pivotY: number = 0;

        protected _visible: boolean;
        get visible(): boolean {
            return this._visible;
        }
        set visible(v: boolean) {
            this._visible = v;
        }

        // 摄像机使用的位置
        get lookPos(): Vector2 {
            return this._pos;
        }

        // 旋转角度
        protected _skew_x: number = 0;
        protected _skew_y: number = 0;
        // 旋转角度
        protected _rotateAngle: number = 0;
        // 是否水平翻转
        protected _isFlipH: boolean = false;
        // 渲染矩阵
        protected _matrix = new Matrix();

        protected _sortScore: number = 0;
        /**
         * 排序评分
         */
        get sortScore(): number {
            return this._sortScore;
        }
        // 缩放
        protected _textures: { [key: string]: Texture } = {};


        protected _drawW: number;
        protected _drawH: number;

        protected _texture: Texture;

        /**
         * 是否置灰
         */
        protected _disable: boolean;
        /**
         * 是否高光
         */
        protected _light: boolean;
        /**
        * 位置
        */
        protected _drawX: number;
        get drawX() {
            return this._drawX
        }
        protected _drawY: number;
        get drawY() {
            return this._drawY
        }

        // 透明度
        protected _alpha: number = 1;
        /**
         * 透明度
         */
        get alpha(): number {
            return this._alpha;
        }
        set alpha(v: number) {
            this._alpha = v;
        }
        // 缩放
        protected _scaleX: number = 1;

        protected _scaleY: number = 1;

        protected _scale: number = 1;
        set scale(v: number) {
            this._scale = v;
            this._scaleX = this._scaleX * this._scale;
            this._scaleY = this._scaleY * this._scale;
        }

        protected _oid: number = 0;
        get oid(): number {
            return this._oid;
        }

        private _mouseEnabled: boolean = false;
		/**
		 * 鼠标响应
		 */
        set mouseEnabled(v: boolean) {
            this._mouseEnabled = v;
        }

        private _refAssetComplete: boolean;
        private _refAsset: RefAsset;

        private _texture_url: string;

        set texture_url(url) {
            this._texture_url = url;
            this.startLoadTexture();
        }

        protected _hitArea: Array<number>
        protected _game: Game;
        protected _camera: Camera;
        constructor(v: Game) {
            this._pos = new Vector2;
            this._visible = true;
            this._sortScore = 0;
            this._game = v;
            this._camera = Camera.ins;
        }

        // 加载贴图
        private startLoadTexture() {
            let url = this._texture_url;
            if (!url) return;
            if (this._refAssetComplete) return;
            if (!this._refAsset)  {
                this._refAsset = RefAsset.Get(url)
                this._refAsset.retain();
            }
            let refAsset = this._refAsset;
            if (!refAsset.parseComplete) {
                refAsset.once(LEvent.COMPLETE, this, () => {
                    this.initTexture();
                });
            }
            else {
                this.initTexture();
            }
            this._refAssetComplete = false;
        }

        private initTexture() {
            // 获取贴图
            let url = this._texture_url;
            if (!url) return;
            if(this._refAssetComplete) return;
            let atlas = Loader.getAtlas(url);
            for (let index = 0; index < atlas.length; index++) {
                let a: string = atlas[index];
                let name = a.substring(a.lastIndexOf("/") + 1, a.lastIndexOf(".png"));
                this._textures[name] = Loader.getRes(a);
            }
            this._refAssetComplete = true;
        }

        update(diff: number): void {
            if (this._refAsset && !this._refAssetComplete && !this._refAsset.hasListener(LEvent.COMPLETE) && !(this instanceof AvatarChip)) {
                this.startLoadTexture();
            }
            if (!this._baseData || !this._pos) return;
            if (this._baseData.isFinalPos && this._baseData.targe_pos) {
                this._pos.x = this._baseData.targe_pos.x;
                this._pos.y = this._baseData.targe_pos.y;
            }
            this._drawX = this._camera.getScenePxByCellX(this._pos.x);
            this._drawY = this._camera.getScenePxByCellY(this._pos.y);
        }

        onDraw(diff: number, bg: Graphics, scene: SceneRootBase): void {
            if (!this._texture || !this._visible || !this._baseData) return;
            if (!this._drawW) {
                this._drawW = this._texture.sourceWidth;
            }
            if (!this._drawH) {
                this._drawH = this._texture.sourceHeight;
            }
            let w = this._drawW;
            let h = this._drawH;
            let halfw = w / 2;
            let halfh = h / 2;
            let matrix = this._matrix;
            matrix.identity();
            matrix.tx = - halfw;
            matrix.ty = - halfh;
            matrix.scale(this._scaleX, this._scaleY);
            if (this instanceof AvatarChip) {
                matrix.rotate(0);
            } else {
                matrix.rotate(this._rotateAngle);
            }
            matrix.skew(this._skew_x, this._skew_y);
            matrix.tx += this._drawX;
            matrix.ty += (this._drawY + (this._baseData.toggle ? this._baseData.toggleDistance : 0));
            bg.drawTexture(this._texture, 0, 0, this._drawW, this._drawH, matrix, this._alpha);

            let thitx = this._camera.getCellXByScene(matrix.tx);
            let thity = this._camera.getCellYByScene(matrix.ty);

            let drawW = this._drawW * this._scaleX;
            let drawH = this._drawH * this._scaleY;

            this._hitArea = [
                thitx, thity,
                thitx + drawW, thity,
                thitx + drawW, thity + drawH,
                thitx, thity + drawH
            ];

            if (this._disable) {
                bg.drawTexture(this._textures[SceneRes.GRAY], 0, 0, this._drawW, this._drawH, matrix, this._alpha);
            }
            if (this._light) {
                bg.drawTexture(this._textures[SceneRes.LIGHT], 0, 0, this._drawW, this._drawH, matrix, this._alpha);
            }
        }

        onMultiDraw(diff: number, gArr: Graphics[], scene: SceneRootBase): void {

        }

        hasClear: boolean;
        clear(checkNow: boolean): void {
            this.hasClear = true;
            this._texture = null;
            this._textures = null;
            this._refAssetComplete = false;
            this._texture_url = null;
            if (this._refAsset) {
                this._refAsset.offAll();
                this._refAsset.release(true);
                this._refAsset = null;
            }
        }

        private _hitAreaColor: string;
        protected drawHitArea(area: Array<number>, g: Graphics, x: number, y: number, dx: number, dy: number): void {
            if (!area) {
                return;
            }
            let hitArea = [];
            for (let i = 0; i < area.length;) {
                hitArea.push(area[i] - x, area[i + 1] - y);
                i += 2;
            }
            const cls = ['#000', , '#00FF00', '#FF0000', '#0000FF']
            if (!this._hitAreaColor) {
                this._hitAreaColor = cls[Math.floor(Math.random() * cls.length)];
            }
            g.drawPoly(dx, dy, hitArea, null, this._hitAreaColor, 2);
        }
    }
}