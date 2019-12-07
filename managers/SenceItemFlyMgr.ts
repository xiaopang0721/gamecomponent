/**
* 场景飞物品管理器
*/
module gamecomponent.managers {
	export class SenceItemFlyMgr extends Laya.EventDispatcher {
		protected _game: Game;
		//数量
		private _num: number = 50;
		set num(v: number) {
			this._num = v
		}
		//创建间隔
		private _creat_time: number = 20;
		set creatTime(v: number) {
			this._creat_time = v
		}
		//飞行时长
		private _fly_time: number = 2000;
		set flyTime(v: number) {
			this._fly_time = v;
		}
		//资源
		private _asset_url: string = "tongyong_ui/game_ui/tongyong/general/icon_money.png";
		set assetUrl(v: string) {
			this._asset_url = v
		}
		//贴图加载器
		private _refAsset: RefAsset;
		//对象数组
		private _goldArr: Array<GlodItem> = []
		constructor(v?: Game) {
			super();
			this._game = v || main.game;
		}

		//初始化
		init(stratX: number, stratY: number, endX: number, endY: number) {
			//资源加载
			if (!this._refAsset) {
				this._refAsset = RefAsset.Get(this._asset_url)
				this._refAsset.retain();
			}
			let refAsset = this._refAsset;
			if (!refAsset.parseComplete) {
				refAsset.once(LEvent.COMPLETE, this, () => {
					this.onStart(stratX,stratY,endX,endY);
				});
			} else {
				this.onStart(stratX,stratY,endX,endY);
			}
		}


		//开始动画
		private onStart(stratX: number, stratY: number, endX: number, endY: number): void {
			for (let i: number = 0; i < this._num; i++) {
				Laya.timer.once(this._creat_time * i, this, () => {
					let startVec = new Vector2(stratX, stratY);
					let endVec = new Vector2(MathU.randomRange(endX, endX + 65), MathU.randomRange(endY, endY + 65));
					let glodcell = GlodItem.create(startVec, endVec, this._asset_url, this._fly_time);
					this._goldArr.push(glodcell);
				})
			}
		}

		update(diff: number) {
			this._game.uiRoot.top.graphics.clear();
			for (let index = 0; index < this._goldArr.length; index++) {
				let glodcell = this._goldArr[index];
				if (glodcell.isDestroy) {
					this._goldArr.splice(index, 1);
					ObjectPools.free(glodcell);
					index--;
				} else {
					glodcell.onDraw(diff, this._game.uiRoot.top.graphics);
				}
			}
		}

		/**
		 * 帧间隔心跳
		 */
		deltaUpdate() {

		}

		clear(fource?: boolean) {
			Laya.timer.clearAll(this);
			Laya.Tween.clearAll(this);
			if (this._refAsset) {
				this._refAsset.offAll();
				this._refAsset.release(true);
				this._refAsset = null;
			}
		}
	}

	class GlodItem implements IPoolsObject {
		isDestroy: boolean = false;
		poolName: string = "GlodItem";
		//当前资源贴图
		private _curTexture: Texture;
		//起始位置
		private _stratVec: Vector2;
		//结束位置
		private _endVec: Vector2;
		//当前位置
		private _curPos: Vector2;
		//当前缩放
		private _curScale: number = 1;
		//当前角度
		private _curRotation: number = 0;
		//持续时间
		private _fly_time: number;
		//插值数量
		private _inset_count: number = 25;
		//位置數組
		private _posTemp: Array<number>;
		//下标位
		private _index: number;
		/**
         * 进池 （相当于对象dispose函数）
         */
		intoPool(...arg: any[]): void {
			this.dispose();
		}
        /**
         * 出池 （相当于对象初始化函数）
         */
		outPool(...arg: any[]): void {

		}

		static create(startVec: Vector2, endVec: Vector2, asset_url: string, fly_time: number): GlodItem {
			let obj = ObjectPools.malloc(GlodItem) as GlodItem;
			obj.create(startVec, endVec, asset_url, fly_time);
			return obj;
		}

		private create(startVec: Vector2, endVec: Vector2, asset_url: string, fly_time: number) {
			this.isDestroy = false;
			this._curPos = this._stratVec = startVec;
			this._endVec = this._endVec;
			this._curTexture = Loader.getRes(asset_url);
			this._fly_time = fly_time;
			//贝塞尔曲线，求出多点坐标
			let rand_num = MathU.randomRange(-60, 60);
			let middleX = (startVec.x + endVec.x) / 2;
			let middleY = endVec.y / 2;
			let middleVec = new Vector2(MathU.randomRange(middleX, middleX + rand_num), MathU.randomRange(middleY, middleY + rand_num))
			let curves = [startVec.x, startVec.y, middleVec.x, middleVec.y, endVec.x, endVec.y]
			this._posTemp = Laya.Bezier.I.getBezierPoints(curves, this._inset_count);
			this._index = 0;
		}

		onDraw(diff: number, g: Graphics) {
			if (!this.isDestroy)
				this.updateRotation();
			else
				this.isDestroy = true;
			let texture = this._curTexture;
			if (!texture) return;
			let tw: number = texture.sourceWidth;
			let th: number = texture.sourceHeight;
			let matrix = new Laya.Matrix();

			this._curPos.x = this._posTemp[this._index++];
			this._curPos.y = this._posTemp[this._index++]

			this.judgeDestory()

			matrix.tx = -tw / 2;
			matrix.ty = -th / 2;
			matrix.scale(this._curScale, this._curScale);
			matrix.rotate(this._curRotation)
			matrix.tx += Camera.ins.getScenePxByCellX(this._curPos.x);
			matrix.ty += Camera.ins.getScenePxByCellY(this._curPos.y);
			g.drawTexture(texture, 0, 0, tw, th, matrix);
		}

		private updateRotation(): void {

		}

		judgeDestory(): void {
			if (this._index >= this._posTemp.length - 1) {
				this.isDestroy = true;
			}
		}

		//释放
		private dispose() {
			
		}
	}
}