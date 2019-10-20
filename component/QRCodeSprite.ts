/**
* 二维码
*/
module gamecomponent.component {
    export class QRCodeSprite extends laya.display.Sprite {

        private static QRCodes = {};
        static createQRCodeBase64(url, imgWidth: number, imgHeight: number, complate: Function) {
            if (!url) return;
            let qr = this.QRCodes[url] as QRCodeBase64;
            if (qr) {
                if (qr.base64)
                    complate && complate(qr.base64);
                else {                    
                    qr.handler = Handler.create(this, (base64)=>{
                        complate && complate(base64);
                    })
                }
                return;
            }                
            qr = new QRCodeBase64();
            qr.handler = Handler.create(this, (base64)=>{
                complate && complate(base64);
            })
            qr.make(url, imgWidth, imgHeight);
            this.QRCodes[url] = qr;
        }
        static deleteQRCodeBase64(url) {
            let qr = this.QRCodes[url];
            if (qr instanceof QRCodeBase64) {
                
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

    class QRCodeBase64 {
        private _base64: string;
        get base64(): string {
            return this._base64;
        }
        private _handlers:Handler[];
        set handler(h:Handler) {
            if (!this._handlers)
                this._handlers = [];
            this._handlers.push(h);
        }

        constructor() {}

        make(url, imgW, imgH) {
            let div: any = Laya.Browser.document.createElement("div");
            let qrcode = new Laya.Browser.window.QRCode(div, {
                width: imgW,
                height: imgH
            });
            qrcode.makeCode(url);
            Laya.timer.frameOnce(1, this, () => {
                this._base64 = qrcode._oDrawing._elImage.src;
                if (!this._base64 || !this._base64.length) {
                    this._base64 = 'WebConfig.erwmUrl';
                }
                if (this._handlers) {
                    this._handlers.forEach(handler => {
                        (<Handler>handler).runWith(this._base64);
                    });
                    this._handlers.length = 0;
                }
                this._handlers = null;
                div = null;
                qrcode = null;
            });
        }

        clear() {
            Laya.timer.clearAll(this);
        }
    }
}