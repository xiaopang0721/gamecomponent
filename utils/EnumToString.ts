module utils {
    /**
     * 枚举转文字
     */
    export class EnumToString {

        /**
         *  获取数字的中文
         *  @param num 数字
         *  @return 返回中文 1234
         */
        private static chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        private static chnUnitChar = ["", "十", "百", "千"];
        private static chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];

        public static getNumStr(num) {
            let unitPos = 0;
            let strIns = '', chnStr = '';
            let needZero = false;

            if (num === 0) {
                return EnumToString.chnNumChar[0];
            }

            if (num == 10) {
                return EnumToString.chnUnitChar[1];
            }

            while (num > 0) {
                let section = num % 10000;
                if (needZero) {
                    chnStr = EnumToString.chnNumChar[0] + chnStr;
                }
                strIns = EnumToString.sectionToChinese(section);
                strIns += (section !== 0) ? EnumToString.chnUnitSection[unitPos] : EnumToString.chnUnitSection[0];
                chnStr = strIns + chnStr;
                needZero = (section < 1000) && (section > 0);
                num = Math.floor(num / 10000);
                unitPos++;
            }
            return chnStr;
        }

        private static sectionToChinese(section) {
            let strIns = '', chnStr = '';
            let unitPos = 0;
            let zero = true;
            while (section > 0) {
                let v = section % 10;
                if (v === 0) {
                    if (!zero) {
                        zero = true;
                        chnStr = EnumToString.chnNumChar[v] + chnStr;
                    }
                } else {
                    zero = false;
                    strIns = EnumToString.chnNumChar[v];
                    if (section == 1 && unitPos == 1) {
                        strIns = "";
                    }
                    strIns += EnumToString.chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        }

        //关键词
        static LABEL_TITLE: string = '\\[title\\](.+?)\\[/title\\]';//标题
        static LABEL_SIZE: string = '\\[font-size=(.+?)\\](.+?)\\[/font-size\\]';//文本大小
        static LABEL_COLOR: string = '\\[font-color=(.+?)\\](.+?)\\[/font-color\\]';//文本颜色
        static LABEL_CENTER: string = '\\[center\\](.+?)\\[/center\\]';//居中
        static LABEL_BOLD: string = '\\[b\\](.+?)\\[/b\\]';//粗体
        static LABEL_UNDERLINE: string = '\\[u\\](.+?)\\[/u\\]';//下划线
        static LABEL_LINK: string = '\\[link=(.+?)\\](.+?)\\[/link\\]';//链接
        static LABEL_BR1: string = '\n';//换行
        static LABEL_BR2: string = '\r\n';//换行2
        static LABEL_PLAYER: string = '\\[p\\](.+?)\\[/p\\]';//玩家
        static LABEL_NUM: string = '\\[n\\](.+?)\\[/n\\]';//数字
        static LABEL_MAP: string = '\\[m\\](.+?)\\[/m\\]';//地图
        static LABEL_GOTO: string = '\\[q\\](.+?)\\[/q\\]';//前往
        static LABEL_TELE: string = '\\[d\\](.+?)\\[/d\\]';//传送
        static LABEL_GUID: string = '\\[g\\](.+?)\\[/g\\]';//guid
        static LABEL_JOIN: string = '\\[j\\](.+?)\\[/j\\]';//加入
        static LABEL_BQ: string = '\\[[\\u4e00-\\u9fa5]+\\d*\\]';//表情

        //公告信息转HTML 
        public static getGongGaoText(str: string, scale?: number): any {
            let result = str;
            //标题
            result = result.replace(new RegExp(this.LABEL_TITLE, "gm"), "<span style='color:#ffff00;bold:true;font-size:20px;'>$1</span><br/>");
            //字体大小
            result = result.replace(new RegExp(this.LABEL_SIZE, "gm"), "<span style='font-size:$1'>$2</span>");
            //字体颜色
            result = result.replace(new RegExp(this.LABEL_COLOR, "gm"), "<span style='color:$1'>$2</span>");
            //居中显示 
            result = result.replace(new RegExp(this.LABEL_CENTER, "gm"), "<span style='align:center'>$1</span>");
            //加粗
            result = result.replace(new RegExp(this.LABEL_BOLD, "gm"), "<span style='bold:true'>$1</span>");
            //下划线
            result = result.replace(new RegExp(this.LABEL_UNDERLINE, "gm"), "<u>$1</u>");
            //超链接
            result = result.replace(new RegExp(this.LABEL_LINK, "gm"), "<span href='$1'>$2</span>");
            //换行
            result = result.replace(this.LABEL_BR1, "<br/>");
            result = result.replace(this.LABEL_BR2, "<br/>");
            //表情
            // let faceWrods: string[] = this.getFaceWords();
            // result = result.replace(new RegExp(this.LABEL_BQ, "gm"), (word: string) => {
            //     let index = faceWrods.indexOf(word);
            //     //校验资源
            //     if (index >= 24 || index < 0)
            //         return word;
            //     if (scale)
            //         return StringU.substitute("<img src='" + CompoentPath.face + "face_{0}.png' width='{1}%' height='{1}%' />", index, scale);
            //     else
            //         return StringU.substitute("<img src='" + CompoentPath.face + "face_{0}.png'/>", index);
            // });
            //定制玩家标签
            result = result.replace(new RegExp(this.LABEL_PLAYER, "gm"), (word: string) => {
                word = word.substring(3, word.length - 4);
                word = getMainPlayerName(word)
                return StringU.substitute("<span style='color:#06ee00'>{0}</span>", word);
            });

            //定制数字标签
            result = result.replace(new RegExp(this.LABEL_NUM, "gm"), (word: string) => {
                word = word.substring(3, word.length - 4);
                word = this.getPointBackNum(parseFloat(word), 2).toString()
                return StringU.substitute("<span style='color:#ffd666'>{0}</span>", word);
            });

            //定制地图标签
            result = result.replace(new RegExp(this.LABEL_MAP, "gm"), (word: string) => {
                word = word.substring(3, word.length - 4);
                return StringU.substitute("<span style='color:#00ffff'>{0}</span>",  PageDef.getNameById(word));
            });
            //定制前往标签
            let id = -1;
            result = result.replace(new RegExp(this.LABEL_GOTO, "gm"), (word: string) => {
                id = parseInt(word.substring(3, word.length - 4));
                return "";
            });
            let tele: string = "";
            result = result.replace(new RegExp(this.LABEL_TELE, "gm"), (word: string) => {
                tele = word.substring(3, word.length - 4);
                return "";
            });
            let guid: string = "";
            result = result.replace(new RegExp(this.LABEL_GUID, "gm"), (word: string) => {
                guid = word.substring(3, word.length - 4);
                return "";
            });
            //加入队伍
            let groupId: string = "";
            result = result.replace(new RegExp(this.LABEL_JOIN, "gm"), (word: string) => {
                groupId = word.substring(3, word.length - 4);
                return "";
            });
            return { msg: result, id: id, tele: tele, guid: guid, groupId: groupId };
        }

        // private static _faceWrods: string[];
        // //获取表情替换符列表
        // public static getFaceWords(): string[] {
        //     if (!this._faceWrods) {
        //         this._faceWrods = [];
        //         let temps: any[] = Template.data["tb_expression"];
        //         let len = temps.length;
        //         for (let i: number = 0; i < len; i++) {
        //             this._faceWrods.push(temps[i].word);
        //         }
        //     }
        //     return this._faceWrods;
        // }

        //广播文本转HTML
        public static getBroadcastText(str: string): string {
            //解析字符串
            let result = str;
            //玩家名字
            result = result.replace(new RegExp('\\[p (.+?)\\]', "gm"), (word: string) => {
                word = word.substring(3, word.length - 1);
                return StringU.substitute("<span style='color:#06ee00'>{0}</span>", EnumToString.getPlayerName(word, true));
            });
            //物品或者信息
            result = result.replace(new RegExp('\\[i (.+?)\\]', "gm"), "<span style='color:#ffff00'>$1</span>");
            return result;
        }

        //物品模板描述规则
        static getItemDesc(str: string): string {
            //解析字符串
            let result = str;
            //行
            result = result.replace(new RegExp('\\[p\\](.+?)\\[/p\\]', "gm"), "<span>$1</span><br/>");
            //字体颜色
            result = result.replace(new RegExp('\\[c=(.+?)\\](.+?)\\[/c\\]', "gm"), "<span style='color:$1'>$2</span>");
            return result;
        }


        //名字截取
        public static getPlayerName(name: string, isServerID: boolean = false): string {
            if (!name || !name.length) return name;
            let result = "";
            let index = name.indexOf('_');
            if (index != -1) {
                result = name.substring(index + 1, name.length);
            } else
                result = name;

            if (isServerID) {
                if (result.indexOf(',') != -1) {
                    result = "s" + result;
                    result = result.replace(',', '.');
                }
                return EnumToString.getLimitStr(result, 10);
            }
            else {
                if (result.indexOf(',') != -1)
                    result = result.split(',')[1];
                return EnumToString.getLimitStr(result, 10);;
            }
        }

        /**
		 * 获取限定长度文本
		 * @param text 原文本 
		 * @param limit 限制长度
		 */
        public static getLimitStr(text: string, limit: number): string {
            if (!text) return "";
            let len: number = 0;
            let strArr: string[] = [];
            for (let i = 0; i < text.length; i++) {
                len++;
                if (len <= limit) strArr[strArr.length] = text.charAt(i);
                else {
                    text = strArr[strArr.length - 1];
                    strArr[strArr.length - 1] = "...";
                    return strArr.join("");
                }
            }
            return text;
        }


        //玩家guid 去掉前缀
        public static getPlayerGuid(guid: string): string {
            if (!guid || !guid.length) return guid;

            return guid.replace(GlobalDef.TYPE_PLAYER + ".", "");
        }

        //数字简写 
        public static sampleNum(num: number): string {
            if (num <= 99999) return num.toString();
            num = Math.floor(num / 10000);
            if (num <= 99999) return num + "万";
            num = Math.floor(num / 10000);
            return num + "亿";
        }

        //筹码数字简写 
        public static sampleChipNum(num: number): string {
            if (num < 1000) return num.toString();
            num = Math.floor(num / 1000);
            return num + "k";
        }

        /**
         * 保留指定位数小数点，没有的时候取整
         * @param num 
         * @param need 需要保留的位数
         */
        public static getPointBackNum(num: number, need: number): number {
            let strNum = String(num);
            let numN;
            if (strNum.indexOf(".") >= 0) {
                numN = parseFloat(num.toFixed(need));
            } else {
                numN = num;
            }
            return numN;
        }

    }
}