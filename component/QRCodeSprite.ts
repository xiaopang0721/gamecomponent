/**
* 二维码
*/
module gamecomponent.component {
    export class QRCodeSprite extends laya.display.Sprite {
        private _url: string;
        private _imgW: number;
        private _imgH: number;
        private _qrcode:any;
        private _complate:Function;

        constructor(url: string, imgWidth: number, imgHeight: number, complate?:Function) {
            super();
            this._url = url;
            this._imgW = imgWidth;
            this._imgH = imgHeight;
            this._complate = complate;
            this.show();
        }

        destroy(destroyChild?: boolean): void {
            if (this._qrcode) {
                this._qrcode.clear();
                this._qrcode = null;
            }
            this._url = null;
            this._complate = null;
            this.removeSelf();
            Laya.timer.clearAll(this);
            super.destroy(destroyChild);
        }

        private show(): void {
            let div: any = Laya.Browser.document.createElement("div");
            this._qrcode = new Laya.Browser.window.QRCode(div, {
                width: this._imgW,
                height: this._imgH
            });
            this._qrcode.makeCode(this._url);
            Laya.timer.frameOnce(1, this, this.onCheckSrc);            
        }

        private onCheckSrc():void{
            let src = this._qrcode._oDrawing._elImage.src;
            if (src) {
                Laya.timer.clearAll(this);
                this.loadImage(src, 0, 0, this._imgW, this._imgH, Handler.create(this, ()=>{
                    this._complate && this._complate(this._url);
                }));
                return;
            }
        }
    }
}