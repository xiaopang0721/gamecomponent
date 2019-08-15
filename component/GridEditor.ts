/**
* 地砖格子工具
*/
module gamecomponent.component {
	export class GridEditor extends laya.display.Sprite {
		//是否显示坐标点 调试开关 画辅助线
		private _showPos = false;


		//是否可以拖拽
		private _enableDragSet = false;
		//清理模式
		private _isCleanMode = false;
		//长
		private _gridWidth = 20;
		//宽
		private _gridHeight = 20;
		//尺寸X
		private _countX = 20;
		//尺寸Y
		private _countY = 20;
		//贴图内容类型
		private _textureTypes: { [key: number]: string };
		//绘制内容
		private _value = 1;
		//线颜色
		private _lineColor = "#ff0000";
		//文本颜色
		private _textColor = "#00ff00";
		//线粗
		private _lineWidth = 1;
		//数据
		private _data: any[] = [];
		//拖拽选中
		private _isDragSelect = false;
		private _selectLineLayer = null;
		public mouseEnabled = true;
		private _tipText: Laya.Text
		private _wordSpace: Point;
		private _ijPosPoint: Point;
		private _preMousePos: Point;
		private _preMyPos: Point;
		private _gridIJ: Point;
		/**
		 * if (!this._gridEditor) {
					this._gridEditor = new GridEditor(60, 80, 50, 50, { 1: PathGameTongyong.ui_tongyong_general + "tu_g.png", 2: PathGameTongyong.ui_tongyong_general + "tu_hq.png" }, true);
					this._gridEditor.setData([19, 1, [1, 2]])
					this.addChild(this._gridEditor);
				}
		 * @param gridW 格子宽
		 * @param gridH 格子高
		 * @param countX X格子数
		 * @param countY Y格子数
		 * @param textureTypes {"type1":url,"type2":url} 
		 * @param showPos 调试模式 有辅助线啊 可以看位置 可以画出来看看啊
		 */
		constructor(gridW: number, gridH: number, countX: number, countY: number, textureTypes?: { [key: number]: string }, showPos?: boolean) {
			super();
			this._gridWidth = gridW;
			this._gridHeight = gridH;
			this._countX = countX;
			this._countY = countY;
			this._textureTypes = textureTypes;
			this._showPos = showPos;
			this._selectLineLayer = new Sprite()
			this.addChild(this._selectLineLayer);
			if (!this._tipText) {
				this._tipText = new Laya.Text();
				this._tipText.color = "#ffffff";
				this._tipText.align = "center";
			}
			this._wordSpace = new Point();
			this._ijPosPoint = new Point();
			this._preMousePos = new Point();
			this._preMyPos = new Point();
			this._gridIJ = new Point();
			this.on(LEvent.ADDED, this, this.renderMe);

			if (this._showPos) {
				this.on(LEvent.MOUSE_DOWN, this, this.mouseDownH);
				this.updateTipState();
			}
		}

		private updateTipState() {
			this.off(LEvent.MOUSE_MOVE, this, this.myMouseMove);
			this.off(LEvent.MOUSE_OUT, this, this.myMouseOut);
			this.off(LEvent.MOUSE_OVER, this, this.myMouseOver);
			if (this._showPos) {
				this.on(LEvent.MOUSE_MOVE, this, this.myMouseMove);
				this.on(LEvent.MOUSE_OUT, this, this.myMouseOut);
				this.on(LEvent.MOUSE_OVER, this, this.myMouseOver);
			} else { }
		}

		private myMouseOver() {
			this.addChild(this._tipText);
		}

		private myMouseOut() {
			this._tipText.removeSelf();
		}

		private myMouseMove() {
			if (this._tipText && this._tipText.parent) {
				let pos;
				pos = this.getMousePoint();
				this._tipText.pos(pos.x, pos.y + 20);
				this._tipText.text = "(" + this.getGridIJ(pos.x, pos.y).toString() + ")";
			} else {
				if (this._tipText) {
					this.addChild(this._tipText);
				}
			}
		}



		private getPointsByStr(str) {
			let pointArr;
			pointArr = str.split(",");
			let i = 0, len = 0;
			len = pointArr.length;
			for (i = 0; i < len; i++) {
				pointArr[i] = parseFloat(pointArr[i]);
				if (pointArr[i].toString() == "NaN") {
					pointArr[i] = 0;
				}
			}
			if (pointArr.length % 3 != 0) {
				len = pointArr.length % 3;
				for (i = 0; i < len; i++)
					pointArr.push(0);
			}
			return pointArr;
		}

		/**
		 * 塞数据
		 * @param data [0,0,type,0,1,type,...]
		 */
		setData(data: any[]) {
			this._data = data;
			this.renderMe();
		}

		private renderMe() {
			this.graphics.clear();
			this.size(this._gridWidth * this._countX, this._gridHeight * this._countY);
			let i = 0, j = 0;
			let tX = NaN;
			let tY = NaN;
			if (this._showPos)//要不要画线
			{
				for (i = 0; i <= this._countY; i++) {
					tY = i * this._gridHeight;
					this.graphics.drawLine(0, tY, this.width, tY, this._lineColor, this._lineWidth);
				}
				for (i = 0; i <= this._countX; i++) {
					tX = i * this._gridWidth;
					this.graphics.drawLine(tX, 0, tX, this.height, this._lineColor, this._lineWidth);
				}
			}
			if (!this._data) this._data = [];
			let p;
			let len = 0;
			len = this._data.length;
			let hasChange = false;
			for (i = len - 3; i >= 0; i -= 3) {
				if (this._data[i] < this._countX && this._data[i + 1] < this._countY) {
					p = this.getIJPos(this._data[i], this._data[i + 1]);
					if (this._textureTypes) {
						if (typeof this._data[i + 2] === 'number') {
							let texture: Texture = Loader.getRes(this._textureTypes[this._data[i + 2]])
							if (texture) {
								this.graphics.drawTexture(texture, p.x - texture.sourceWidth * .5, p.y - texture.sourceHeight * .5)
							} else {
								this.graphics.fillText(this._data[i + 2] + "", p.x, p.y - 5, null, this._textColor, "center");
							}
						} else if (this._data[i + 2] instanceof Array) {
							this._data[i + 2].forEach(element => {
								let texture: Texture = Loader.getRes(this._textureTypes[element])
								if (texture) {
									this.graphics.drawTexture(texture, p.x - texture.sourceWidth * .5, p.y - texture.sourceHeight * .5)
								} else {
									this.graphics.fillText(element + "", p.x, p.y - 5, null, this._textColor, "center");
								}
							});
						}
					} else {
						this.graphics.fillText(this._data[i + 2] + "", p.x, p.y - 5, null, this._textColor, "center");
					}
				} else {
					this._data.splice(i, 3);
					hasChange = true;
				}
			}
			if (hasChange)
				this.noticeChange();
		}

		private getIJPos(i, j) {
			let p;
			p = this._ijPosPoint;
			p.x = i * this._gridWidth + 0.5 * this._gridWidth;
			p.y = j * this._gridHeight + 0.5 * this._gridHeight;
			return p;
		}

		private mouseDownH() {
			this._preMousePos.setTo(Laya.stage.mouseX, Laya.stage.mouseY);
			this._preMyPos.setTo(this.mouseX, this.mouseY);
			this._isDragSelect = false;
			this._selectLineLayer.graphics.clear();
			Laya.stage.on(LEvent.MOUSE_MOVE, this, this.onStageMouseMove);
			Laya.stage.on(LEvent.MOUSE_UP, this, this.onStageMouseUp);
		}

		/**移动组件*/
		private onStageMouseMove(e) {
			if (!this._enableDragSet) return;
			if (this._isDragSelect) {
				this._selectLineLayer.graphics.clear();
				this._selectLineLayer.graphics.drawRect(this._preMyPos.x, this._preMyPos.y, this.mouseX - this._preMyPos.x, this.mouseY - this._preMyPos.y, null, "#ff0000");
			} else {
				if (Math.abs(this._preMousePos.x - Laya.stage.mouseX) + Math.abs(this._preMousePos.y - Laya.stage.mouseY) > 5) {
					this._isDragSelect = true;
				}
			}
		}

		private onStageMouseUp(e) {
			Laya.stage.off(LEvent.MOUSE_MOVE, this, this.onStageMouseMove);
			Laya.stage.off(LEvent.MOUSE_UP, this, this.onStageMouseUp);
			if (this._isDragSelect) {
				this._isDragSelect = false;
				this.multiSelect();
				this._selectLineLayer.graphics.clear();
			} else {
				this.click();
			}
		}

		private multiSelect() {
			let i = 0, iLen = 0;
			let j = 0, jLen = 0;
			let tGrid;
			let range;
			let rec;
			rec = this._selectLineLayer.getBounds();
			range = this.getWrapGrid(rec.x, rec.y, rec.width, rec.height);
			iLen = range[3] + 1;
			jLen = range[2] + 1;
			range[0] = range[0] > 0 ? range[0] : 0;
			range[1] = range[1] > 0 ? range[1] : 0;
			iLen = iLen < this._countY ? iLen : this._countY;
			jLen = jLen < this._countX ? jLen : this._countX;
			let index = 0;
			let hasChange = false;
			for (i = range[1]; i < iLen; i++) {
				for (j = range[0]; j < jLen; j++) {
					this.changeGridValue(j, i, this._value, true, this._isCleanMode);
					hasChange = true;
				}
			}
			if (hasChange)
				this.noticeChange();
		}

		private click() {
			if (Math.abs(this._preMousePos.x - Laya.stage.mouseX) + Math.abs(this._preMousePos.y - Laya.stage.mouseY) > 5) return;
			let p;
			p = this.getGridIJ(this.mouseX, this.mouseY);
			logd(p.toString());
			this.changeGridValue(p.x, p.y, this._value);
			this.noticeChange();
		}

		private noticeChange() {
			this.renderMe();
		}

		private changeGridValue(i, j, value, force?, isClean?) {
			(force === void 0) && (force = false);
			(isClean === void 0) && (isClean = false);
			let ii = 0;
			let len = 0;
			len = this._data.length;
			for (ii = 0; ii < len; ii += 3) {
				if (this._data[ii] == i && this._data[ii + 1] == j) {
					if (!force) {
						if (this._data[ii + 2] == value) {
							this._data.splice(ii, 3);
							return;
						}
					} else {
						if (isClean) {
							this._data.splice(ii, 3);
							return;
						}
					}
					this._data[ii + 2] = value;
					return;
				}
			}
			if (isClean) {
				return;
			}
			this._data.push(i, j, value);
		}

		private getWrapGrid(x, y, width, height) {
			let rst;
			rst = [];
			rst.length = 4;
			let tP;
			tP = this.getGridIJ(x, y);
			rst[0] = tP.x;
			rst[1] = tP.y;
			tP = this.getGridIJ(x + width, y + height);
			rst[2] = tP.x;
			rst[3] = tP.y;
			return rst;
		}

		private getGridIJ(x, y) {
			x -= this._wordSpace.x;
			y -= this._wordSpace.y;
			let i = 0;
			i = Math.floor(x / this._gridWidth);
			let j = 0;
			j = Math.floor(y / this._gridHeight);
			if (i < 0) i = 0;
			if (j < 0) j = 0;
			this._gridIJ.setTo(i, j);
			return this._gridIJ;

		}

		public destroy(destroyChild?: boolean) {
			if (this._tipText) {
				this._tipText.removeSelf();
				this._tipText.destroy();
				this._tipText = null;
			}

			this._wordSpace = null;
			this._ijPosPoint = null;
			this._preMousePos = null;
			this._preMyPos = null;
			this._gridIJ = null;

			this.offAll();
			super.destroy(destroyChild);
		}
	}
}