/**
* 二维码
*/
module gamecomponent.component {
    export class QRCodeSprite extends laya.display.Sprite {

        private static QRCodes = {};
        static createQRCodeBase64(url, imgWidth: number, imgHeight: number, complate: Function) {
            let qr = this.QRCodes[url] as QRCodeBase64;
            if (qr) {
                if (qr.base64)
                    complate && complate(qr.base64);
                else {                    
                    qr.on(LEvent.COMPLETE, this, ()=>{
                        complate && complate(qr.base64);
                        qr.offAll();
                    });
                }
                return;
            }                
            qr = new QRCodeBase64(url, imgWidth, imgHeight);
            qr.on(LEvent.COMPLETE, this, ()=>{
                complate && complate(qr.base64);
                qr.offAll();
            });
            this.QRCodes[url] = qr;
        }
        static deleteQRCodeBase64(url) {
            let qr = this.QRCodes[url];
            if (qr instanceof QRCodeBase64) {
                qr.offAll();
                qr.clear();
                delete this.QRCodes[url];
            }
        }

        constructor(url: string, imgWidth: number, imgHeight: number, complate?: Function) {
            super();
            QRCodeSprite.createQRCodeBase64(url, imgWidth, imgHeight, (base64)=>{
                this.loadImage(base64, 0, 0, imgWidth, imgHeight, Handler.create(this, () => {
                    complate && complate(url);
                }));
            });
        }

        destroy(destroyChild?: boolean): void {
            this.removeSelf();
            Laya.timer.clearAll(this);
            super.destroy(destroyChild);
        }
    }

    class QRCodeBase64 extends EventDispatcher{
        private _base64: string;
        get base64(): string {
            return this._base64;
        }

        constructor(url, imgW, imgH) {
            super();
            let div: any = Laya.Browser.document.createElement("div");
            let qrcode = new Laya.Browser.window.QRCode(div, {
                width: imgW,
                height: imgH
            });
            qrcode.makeCode(url);
            Laya.timer.frameOnce(1, this, () => {
                this._base64 = qrcode._oDrawing._elImage.src;
                this.event(LEvent.COMPLETE, this._base64);
                div = null;
                qrcode = null;
            });
        }

        clear() {
            Laya.timer.clearAll(this);
        }
    }
}