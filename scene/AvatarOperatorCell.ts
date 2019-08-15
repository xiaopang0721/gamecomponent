/**
* name 
*/
module gamecomponent.scene {
    export class AvatarOperatorCell extends gamecomponent.scene.AvatarBase implements gamecomponent.object.IMouseHit {
		/**
		 * 鼠标点击命中
		 */
        onMouseClickHit(xMouse: number, yMouse: number): void | boolean {
            if (areaContains(this._hitArea, xMouse, yMouse)) {
                this.setToggle();
                SceneGame.ins.mainScene.event(SceneOperator.AVATAR_MOUSE_CLICK_HIT, this);
                return true;
            }
            return false;
        }

		/**
		 * 鼠标移动命中
		 */
        onMouseAreaMoveHit(): void | boolean {
            if (this._baseData.disable) return false;
            this._baseData.disable = true;
            SceneGame.ins.mainScene.event(SceneOperator.AVATAR_MOUSE_MOVE_HIT, this);
            return true;
        }

		/**
		 * 鼠标弹起命中
		 */
        onMouseAreaUpHit(): void | boolean {
            this.setToggle();
            this._baseData.disable = false;
            SceneGame.ins.mainScene.event(SceneOperator.AVATAR_MOUSE_UP_HIT, this);
        }

        /**
        * 鼠标碰撞检测
        */
        __hitTest_byXY(xMouse: number, yMouse: number): boolean {
            if (areaContains(this._hitArea, xMouse, yMouse)) {
                return true;
            }
            return false;
        }


        /**
         * 鼠标碰撞检测
         */
        __hitTest_byArea(area: Array<number>): boolean {
            let hint = areaContains2(area, this._hitArea);
            return hint;
        }

        protected setToggle() {
            this._baseData.toggle = !this._baseData.toggle;
        }
    }
}