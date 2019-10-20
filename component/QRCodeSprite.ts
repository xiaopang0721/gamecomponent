/**
* 二维码
*/
module gamecomponent.component {
    export class QRCodeSprite extends laya.display.Sprite {

        private static QRCodes = {};
        static createQRCodeBase64(url, imgWidth: number, imgHeight: number, handle: Handler) {
            if (!url) return;
            let qr = this.QRCodes[url] as QRCodeBase64;
            if (qr && qr.base64) {
                handle && handle.runWith(qr.base64);
                return;
            }
            qr = new QRCodeBase64();
            qr.handler = handle;
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

        constructor(url: string, imgWidth: number, imgHeight: number, handle?: Handler) {
            super();
            QRCodeSprite.createQRCodeBase64(url, imgWidth, imgHeight, handle);
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
        private _handlers: Handler[];
        set handler(h: Handler) {
            if (!this._handlers)
                this._handlers = [];
            this._handlers.push(h);
        }

        constructor() { }

        make(url, imgW, imgH) {
            let img: any = Laya.Browser.document.createElement("img");
            let qrcode = new Laya.Browser.window.QRCode(img, {
                text: url,
                width: imgW,
                height: imgH
            });
            Laya.timer.frameOnce(1, this, () => {
                this._base64 = qrcode._oDrawing._elImage.src;
                if (!this._base64 || !this._base64.length) {
                    this._base64 = WebConfig.ewmUrl;
                }
                if (this._handlers) {
                    this._handlers.forEach(handler => {
                        (<Handler>handler).runWith(this._base64);
                    });
                    this._handlers.length = 0;
                }
                this._handlers = null;
                img = null;
                qrcode = null;
            });
        }

        clear() {
            Laya.timer.clearAll(this);
        }
    }
}