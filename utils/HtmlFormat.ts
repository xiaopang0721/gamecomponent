/** html格式及拼接方式
* name 
*/
module utils{
	export class HtmlFormat{
		/*========================================HTML相关============================================*/
		/*=====HTML模板(格式:HTML_XXX)=====*/
		public static HTML_COLOR		:string = "<span style='color:{1}'>{0}</span>";			//着色	
		public static HTML_SIZE			:string = "<font style='font-size:{1}px'>{0}</font>";	//字号
		public static HTML_LINK			:string = "<a href='event:{1}'>{0}</a>";				//链接
		public static HTML_IMG			:string = "<img src='{0}' style='width:{1};height:{2}'></img>";	//图片
		public static HTML_B			:string = "<b>{0}</b>";									//加粗
		public static HTML_U			:string = "<u>{0}</u>";									//下划线
		public static HTML_I			:string = "<i>{0}</i>";									//倾斜
		public static HTML_BR			:string = "<br>";										//换行
		public static HTML_SML			:string = "({0})";										//小括号
		public static HTML_MID			:string = "[{0}]";										//中括号
		public static HTML_BIG			:string = "{{0}}";										//大括号
		public static HTML_THK			:string = "【{0}】";									  //厚括号
		public static HTML_ANG			:string = "<{0}>";										//尖括号
		public static HTML_MID_R		:string = "[/{0}]";										//右中括号
		public static HTML_ANG_R		:string = "</{0}>";										//右尖括号
		
		/*=====HTML拼接(格式:addHtmlXXX)=====*/
		/**
		 * 添加简单Html
		 * @param value 内容
		 * @param htmlKing 类型:HTML_B、HTML_U、HTML_I、HTML_SML、HTML_MID、HTML_BIG、HTML_THK、HTML_ANG、HTML_MID_R、HTML_ANG_R
		 * @return 
		 */		
		public static addHtmlSingle(value:string, htmlKing:string):string{
			if(htmlKing == null || htmlKing == "" || htmlKing.indexOf("{0}") == -1) return value;
			return htmlKing.replace("{0}", value);
		}
		/**
		 * 添加颜色
		 * @param value 内容
		 * @param color 颜色
		 * @return 
		 */		
		public static addHtmlColor(value:string, color:string):string{
			if(color == null || color == "") return value;
			return HtmlFormat.HTML_COLOR.replace("{0}",value).replace("{1}",color);
		}
		/**
		 * 添加字号
		 * @param value 内容
		 * @param size 字号
		 * @return 
		 */		
		public static addHtmlSize(value:string, size:number):string{
			if(!size) return value;
			return HtmlFormat.HTML_SIZE.replace("{0}",value).replace("{1}",size+"");
		}
		/**
		 * 添加括号
		 * @param value 内容
		 * @param bracket 括号 0 无,1 小括号,2 中括号,3 大括号,4 厚括号,5 尖括号
		 * @return 
		 */		
		public static addHtmlBracket(value:string, bracket:number):string{
			switch(bracket){
				case 1: value = HtmlFormat.HTML_SML.replace("{0}", value); break;
				case 2: value = HtmlFormat.HTML_MID.replace("{0}", value); break;
				case 3: value = HtmlFormat.HTML_BIG.replace("{0}", value); break;
				case 4: value = HtmlFormat.HTML_THK.replace("{0}", value); break;
				case 5: value = HtmlFormat.HTML_ANG.replace("{0}", value); break;
			}
			return value;
		}
		/**
		 * 添加链接
		 * @param value 内容
		 * @param linkText 链接返回内容
		 * @param color 颜色
		 * @param bracket 括号 0 无,1 小括号,2 中括号,3 大括号,4 厚括号,5 尖括号
		 * @param underline 下划线
		 * @param bold 加粗
		 * @return 
		 */		
		public static addHtmlLink(value:string, linkText:string, color:string = null, bracket:number = 0, underline:Boolean = false, bold:Boolean = false):string{
			if(underline) value = HtmlFormat.addHtmlSingle(value, HtmlFormat.HTML_U);
			if(bold) value = HtmlFormat.addHtmlSingle(value, HtmlFormat.HTML_B);
			if(bracket) value = HtmlFormat.addHtmlBracket(value, bracket);
			if(linkText == null || linkText == "") return value;
			value = HtmlFormat.HTML_LINK.replace("{0}",value).replace("{1}",linkText);
			if(color == null || color == "") color = TeaStyle.COLOR_GREEN;
			return HtmlFormat.addHtmlColor(value, color);
		}
		/**
		 * 添加html文本
		 * @param value 内容
		 * @param color 颜色
		 * @param bracket 括号 0 无,1 小括号,2 中括号,3 大括号,4 厚括号,5 尖括号
		 * @param underline 下划线
		 * @param bold 加粗
		 * @return 
		 */
		public static addHtmlText(value:string, color:string, bracket:number = 0, underline:Boolean = false, bold:Boolean = false):string{
			if(underline) value = HtmlFormat.addHtmlSingle(value, HtmlFormat.HTML_U);
			if(bold) value = HtmlFormat.addHtmlSingle(value, HtmlFormat.HTML_B);
			if(bracket) value = HtmlFormat.addHtmlBracket(value, bracket);
			if(color == null || color == "") color = TeaStyle.COLOR_DEFAULT;
			return HtmlFormat.addHtmlColor(value, color);
		}
		/**
		 * 添加图片
		 * @param urlImg 图片地址
		 * @param width 宽度
		 * @param height 高度
		 * @return 
		 */		
		public static addHtmlImg(urlImg:string, width:string, height:string):string{
			if(urlImg == null || urlImg == "" || !width || !height) return "";
			return HtmlFormat.HTML_IMG.replace("{0}",urlImg).replace("{1}",width).replace("{2}",height);
		}
	}
}