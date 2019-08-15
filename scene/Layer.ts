/**
* 捕鱼数据管理器
*/
module gamecomponent.scene {
    export class Layer extends Laya.Sprite {

        constructor(mouseEnabled: boolean = false, alpha: number = 1, blendMode: string = null) {
            super();
            this.mouseEnabled = mouseEnabled;
            this.alpha = alpha;
            this.blendMode = blendMode;
        }
    }
}
