/**显示对象工具
* name 
*/
module utils {
	import Component = laya.ui.Component;
	export class DisplayU {

		/**设置鼠标事件*/
		public static setMouseListener(target: EventDispatcher, isAdd: boolean, caller: any, funClick: Function, funOver: Function = null, funOut: Function = null): void {
			if (target == null) {
				logd("this EventDispatcher is null");
				return;
			}
			if (caller == null || (funClick == null && funOver == null && funOut == null)) return;
			if (isAdd) {
				if (funClick != null) target.on(LEvent.CLICK, caller, funClick);
				if (funOver != null) target.on(LEvent.CLICK, caller, funOver);
				if (funOut != null) target.on(LEvent.CLICK, caller, funOut);
			} else {
				if (funClick != null) target.off(LEvent.CLICK, caller, funClick);
				if (funOver != null) target.off(LEvent.CLICK, caller, funOver);
				if (funOut != null) target.off(LEvent.CLICK, caller, funOut);
			}
		}
		/**设置显示对象事件*/
		public static setEventListener(target: EventDispatcher, isAdd: boolean, type: string, caller: any, listener: Function): void {
			if (target == null) {
				logd("this EventDispatcher is null");
				return;
			}
			if (caller == null || listener == null) return;
			if (isAdd) target.on(type, caller, listener);
			else target.off(type, caller, listener);
		}
		/**
		 * 设置组件属性
		 * @param comp 组件
		 * @param props {postion:Vector2,x:0,y:0,width:0,height:0,alpha:1,scale:1,scaleX:1,scaleY:1,anchor:0,anchorX:0,anchorY:0,center:NaN,centerX:NaN,centerY:NaN,parent:null}
		 */
		public static setCompAttr(comp: Component, props: any): void {
			if (!props) return;
			if (props.hasOwnProperty("postion")) comp.pos(props.postion.x, props.postion.y);//位置
			if (props.hasOwnProperty("x")) comp.x = props.x;//位置x
			if (props.hasOwnProperty("y")) comp.y = props.y;//位置y
			if (props.hasOwnProperty("width")) comp.width = props.width;//宽度
			if (props.hasOwnProperty("height")) comp.height = props.height;//高度
			if (props.hasOwnProperty("alpha")) comp.alpha = props.alpha;//透明度
			if (props.hasOwnProperty("scale")) comp.scale(props.scale, props.scale);//缩放
			if (props.hasOwnProperty("scaleX")) comp.scaleX = props.scaleX;//缩放x
			if (props.hasOwnProperty("scaleY")) comp.scaleY = props.scaleY;//缩放y
			if (props.hasOwnProperty("anchor")) comp.anchorX = comp.anchorY = props.anchor;//锚点
			if (props.hasOwnProperty("anchorX")) comp.anchorX = props.anchorX;//锚点x
			if (props.hasOwnProperty("anchorY")) comp.anchorY = props.anchorY;//锚点y
			if (props.hasOwnProperty("center")) comp.centerX = comp.centerY = props.center;//中心线距离
			if (props.hasOwnProperty("centerX")) comp.centerX = props.centerX;//中心线距离x
			if (props.hasOwnProperty("centerY")) comp.centerY = props.centerY;//中心线距离y
			if (props.hasOwnProperty("parent")) {//父级
				if (!props.hasOwnProperty("index")) props.parent.addChild(comp);//深度
				else props.parent.addChildAt(comp, props.index);
			}
		}

		/*============================垂直滚动条遮罩相关================================*/
		public static MASK_TYPE_NULL: number = 0;	//清理遮罩
		public static MASK_TYPE_RESET: number = 1;	//重置遮罩(初始化或数据变化)
		public static MASK_TYPE_NORMAL: number = 2;	//更新遮罩
		private static MASK_KIND_NULL: number = 0;	//空遮罩
		private static MASK_KIND_ALL: number = 1;	//全遮罩
		private static MASK_KIND_TOP: number = 2;	//上遮罩
		private static MASK_KIND_BOTTOM: number = 3;	//下遮罩
		private static MASK_KIND_MIDDLE: number = 4;	//中遮罩
		private static MASK_KIND_LEFT: number = 5;	//左遮罩
		private static MASK_KIND_RIGHT: number = 6;	//右遮罩
		private static MASK_WIDTH: number = 56;	//遮罩图片宽度
		private static MASK_HEIGHT: number = 56;	//遮罩图片高度
		private static MASK_IMG_TOP: LImage;		//上遮罩图片
		private static MASK_IMG_BOTTOM: LImage;	//下遮罩图片
		private static MASK_IMG_MIDDLE: LImage;	//中遮罩图片
		private static MASK_IMG_LEFT: LImage;	//左遮罩图片
		private static MASK_IMG_RIGHT: LImage;	//右遮罩图片
		private static MASK_DICT: Laya.Dictionary;//遮罩词典
		/**初始化遮罩信息*/
		public static initMask(): void {
			DisplayU.MASK_IMG_TOP = new LImage(CompoentPath.ui + "tongyong/image_mask_top.png");
			DisplayU.MASK_IMG_BOTTOM = new LImage(CompoentPath.ui + "tongyong/image_mask_bottom.png");
			DisplayU.MASK_IMG_MIDDLE = new LImage(CompoentPath.ui + "tongyong/image_mask_middle.png");
			DisplayU.MASK_IMG_LEFT = new LImage(CompoentPath.ui + "tongyong/image_mask_left.png");
			DisplayU.MASK_IMG_RIGHT = new LImage(CompoentPath.ui + "tongyong/image_mask_right.png");
			DisplayU.MASK_DICT = new Laya.Dictionary();
		}
		/**
		 * 垂直滚动条遮罩更新
		 * @param target 遮罩对象
		 * @param type 操作类型：默认(DisplayU.MASK_TYPE_NORMAL)
		 */
		public static onScrollChange(target: any, type: number = DisplayU.MASK_TYPE_NORMAL): void {
			if (!target) return;
			if (!DisplayU.MASK_DICT) DisplayU.initMask();
			if (type == DisplayU.MASK_TYPE_NULL) {
				this.drawMaskByType(target, DisplayU.MASK_KIND_NULL);
				return;
			}
			let scroll: laya.ui.ScrollBar;
			if (target instanceof Laya.List) scroll = target.scrollBar;
			else if (target instanceof Laya.Panel) scroll = target.vScrollBar;
			if (!scroll || !scroll.isVertical) return;
			if (scroll.min == scroll.max) {//不足一屏
				if (type == DisplayU.MASK_TYPE_RESET) this.drawMaskByType(target, DisplayU.MASK_KIND_ALL);
				return;
			}
			if (scroll.value <= scroll.min) this.drawMaskByType(target, DisplayU.MASK_KIND_TOP);//上边
			else if (scroll.value >= scroll.max) this.drawMaskByType(target, DisplayU.MASK_KIND_BOTTOM);//下边
			else this.drawMaskByType(target, DisplayU.MASK_KIND_MIDDLE);//中间
		}
		/**
		 * 通过类型绘制遮罩
		 * @param target 遮罩对象
		 * @param kind 绘制类别：默认(DisplayU.MASK_KIND_ALL)
		 */
		private static drawMaskByType(target: any, kind: number = DisplayU.MASK_KIND_ALL): void {
			if (!target) return;
			let key: string = target.$_GID.toString();
			if (kind == DisplayU.MASK_KIND_NULL) {
				if (target.parent && target.parent.mask) target.parent.mask = null;
				if (DisplayU.MASK_DICT[key]) delete DisplayU.MASK_DICT[key];
				return;
			}
			if (DisplayU.MASK_DICT[key] && DisplayU.MASK_DICT[key].kind == kind) return;
			let mask: Sprite;
			if (!DisplayU.MASK_DICT[key]) {
				mask = new Sprite();
				mask.pos(target.x, target.y);
				mask.size(target.width, target.height);
				target.parent.mask = mask;
				DisplayU.MASK_DICT[key] = { mask: mask };
			} else mask = DisplayU.MASK_DICT[key].mask;
			let height: number = DisplayU.MASK_HEIGHT;
			let graphics: Graphics = mask.graphics;
			graphics.clear();
			switch (kind) {
				case DisplayU.MASK_KIND_ALL://全遮罩:不足一屏
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, 0, mask.width, mask.height, "repeat");
					break;
				case DisplayU.MASK_KIND_TOP://上边
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, 0, mask.width, mask.height - height, "repeat");
					graphics.fillTexture(DisplayU.MASK_IMG_BOTTOM.source, 0, mask.height - height, mask.width, height, "repeat-x");
					break;
				case DisplayU.MASK_KIND_BOTTOM://下边
					graphics.fillTexture(DisplayU.MASK_IMG_TOP.source, 0, 0, mask.width, height, "repeat-x");
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, height, mask.width, mask.height - height, "repeat");
					break;
				case DisplayU.MASK_KIND_MIDDLE://中间
					graphics.fillTexture(DisplayU.MASK_IMG_TOP.source, 0, 0, mask.width, height, "repeat-x");
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, height, mask.width, mask.height - 2 * height, "repeat");
					graphics.fillTexture(DisplayU.MASK_IMG_BOTTOM.source, 0, mask.height - height, mask.width, height, "repeat-x");
					break;
			}
			DisplayU.MASK_DICT[key].kind = kind;
		}
		/**
		 * 水平滚动条遮罩更新
		 * @param target 遮罩对象
		 * @param type 操作类型：默认(DisplayU.MASK_TYPE_NORMAL)
		 */
		public static onHScrollChange(target: any, type: number = DisplayU.MASK_TYPE_NORMAL): void {
			if (!target) return;
			if (!DisplayU.MASK_DICT) DisplayU.initMask();
			if (type == DisplayU.MASK_TYPE_NULL) {
				this.drawHMaskByType(target, DisplayU.MASK_KIND_NULL);
				return;
			}
			let scroll: laya.ui.ScrollBar;
			if (target instanceof Laya.List) scroll = target.scrollBar;
			else if (target instanceof Laya.Panel) scroll = target.hScrollBar;
			if (!scroll || scroll.isVertical) return;
			if (scroll.min == scroll.max) {//不足一屏
				if (type == DisplayU.MASK_TYPE_RESET) this.drawHMaskByType(target, DisplayU.MASK_KIND_ALL);
				return;
			}
			if (scroll.value <= scroll.min) this.drawHMaskByType(target, DisplayU.MASK_KIND_LEFT);//左边
			else if (scroll.value >= scroll.max) this.drawHMaskByType(target, DisplayU.MASK_KIND_RIGHT);//右边
			else this.drawHMaskByType(target, DisplayU.MASK_KIND_MIDDLE);//中间
		}
		/**
		 * 通过类型绘制遮罩
		 * @param target 遮罩对象
		 * @param kind 绘制类别：默认(DisplayU.MASK_KIND_ALL)
		 */
		private static drawHMaskByType(target: any, kind: number = DisplayU.MASK_KIND_ALL): void {
			if (!target) return;
			let key: string = target.$_GID.toString();
			if (kind == DisplayU.MASK_KIND_NULL) {
				if (target.parent && target.parent.mask) target.parent.mask = null;
				if (DisplayU.MASK_DICT[key]) delete DisplayU.MASK_DICT[key];
				return;
			}
			if (DisplayU.MASK_DICT[key] && DisplayU.MASK_DICT[key].kind == kind) return;
			let mask: Sprite;
			if (!DisplayU.MASK_DICT[key]) {
				mask = new Sprite();
				mask.pos(target.x, target.y);
				mask.size(target.width, target.height);
				target.parent.mask = mask;
				DisplayU.MASK_DICT[key] = { mask: mask };
			} else mask = DisplayU.MASK_DICT[key].mask;
			let width: number = DisplayU.MASK_WIDTH;
			let graphics: Graphics = mask.graphics;
			graphics.clear();
			switch (kind) {
				case DisplayU.MASK_KIND_ALL://全遮罩:不足一屏
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, 0, mask.width, mask.height, "repeat");
					break;
				case DisplayU.MASK_KIND_LEFT://左边
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, 0, 0, mask.width - width, mask.height, "repeat");
					graphics.fillTexture(DisplayU.MASK_IMG_RIGHT.source, mask.width - width, 0, width, mask.height, "repeat-y");
					break;
				case DisplayU.MASK_KIND_RIGHT://右边
					graphics.fillTexture(DisplayU.MASK_IMG_LEFT.source, 0, 0, width, mask.height, "repeat-y");
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, width, 0, mask.width - width, mask.height, "repeat");
					break;
				case DisplayU.MASK_KIND_MIDDLE://中间
					graphics.fillTexture(DisplayU.MASK_IMG_LEFT.source, 0, 0, width, mask.height, "repeat-y");
					graphics.fillTexture(DisplayU.MASK_IMG_MIDDLE.source, width, 0, mask.width - 2 * width, mask.height, "repeat");
					graphics.fillTexture(DisplayU.MASK_IMG_RIGHT.source, mask.width - width, 0, width, mask.height, "repeat-y");
					break;
			}
			DisplayU.MASK_DICT[key].kind = kind;
		}
	}
}