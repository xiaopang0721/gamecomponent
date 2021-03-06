/**文本样式工具
* name 
*/
module utils{
	export class TeaStyle{
		/*=====文本颜色(格式:COLOR_XXX)=====*/
		public static COLOR_DEFAULT		:string = "#d6f3ff";				//黑色、默认
		public static COLOR_GREEN		:string = "#41fe69";				//绿色、链接
		public static COLOR_RED			:string = "#ff2400";				//红色、提醒
		public static COLOR_GRAY		:string = "#8b8b8b";				//灰色、禁用
		public static COLOR_YELLOW		:string = "#ffff00";				//黄色、进行中
		public static COLOR_BLACK		:string = "#000000";				//纯黑色
		public static COLOR_WHITE		:string = "#ffffff";				//纯白色
		public static COLOR_JIESUAN		:string = "#efffb2";				//结算界面主玩家颜色

		public static COLOR_ROOM_JIESUAN  :string = "#ffc32c";				//房卡结算界面主玩家颜色
		public static COLOR_INPUT_PROMPT :string = "#60594e";				//输入框提示符默认颜色值
		public static COLOR_INPUT_CONTENT :string = "#e9e9fb";				//输入框内容默认颜色值

		/**=品质颜色：白、绿、蓝、紫、橙=*/
		public static COLOR_QUALITYS:string[] = ["#d6f3ff", "#00ff2a", "#00baff", "#ae00ff", "#ffa200","#ff2400"];
		/**
		 * 获取品质颜色
		 * @param quality 
		 */
		public static getQualityColor(quality:number):string{
			if(quality <= 0 || quality > TeaStyle.COLOR_QUALITYS.length) return null;
			return TeaStyle.COLOR_QUALITYS[quality];
		}
	}
}