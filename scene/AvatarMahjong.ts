/**
* name 
*/
module gamecomponent.scene {
	export class AvatarMahjong extends AvatarBase {
		private _value: number;
		get card() {
			return this._baseData as  gamecomponent.object.PlayingMahjong;
		}
		constructor(g: Game, v: gamecomponent.object.PlayingMahjong) {
			super(g);
			this._baseData = v;
			this.texture_url = CompoentPath.custom_atlas_scene + 'mahjong.atlas';
		}

		update(diff: number): void {
			super.update(diff);
			if (!this._baseData) return;
			this.scale = this._baseData.size;
			this._scaleX = this._baseData.scaleX * this._scale;
			this._scaleY = this._baseData.scaleY * this._scale;
			this._pos.x = this._baseData.pos.x;
			this._pos.y = this._baseData.pos.y;
			this._skew_x = this._baseData.skew_x;
			this._skew_y = this._baseData.skew_y;
			this._rotateAngle = this._baseData.rotateAngle;
			this._sortScore = this._baseData.sortScore;
			this._disable = this._baseData.disable;
			this.visible = this._baseData.visible;
			this._value = this.card.GetCardVal();
		}

		onDraw(diff: number, bg: Graphics, scene: SceneRoot): void {
			this._texture = this.card.isShow ? this._textures["gang_" + this._value] : this._textures["gang_0"];
			if (!this._texture) {
				return;
			}
			let thitx = this._pos.x - this._drawW * 0.5;
			let thity = this._pos.y - this._drawH * 0.5;

			let drawW = this._drawW * this._scale;
			let drawH = this._drawH * this._scale;

			this._hitArea = [
				thitx, thity,
				thitx + drawW, thity,
				thitx + drawW, thity + drawH,
				thitx, thity + drawH
			];
			super.onDraw(diff, bg, scene);

			// this.drawHitArea(this._hitArea, bg, this.pos.x, this.pos.y, this._drawX, this._drawY);
		}

		clear(checkNow: boolean): void {
			this._baseData = null;
			super.clear(checkNow);
		}
	}
}