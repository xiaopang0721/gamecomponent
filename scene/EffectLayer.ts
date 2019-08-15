module gamecomponent.scene {
    export class EffectLayer extends game.base.Container {
        private _scene: SceneRoot;
        // 层级视口区域
        private _camera: Camera;
        private _effectTextures: Texture[];
        private _effect: EffectFrame;

        constructor(v: SceneRoot) {
            super(v.game);
            this._scene = v;
            this._camera = v.camera;
        }

        load(info: MapAssetInfo): void {
            if (this._effect) {
                ObjectPools.free(this._effect);
                this._effect = null;
            }
            //添加特效
            this._effect = ObjectPools.malloc(EffectFrame, null, 9, 50, null) as EffectFrame;
            this._effect.setAssetPath(CompoentPath.mapEffect);
            let url = CompoentPath.mapEffect + "1/{0}.jpg";
            this._effect.setDataFrames(info.imgId.toString(), CompoentPath.getSeqFrames(url, 19, 1), 9, 1);
            this._effect.isPlayEnd = false;
            this._effect.setLoop(true);
            this._effect.centrePoint = new Vector2(0, 0);
            this._effect.scale = 1.75;
            this._effect.setOffset(100, 0);
            //气泡
            // url = CompoentPath.scene_single + "bubble.png";
            // this._bubbleTexure = Laya.loader.getRes(url);
        }

        onDraw(diff: number): void {
            //视口
            if (isShowDebug) {
                let startX = this._camera.bufferLeft + this._camera.bufferOffsetX;
                let startY = this._camera.bufferTop + this._camera.bufferOffsetY;
                let endX = startX + this._camera.bufferWidth;
                let endY = startY + this._camera.bufferHeight;
                this.graphics.drawRect(startX, startY, 5, this._game.clientHeight, "#000000");
                this.graphics.drawRect(endX, startY, 5, this._game.clientHeight, "#000000");
                this.graphics.drawRect(startX, startY, this._game.clientWidth, 5, "#000000");
                this.graphics.drawRect(startX, endY, this._game.clientWidth, 5, "#000000");
            }
        }


        public clear(): void {
            if (this._effect) {
                ObjectPools.free(this._effect);
                this._effect = null;
            }

            this.graphics.clear();
        }
    }

}