/**
* name 
*/
module gamecomponent.scene {
	export class AvatarPoker extends AvatarOperatorCell {
		private _value: number;
		get card() {
			return this._baseData as gamecomponent.object.PlayingPoker;
		}
		constructor(g: Game, v: gamecomponent.object.PlayingPoker) {
			super(g);
			this._baseData = v;
			this.texture_url = CompoentPath.custom_atlas_scene + 'card.atlas';
		}


		/**
		 * 鼠标移动命中
		 */
		onMouseAreaMoveHit(): void | boolean {
		}

		/**
		 * 鼠标弹起命中
		 */
		onMouseAreaUpHit(): void | boolean {
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
			this._light = this._baseData.light;
			this.visible = this._baseData.visible;
			this._value = this.card.GetVal();
		}


		onDraw(diff: number, bg: Graphics, scene: SceneRoot): void {
			this._texture = this.card.isShow ? this._textures["card_" + this._value] : this._textures["card_0"];
			if (!this._texture) {
				return;
			}
			super.onDraw(diff, bg, scene);
		}

		clear(checkNow: boolean): void {
			this._baseData = null;
			super.clear(checkNow);
		}
	}
}