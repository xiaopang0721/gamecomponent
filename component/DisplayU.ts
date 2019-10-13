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

		private static MASK_HEIGHT: number = 50;
		private static MASK_WIDHT: number = 50;
		//遮罩资源
		private static MASK_IMG_TOP: LImage;
		private static MASK_IMG_BOTTOM: LImage;
		private static MASK_IMG_MIDDLE: LImage;
		private static MASK_IMG_LEFT: LImage;
		private static MASK_IMG_RIGHT: LImage;

		private static MASK_DICT: Object;
		private static initMask() {
			this.MASK_IMG_TOP = new LImage(DatingPath.ui_dating_tongyong + "mask_top.png");
			this.MASK_IMG_BOTTOM = new LImage(DatingPath.ui_dating_tongyong + "mask_bottom.png");
			this.MASK_IMG_MIDDLE = new LImage(DatingPath.ui_dating_tongyong + "mask_middle.png");
			this.MASK_IMG_LEFT = new LImage(DatingPath.ui_dating_tongyong + "mask_left.png");
			this.MASK_IMG_RIGHT = new LImage(DatingPath.ui_dating_tongyong + "mask_right.png");
			this.MASK_DICT = new Object();
		}

		public static onScrollChange(target: any, type: number = this.MASK_TYPE_NORMAL): void {
			if (!target) return;
			if (!this.MASK_DICT) this.initMask();
			if (type == this.MASK_TYPE_NULL) {
				this.drawMaskByType(target, this.MASK_TYPE_NULL); return;
			}
			let scroll: laya.ui.ScrollBar;
			if (target instanceof Laya.List) scroll = target.scrollBar;
			else if (target instanceof Laya.Panel) scroll = target.vScrollBar;
			if (!scroll || !scroll.isVertical) return;
			if (scroll.min == scroll.max) {
				if (type == this.MASK_TYPE_RESET) {
					this.drawMaskByType(target, this.MASK_KIND_ALL);
					return;
				}
			}
			if (scroll.value <= scroll.min) {
				this.drawMaskByType(target, this.MASK_KIND_TOP);
			} else if (scroll.value >= scroll.max) {
				this.drawMaskByType(target, this.MASK_KIND_BOTTOM);
			} else this.drawMaskByType(target, this.MASK_KIND_MIDDLE)
		}

		private static drawMaskByType(target: any, kind: number = this.MASK_KIND_ALL): void {
			if (!target) return;
			let key: string = target.$_GID.tostring();
			if (kind == this.MASK_KIND_NULL) {
				if (target.parent.mask) target.parent.mask = null;
				if (this.MASK_DICT[key]) delete this.MASK_DICT[key];
				return;
			}
			if (this.MASK_DICT[key] && this.MASK_DICT[key].kind == kind) return;
			let mask: Sprite;
			if (!this.MASK_DICT[key]) {
				mask = new Sprite();
				mask.pos(target.x, target.y);
				mask.size(target.width, target.height);
				target.parent.mask = mask;
				this.MASK_DICT[key] = { mask: mask };
			} else mask = this.MASK_DICT[key].mask;
			let height: number = this.MASK_DICT[key];
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
					graphics.fillTexture(this.MASK_IMG_TOP.source, 0, 0, mask.width, height, "repeat-x");
					graphics.fillTexture(this.MASK_IMG_MIDDLE.source, 0, height, mask.width, mask.height - 2 * height, "repeat");
					graphics.fillTexture(this.MASK_IMG_BOTTOM.source, 0, mask.height - height, mask.width, height, "repeat-x");
					break
			}
		}
	}
}