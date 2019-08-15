/**
* name avatar操作类
*/
module gamecomponent.scene {
	export class AvatarOperator extends gamecomponent.scene.AvatarDrawtor implements gamecomponent.object.IMouseHandle {
		constructor(v: SceneRootBase) {
			super(v)
		}

		/**
		 * 鼠标点击
		 */
		onMouseClick(xMouse: number, yMouse: number): void | boolean {
			let len: number = this._avatars.length;
			for (let i: number = len - 1; i >= 0; i--) {
				let hitAvatar = this._avatars[i];
				if (!(hitAvatar instanceof AvatarOperatorCell)) continue;
				if (!hitAvatar || !hitAvatar.baseData || !hitAvatar.baseData.toggleEnable) continue;
				if (hitAvatar.onMouseClickHit(xMouse, yMouse)) {//自上而下 命中即触发点击
					return;
				}
			}
		}

		/**
		 * 鼠标区域移动
		 */
		onMouseAreaMove(area: Array<number>): void | boolean {
			this.hitTestArea(area, true);
		}

		/**
		 * 鼠标区域弹起
		 */
		onMouseAreaUp(area: Array<number>): void | boolean {
			this.hitTestArea(area);
			this._avatarOperatorList.length = 0;
		}

		//区域碰撞测试
		private hitTestArea(area: Array<number>, isMouseMove?: boolean) {
			let list = [];
			let len: number = this._avatars.length;
			for (let i: number = len - 1; i >= 0; i--) {
				let hitAvatar = this._avatars[i];
				if (!(hitAvatar instanceof AvatarOperatorCell)) continue;
				if (!hitAvatar || !hitAvatar.baseData || !hitAvatar.baseData.toggleEnable) continue;
				if (hitAvatar.__hitTest_byArea(area)) {
					list.push(hitAvatar);
				}
			}

			if (!list.length) {
				isMouseMove && this.clearSellect(list);
				return;
			}

			let pos_list = []
			let x;
			let y;
			for (let i = 0; i < area.length / 2; i++) {
				if (!x) {
					x = area[2 * i];
				} else {
					if (area[2 * i] > x) {
						continue;
					}
					if (area[2 * i] < x) {
						pos_list.length = 0;
					}
				}
				x = area[2 * i];
				y = area[2 * i + 1]
				pos_list.push(x)
				pos_list.push(y)
			}

			let hit_list = []
			let count = 0;
			for (let i: number = len - 1; i >= 0; i--) {
				let hitAvatar = this._avatars[i];
				if (!(hitAvatar instanceof AvatarOperatorCell)) continue;
				for (let j = 0; j < pos_list.length / 2; j++) {
					x = pos_list[2 * j]
					y = pos_list[2 * j + 1]
					if (hitAvatar.__hitTest_byXY(x, y)) {
						count++ > 0 && hit_list.push(hitAvatar);
						break;//进过就break，防止两个点都碰撞
					}
				}
			}

			for (let i = 0; i < hit_list.length; i++) {
				let hitAvatar = hit_list[i];
				let index = list.indexOf(hitAvatar);
				if (index != -1) {
					list.splice(index, 1);
				}
			}

			let count_hit: number = 0
			for (let i = 0; i < list.length; i++) {
				let hitAvatar: AvatarOperatorCell = list[i] as AvatarOperatorCell;
				if (hitAvatar) {
					if (isMouseMove) {
						if (hitAvatar.onMouseAreaMoveHit()) {
							this.collectAvatar(hitAvatar);
						}
					} else {
						hitAvatar.onMouseAreaUpHit();
						count_hit++;
					}
					if (count_hit == list.length) {
						SceneGame.ins.mainScene.event(SceneOperator.AVATAR_MOUSE_UP_HIT_ALL);
					}
				}
			}
			isMouseMove && this.clearSellect(list);
		}

		private _avatarOperatorList: AvatarOperatorCell[] = []
		private collectAvatar(avatar: AvatarOperatorCell) {
			if (this._avatarOperatorList.indexOf(avatar) == -1) {
				this._avatarOperatorList.push(avatar);
			}
		}

		private clearSellect(list: AvatarOperatorCell[] = []) {
			for (let index = 0; index < this._avatarOperatorList.length; index++) {
				let avatar: AvatarOperatorCell = this._avatarOperatorList[index];
				if (avatar && list.indexOf(avatar) == -1) {
					avatar.baseData && (avatar.baseData.disable = false);
					this._avatarOperatorList.splice(index, 1);
				}
			}
		}

	}
}