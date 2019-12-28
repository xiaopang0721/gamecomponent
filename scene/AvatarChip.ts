/**
* name 筹码
*/
module gamecomponent.scene {
	export class AvatarChip extends AvatarBase {
		private _valueStr: string;
		private _type: number;
		get clip() {
			return this._baseData as gamecomponent.object.PlayingChip;
		}
		constructor(g: Game, v: gamecomponent.object.PlayingChip) {
			super(g);
			this._baseData = v;
			this.texture_url = CompoentPath.custom_atlas_scene + 'chip.atlas';
		}

		update(diff: number): void {
			super.update(diff);
			if (!this._baseData) return;
			this.scale = this._baseData.size;
			this._scaleX = this._baseData.scaleX * this._scale;
			this._scaleY = this._baseData.scaleY * this._scale;
			this._pos.x = this._baseData.pos.x;
			this._pos.y = this._baseData.pos.y;
			this._rotateAngle = this._baseData.rotateAngle;
			this._sortScore = this._baseData.sortScore;
			this.visible = this._baseData.visible;
			this._valueStr = this.clip.GetCardVal();
			this._type = this.clip.GetCardType();
		}


		onDraw(diff: number, bg: Graphics, scene: SceneRoot): void {
			this._texture = this._textures["cm_" + this._type];
			if (!this._texture) {
				return;
			}

			super.onDraw(diff, bg, scene);

			//处理筹码数字
			this.onDrawSZ(diff, bg, scene);

			// let thitx = this._pos.x - this._drawW * 0.5;
			// let thity = this._pos.y - this._drawH * 0.5;

			// let drawW = this._drawW * this._scale;
			// let drawH = this._drawH * this._scale;

			// this._hitArea = [
			// 	thitx, thity,
			// 	thitx + drawW, thity,
			// 	thitx + drawW, thity + drawH,
			// 	thitx, thity + drawH
			// ];

			// this.drawHitArea(this._hitArea, bg, this.pos.x, this.pos.y, this._drawX, this._drawY);
		}

		private onDrawSZ(diff: number, bg: Graphics, scene: SceneRoot): void {
			if (!this._valueStr) return;
			let value_str = this._valueStr.toString();//字符化
			let value_num = parseInt(value_str);
			if (value_num >= 1000 && value_num % 1000 == 0) {
				value_str = value_num / 1000 + "k";
			}
			let len = value_str.length;//取字符串长度
			let c_inx = (len - 1) * 0.5;//获取相对位置
			let scale = value_str.length == 1 ? 1.2 : (value_str.length == 2 ? 1.1 : 1.0)
			if (value_str.indexOf("k") >= 2) {
				scale = 0.9;
			}
			for (let index = 0; index < len; index++) {
				let str = value_str.charAt(index);
				let texture = this._textures["sz_" + str];
				if (!texture) continue;
				let drawW = texture.sourceWidth * scale;
				let drawH = texture.sourceHeight * scale;
				let w = drawW;
				let h = drawH;
				let halfw = w / 2;
				let halfh = h / 2;
				let matrix = new Laya.Matrix();
				matrix.tx = - halfw;
				matrix.ty = - halfh;
				matrix.scale(this._scaleX, this._scaleY);
				matrix.rotate(this._rotateAngle);
				matrix.skew(this._skew_x, this._skew_y);
				matrix.tx += this._drawX;
				matrix.ty += this._drawY;
				matrix.ty -= 3;
				bg.drawTexture(texture, (index - c_inx) * drawW, 0, drawW, drawH, matrix, this._alpha);
			}
		}



		clear(checkNow: boolean): void {
			this._baseData = null;
			super.clear(checkNow);
		}
	}
}