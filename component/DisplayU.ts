/**
* List遮罩
*/
module gamecomponent.component {
	export class DisplayU {
		public static MASK_TYPE_NULL: number = 0;
		public static MASK_TYPE_RESET: number = 1;
		public static MASK_TYPE_NORMAL: number = 2;

		//滚动位置
		private static MASK_KIND_NULL: number = 0;
		private static MASK_KIND_ALL: number = 1;
		private static MASK_KIND_TOP: number = 2;
		private static MASK_KIND_BOTTOM: number = 3;
		private static MASK_KIND_MIDDLE: number = 4;
		private static MASK_KIND_LEFT: number = 5;
		private static MASK_KIND_RIGHT: number = 6;

		//资源大小
		private static MASK_HEIGHT: number = 50;
		private static MASK_WIDHT: number = 50;
		//遮罩资源
		private static MASK_IMG_TOP: LImage;
		private static MASK_IMG_BOTTOM: LImage;
		private static MASK_IMG_MIDDLE: LImage;
		private static MASK_IMG_LEFT: LImage;
		private static MASK_IMG_RIGHT: LImage;

		private static MASK_DICT: Object;
		/**横向滑动 */
		public static SLIDE_V: number = 1;
		/**竖向滑动 */
		public static SLIDE_H: number = 2;
		private static initMask() {
			this.MASK_IMG_TOP = new LImage("dating_ui/tongyong/mask_top.png");
			this.MASK_IMG_BOTTOM = new LImage("dating_ui/tongyong/mask_bottom.png");
			this.MASK_IMG_MIDDLE = new LImage("dating_ui/tongyong/mask_middle.png");
			this.MASK_IMG_LEFT = new LImage("dating_ui/tongyong/mask_left.png");
			this.MASK_IMG_RIGHT = new LImage("dating_ui/tongyong/mask_right.png");
			this.MASK_DICT = new Object();
		}


		public static onScrollChange(target: any, type: number = this.MASK_TYPE_NORMAL, slideType: number = DisplayU.SLIDE_H): void {
			if (!target) return;
			if (!this.MASK_DICT) this.initMask();
			if (type == this.MASK_TYPE_NULL) {
				this.drawMaskByType(target, this.MASK_TYPE_NULL, slideType); return;
			}
			let scroll: laya.ui.ScrollBar;
			if (target instanceof Laya.List) scroll = target.scrollBar;
			else if (target instanceof Laya.Panel) {
				if (slideType == DisplayU.SLIDE_H) {
					scroll = target.vScrollBar;
				} else if (slideType == DisplayU.SLIDE_V) {
					scroll = target.hScrollBar;
				}
			}
			if (!scroll) return;
			if (scroll.min == scroll.max) {
				if (type == this.MASK_TYPE_RESET) {
					this.drawMaskByType(target, this.MASK_KIND_ALL, slideType);
					return;
				}
			}
			if (scroll.value <= scroll.min) {
				if (slideType == DisplayU.SLIDE_H) {
					this.drawMaskByType(target, this.MASK_KIND_TOP, slideType);
				} else if (slideType == DisplayU.SLIDE_V) {
					this.drawMaskByType(target, this.MASK_KIND_LEFT, slideType);
				}
			} else if (scroll.value >= scroll.max) {
				if (slideType == DisplayU.SLIDE_H) {
					this.drawMaskByType(target, this.MASK_KIND_BOTTOM, slideType);
				} else if (slideType == DisplayU.SLIDE_V) {
					this.drawMaskByType(target, this.MASK_KIND_RIGHT, slideType);
				}
			} else this.drawMaskByType(target, this.MASK_KIND_MIDDLE, slideType)
		}

		private static drawMaskByType(target: any, kind: number = this.MASK_KIND_ALL, slideType: number = DisplayU.SLIDE_H): void {
			if (!target) return;
			let key: string = target.$_GID.toString();
			if (kind == this.MASK_KIND_NULL) {
				if (target.mask) target.mask = null;
				if (this.MASK_DICT[key]) delete this.MASK_DICT[key];
				return;
			}
			if (this.MASK_DICT[key] && this.MASK_DICT[key].kind == kind) return;
			let maskObj: any = this.MASK_DICT[key];
			let mask: Sprite;
			if (!maskObj) {
				mask = new Sprite();
				mask.pos(0, 0);
				mask.size(target.width, target.height);
				this.MASK_DICT[key] = {
					mask: mask,
				};
			} else {
				mask = maskObj.mask;
				mask.width = target.width;
				mask.height = target.height;
			}
			target.mask = mask;
			let height: number = DisplayU.MASK_HEIGHT;
			let width: number = DisplayU.MASK_WIDHT;
			let graphics: Graphics = mask.graphics;
			graphics.clear();
			switch (kind) {
				case this.MASK_KIND_TOP:
					//滚动到位于上部，仅下要遮罩虚化图
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, 0, mask.width, mask.height - height, "repeat");
					graphics.fillTexture(this.MASK_IMG_BOTTOM.source, 0, mask.height - height, mask.width, height, "repeat-x");
					break
				case this.MASK_KIND_BOTTOM:
					//滚动到位于下部，仅上要遮罩虚化图
					graphics.fillTexture(this.MASK_IMG_TOP.source, 0, 0, mask.width, height, "repeat-x");
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, height, mask.width, mask.height - height, "repeat");
					break
				case this.MASK_KIND_MIDDLE:
					//滚动到位于中间，上下都要遮罩虚化图
					if (slideType == DisplayU.SLIDE_H) {
						graphics.fillTexture(this.MASK_IMG_TOP.source, 0, 0, mask.width, height, "repeat-x");
						graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, height, mask.width, mask.height - 2 * height, "repeat");
						graphics.fillTexture(this.MASK_IMG_BOTTOM.source, 0, mask.height - height, mask.width, height, "repeat-x");
					} else if (slideType == DisplayU.SLIDE_V) {
						graphics.fillTexture(this.MASK_IMG_LEFT.source, 0, 0, width, mask.height, "repeat-y");
						graphics.fillTexture(this.MASK_IMG_MIDDLE.source, width, 0, mask.width - 2 * width, mask.height, "repeat");
						graphics.fillTexture(this.MASK_IMG_RIGHT.source, mask.width - width, 0, width, mask.height, "repeat-y");
					}
					break
				case this.MASK_KIND_LEFT:
					//滚动到位于左侧，中间右侧都要遮罩虚化图
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, 0, mask.width - width, mask.height, "repeat");
					graphics.fillTexture(this.MASK_IMG_RIGHT.source, mask.width - width, 0, width, mask.height, "repeat-y");
					break
				case this.MASK_KIND_RIGHT:
					//滚动到位于右侧，中间左侧都要遮罩虚化图
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, width, 0, mask.width, mask.height, "repeat");
					graphics.fillTexture(this.MASK_IMG_LEFT.source, 0, 0, width, mask.height, "repeat-y");
					break
				case this.MASK_KIND_ALL:
					//全不虚化
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, 0, mask.width, mask.height, "repeat");
					break
			}
		}
	}
}