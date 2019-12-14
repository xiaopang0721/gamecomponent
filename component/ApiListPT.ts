/**
* API平台游戏list组件
*/
module gamecomponent.component {
	import HudMainPage = gamedating.page.HudMainPage;
	export class ApiListPT extends ui.ajqp.dating.component.List_QP_APIUI {
		private _game: Game;
		public page: HudMainPage;
		constructor(game: Game, page: HudMainPage) {
			super();
			this._game = game;
			this.page = page;
			this.init();
		}

		private init(): void {
			this.list_qp.hScrollBarSkin = ""
			this.list_qp.itemRender = QPLB_Item_One
			this.list_qp.renderHandler = new Handler(this, this.renderHandlerQP);
			this.list_qp.dataSource = [1, 2, 3, 4, 5]
		}

		update(diff: number) {
			if (this.list_qp) {
				if (this.list_qp.dataSource) {
					let cells = this.list_qp.cells;
					for (let index = 0; index < cells.length; index++) {
						let element = cells[index] as QPLB_Item_One;
						element && element.update();
					}
				}
			}
		}

		//是否在展示子游戏状态中
		public isShow: boolean = false;
		//是否处于动画中
		public isMoveAni: boolean = false;
		private _moveCellPos: Array<any> = []
		private _moveValue: number = 0;
		private _maxScroll: number = 0;
		public onBtnClick(index): void {
			let cells = this.list_qp.cells;
			if (this.isShow) {
				//找出自己，排除其他，显示列表
				//保存当前滚动的最大值，以及当前的滚动值
				this._maxScroll = this.list_qp.scrollBar.max;
				this._moveValue = this.list_qp.scrollBar.value;
				//滚动条到第一位
				this.list_qp.scrollBar.value = 0;
				let myCell
				cells.forEach(element => {
					let cell = element as QPLB_Item_One;
					if (cell.index == index) {
						//找到自己
						myCell = cell
					}
				})
				//在这个之后都挪走
				cells.forEach(element => {
					this.isMoveAni = true
					let cell = element as QPLB_Item_One
					//保存移动之前的位置
					let obj = {
						index: cell.index,
						x: cell.x
					}
					this._moveCellPos.push(obj);
					if (cell.index != index) {
						//其他的挪走
						let offset_X: number = this._moveValue + this.list_qp.width
						offset_X = cell.index > index ? offset_X : -(offset_X)
						Laya.Tween.to(cell, { x: offset_X, alpha: 0 }, 1000, null, Handler.create(this, () => {
							this.isMoveAni = false
						}))
					} else {
						Laya.Tween.to(myCell, { x: 0 }, 1000, null, Handler.create(this, () => {
							this.isMoveAni = false
						}))
					}
				})
				this.list_qp.scrollBar.touchScrollEnable = false;
			} else {
				cells.forEach(element => {
					this.isMoveAni = true
					let cell = element as QPLB_Item_One
					for (let i = 0; i < this._moveCellPos.length; i++) {
						if (cell.index == this._moveCellPos[i].index) {
							Laya.Tween.to(cell, { x: this._moveCellPos[i].x, alpha: 1 }, 1000, null, Handler.create(this, () => {
								this.isMoveAni = false
							}))
							break
						}
					}
				})
				this.list_qp.scrollBar.value = this._moveValue;
				this._moveCellPos = [];
				this._moveValue = 0;
				this._maxScroll = 0;
				this.list_qp.scrollBar.touchScrollEnable = true;
			}
		}

		private renderHandlerQP(cell: QPLB_Item_One, index: number) {
			cell.setData(this.page, this, index);
		}
	}
	class QPLB_Item_One extends ui.ajqp.dating.component.Hud_Qp_API1UI {
		//有list的时候的宽度
		private _selfWidthList: number;
		//没有list时候的宽度
		private _selfWidth: number;
		public index: number;
		private _page: HudMainPage;
		private _mainView:ApiListPT;
		constructor() {
			super()
			this.panel_pt.hScrollBarSkin = ""
			this.view_pt.list_yx.itemRender = QPLB_Item_Two
			this.view_pt.list_yx.renderHandler = new Handler(this, this.renderHandlerQPYX);
			this.view_pt.list_yx.dataSource = [1, 2, 3, 4, 5, 6, 7, 781, 2, 3, 4, 5, 6, 7, 781, 2, 3, 4, 5, 6, 7, 781, 2, 3, 4, 5, 6, 7, 781, 2, 3, 4, 5, 6, 7, 781, 2, 3, 4, 5, 6, 7, 78]
			this.view_pt.list_yx.repeatX = Math.ceil(this.view_pt.list_yx.dataSource.length / 2)
			this.view_pt.list_yx.width = 225 * this.view_pt.list_yx.repeatX;
			this._selfWidthList = 23 + 332 + 5 + this.view_pt.list_yx.width;
			this._selfWidth = 23 + 332 + 5;
			this.view_pt.list_yx.visible = false;

			this.width = this._selfWidth;
			this.view_pt.width = this.width;
			this.view_pt.btn_box.on(LEvent.CLICK, this, this.onBtnClick);
		}

		private renderHandlerQPYX(cell: QPLB_Item_Two, index: number): void {
			cell.setAlpha = 0;
			cell.setData(index)
		}

		private onBtnClick(): void {
			if (this._mainView.isMoveAni) return;
			console.log("--------", this._mainView.isMoveAni);
			this.view_pt.btn_box.mouseEnabled = false
			this._mainView.isShow = !this._mainView.isShow;
			if (this._mainView.isShow) {
				this.width = this._selfWidthList;
				this.view_pt.width = this.width;
				this.view_pt.list_yx.visible = true;
				this.itemTwoAni()
			} else {
				this.width = this._selfWidth;
				this.view_pt.width = this.width;
				this.itemTwoAni()
			}
			this._mainView.onBtnClick(this.index);
		}

		private itemTwoAni(): void {
			if (this._mainView.isShow) {
				//做个动画
				let i = 0
				this.view_pt.list_yx.cells.forEach(element => {
					this._mainView.isMoveAni = true
					let cell = element as QPLB_Item_Two;
					cell.x += 200;
					Laya.timer.once(100, this, () => {
						Laya.Tween.to(cell, { setAlpha: 1, x: cell.x - 200 }, 500, null, Handler.create(this, () => {
							this._mainView.isMoveAni = false
						}));
					});
					i++;
					cell.mouseEnabled = true;
					// 波浪
					let scale: number = Math.random() > 0.5 ? 1.05 : 0.95;
					Laya.Tween.from(cell, { scaleX: scale, scaleY: scale }, 800, Laya.Ease.backInOut, Handler.create(this, () => {
						this._mainView.isMoveAni = false
					}));
				})

			} else {
				let curListX = this.view_pt.list_yx.x;
				this._mainView.isMoveAni = true
				Laya.Tween.to(this.view_pt.list_yx, { alpha: 0, x: 1280 }, 500, null, Handler.create(this, () => {
					this.view_pt.list_yx.x = curListX;
					this.view_pt.list_yx.alpha = 1;
					this.view_pt.list_yx.visible = false;
					this.view_pt.btn_box.mouseEnabled = true;
					this._mainView.isMoveAni = false
				}));
			}
		}

		update(): void {
			if (this._mainView) {
				if (this._mainView.isMoveAni) {
					this.view_pt.btn_box.mouseEnabled = false
					this.panel_pt.hScrollBar.touchScrollEnable = false
				} else {
					this.view_pt.btn_box.mouseEnabled = true
					this.panel_pt.hScrollBar.touchScrollEnable = true
				}
			}
		}

		setData(page: HudMainPage, mainView: ApiListPT, index: number): void {
			this.index = index;
			this._page = page;
			this._mainView = mainView;
		}

	}

	class QPLB_Item_Two extends ui.ajqp.dating.component.Hud_T_APIUI {
		public index: number;
		constructor() {
			super()

		}

		set setAlpha(v: number) {
			this.alpha = v;
		}
		get setAlpha(): number {
			return this.alpha;
		}

		setData(index: number): void {
			this.index = index
		}
	}
}