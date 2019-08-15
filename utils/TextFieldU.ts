/** 
 * 文本工具
*/
module utils {
    import HTMLDivElement = laya.html.dom.HTMLDivElement;
    export class TextFieldU {

        private static txtReg: RegExp;
		/**
		 * 设置html文本
		 * @param txt 文本对象
		 * @param htmlText html文本内容
		 */
        public static setHtmlText(txt: any, htmlText: string, isContent: boolean = true): [number, number] {
            if (!txt) return null;
            if (!(txt instanceof Laya.Text) && !(txt instanceof Laya.Label)) return null;
            let html: HTMLDivElement = TextFieldU.findHtmlDiv(txt);
            if (!TextFieldU.txtReg) TextFieldU.txtReg = new RegExp("<(S*?)[^>]*>.*?|<.*? />");
            if (!htmlText || !TextFieldU.txtReg.test(htmlText)) {
                if (html) {
                    html.removeChildren();
                    if (!htmlText) txt.removeChild(html);
                }
                txt["text"] = htmlText ? htmlText : "";
                if (txt instanceof Laya.Label) txt = txt.textField;
                if (isContent) return [txt["textWidth"] + 8, txt["textHeight"] + 5];
                else return [txt.width, txt.height];
            }
            if (!html) {
                html = new laya.html.dom.HTMLDivElement();
                html.style.color = txt["color"];
                html.style.stroke = txt["stroke"];
                html.style.strokeColor = txt["strokeColor"];
                html.style.fontSize = txt["fontSize"];
                html.style.font = txt["font"];
                html.style.leading = txt["leading"];
                html.style.height = txt["height"];
                html.style.bold = txt["bold"];
                html.width = txt["width"];
                html.style.align = txt["align"];
                (txt as Sprite).addChild(html);
            } else {
                html.removeChildren();
            }
            let strArr: any[] = htmlText.split("&");
            let align: string;
            if (strArr.length == 2) {
                align = strArr[1];
                if (align && (align == "left" || align == "center" || align == "right")) html.style.align = align;
                html.innerHTML = strArr[0];
            }
            else html.innerHTML = htmlText;
            html.layout();
            txt["text"] = "";
            if (isContent) return [html.contextWidth, html.contextHeight];
            else return [html.width, html.height];
        }

		/**
		 * 设置html文本
		 * @param txt 文本对象
		 * @param htmlText html文本内容
		 */
        public static createHtmlText(txt: any, htmlText: string = ''): HTMLDivElement {
            if (!txt) return null;
            if (!(txt instanceof Laya.Text) && !(txt instanceof Laya.Label)) return null;
            let html: HTMLDivElement;//TextFieldU.findHtmlDiv(txt);
            if (!html) {
                html = new laya.html.dom.HTMLDivElement();
                html.style.color = txt["color"];
                html.style.stroke = txt["stroke"];
                html.style.strokeColor = txt["strokeColor"];
                html.style.fontSize = txt["fontSize"];
                html.style.font = txt["font"];
                html.style.leading = txt["leading"];
                html.style.height = txt["height"];
                html.style.bold = txt["bold"];
                html.width = txt["width"];
                html.style.align = txt["align"];
                html.x = txt['x'];
                html.y = txt['y'];
                txt.parent.addChild(html);
                txt.visible = false;
                // (txt as Sprite).addChild(html);
            } else {
                html.removeChildren();
            }
            let strArr: any[] = htmlText.split("&");
            let align: string;
            if (strArr.length == 2) {
                align = strArr[1];
                if (align && (align == "left" || align == "center" || align == "right")) html.style.align = align;
                html.innerHTML = strArr[0];
            }
            else html.innerHTML = htmlText;
            html.layout();
            txt["text"] = "";
            return html;
        }
        //搜索html对象
        public static findHtmlDiv(txt: Sprite): HTMLDivElement {
            if (!txt) return null;
            let node: laya.display.Node;
            let num = txt.numChildren;
            for (let i: number = 0; i < num; i++) {
                node = txt.getChildAt(i);
                if (node instanceof HTMLDivElement) return node;
            }
            return null;
        }
		/**
		 * 创建文本
		 * @param text 文本内容
		 * @param props 文本属性{color:null,fontSize:12,stroke:0,strokeColor:null,postion:Vector2,x:0,y:0,width:0,height:0,alpha:1,scale:1,scaleX:1,scaleY:1,anchor:0,anchorX:0,anchorY:0,center:NaN,centerX:NaN,centerY:NaN,parent:null}
		 */
        // public static createLabel(text: string = null, props: any = null): Label {
        //     let txt: Label = new Label(text);
        //     if (props) {
        //         DisplayU.setCompAttr(txt, props);
        //         if (props.hasOwnProperty("color")) txt.color = props.color;//颜色
        //         if (props.hasOwnProperty("fontSize")) txt.fontSize = props.fontSize;//字号
        //         if (props.hasOwnProperty("stroke")) txt.stroke = props.stroke;//描边宽度
        //         if (props.hasOwnProperty("strokeColor")) txt.strokeColor = props.strokeColor;//描边颜色
        //     }
        //     return txt;
        // }

        /**清理文本(不能再使用):清理父节点。引用、事件监听、timer监听、子对象*/
        public static clearLabel(txt: Label): Label {
            if (txt) txt.destroy(true);
            return null;
        }
    }
}