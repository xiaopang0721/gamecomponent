module gamecomponent.scene {
	export class AvatarDrawtor extends game.base.Container {
		public avatarInited: boolean = false;
		protected _avatars: Array<AvatarBase>;
		get avatars(): Array<AvatarBase> {
			return this._avatars;
		}

		//通用层
		private _commonLayer: Sprite;
		private _layerArr: Sprite[] = [];
		private _layerGraghics: Graphics[] = [];
		//是否多层
		private _isMultiLayer: boolean;
		setLayerConfigArr(values?: Laya.Sprite[]) {
			this._layerArr = values;
			let len = this._layerArr && this._layerArr.length ? this._layerArr.length : [];
			if (len > 0) {
				for (let index = 0; index < len; index++) {
					let layer = this._layerArr[index];
					if (layer && !layer.parent) {
						this._layerGraghics[index] = layer.graphics;
						this.addChildAt(layer, index + 1);
					}
				}
				this._isMultiLayer = true;
			} else {
				for (let index = 0; index < len; index++) {
					let layer = this._layerArr[index];
					if (layer) {
						layer.removeSelf();
						layer.destroy();
						layer = null;
					}
				}
				this._layerArr = null;
				this._isMultiLayer = false;
			}
		}

		protected _scene: SceneRootBase;
		private _isUiShow: boolean;
		constructor(v: SceneRootBase) {
			super(v.game);
			this._scene = v;
			this.mouseEnabled = false;
			this._isUiShow = this._scene instanceof UIShowRoot;
			// 通用层
			this._commonLayer = new Sprite();
			this._commonLayer.mouseEnabled = false;
			this.addChild(this._commonLayer);

			//avatar集合
			this._avatars = new Array<AvatarBase>();
		}

		// 更新位置 （更新摄像机之前需要先调用）
		updateAvatarPostion(diff: number): void {
			let len: number = this._avatars.length;
			for (let i: number = 0; i < len; i++) {
				!this._avatars[i].hasClear && this._avatars[i].update(diff);
			}
		}

		private _updateRunTime: number = 0;
		// 心跳
		private updateInLook(diff: number): void {
			this._updateRunTime += diff;
			if (this._updateRunTime < 200) return;
			this._updateRunTime = 0;

			let objMgr: SceneObjectMgr = this._game.sceneGame.sceneObjectMgr;
			objMgr.ForEachObject((obj: GuidObject): void => {
				if (obj instanceof PlayerData || obj instanceof GlobalData || obj instanceof MapInfo) return;//这些都不处理视图
				if (this._isUiShow && (obj instanceof gamecomponent.object.ActionBase) && !obj.isUIShow) return; //ui上层 但是不是UI上层显示的 不处理
				if (obj instanceof Unit && this._scene.mapid != "buyu") return;//除了捕鱼 其他精灵对象不需要做视图处理
				let story = this._game.sceneGame.sceneObjectMgr.story as gamecomponent.object.IInLook;
				if (story) {
					let str = story.updateInLook(obj);
					if (str == SceneRoot.INLOOK) {
						this.inLook(obj);
					} else if (str == SceneRoot.OUTLOOK) {
						this.outLook(obj, false)
					} else {
						this.inLook(obj)
					}
				}
			});
		}

		update(diff: number): void {
			let len: number = this._avatars.length;
			for (let i: number = 0; i < len; i++) {
				!this._avatars[i].hasClear && this._avatars[i].update(diff);
			}
		}

		// 进入视野队列
		private _inLookQueue: Array<GuidObject> = [];
		/**
		 * 对象在视野内
		 */
		private inLook(obj: any): void {
			if (obj.userData && this._avatars.indexOf(obj.userData) != -1) {
				return;
			}

			if (obj.isFocus) {
				// 焦点对象直接初始化
				this.__inLook(obj, true);
			}
			else {
				// 其他形象进入队列
				let idx = this._inLookQueue.indexOf(obj)
				if (idx == -1) {
					this._inLookQueue[this._inLookQueue.length] = obj;
				}
			}
		}

		private updateInLookQueue(): void {
			const inLookBatchCount = 4;
			let count = 0
			while (count < inLookBatchCount && this._inLookQueue.length) {
				count++;
				let obj: any = this._inLookQueue.shift();
				this.__inLook(obj);
			}
		}

		private __inLook(obj: any, isFollow: boolean = false): void {
			let avatar: AvatarBase = obj.userData;
			if (!avatar) {
				if (obj instanceof gamecomponent.object.PlayingPuKeCard) {
					avatar = new AvatarCard(this._game, obj);
				}
				else if (obj instanceof gamecomponent.object.PlayingChip) {
					avatar = new AvatarChip(this._game, obj);
				}
				else if (obj instanceof gamecomponent.object.PlayingGuPai) {
					avatar = new AvatarGuPai(this._game, obj);
				}
				else if (obj instanceof gamecomponent.object.PlayingMahjong) {
					avatar = new AvatarMahjong(this._game, obj);
				}
				else if (obj instanceof gamecomponent.object.PlayingPoker) {
					avatar = new AvatarPoker(this._game, obj);
				}
				else {
					let story = this._game.sceneGame.sceneObjectMgr.story as gamecomponent.object.IInLook;
					if (story) {
						avatar = story.inLook(obj, isFollow)
					}
				}
				obj.userData = avatar;
			}
			if (avatar) {
				this.join(avatar);
				//直接跟随玩家的真实坐标
				if (isFollow) {
					this._scene.camera.focusPos.x = avatar.lookPos.x;
					this._scene.camera.focusPos.y = avatar.lookPos.y;
				}
			}
		}

		/**
		 * 对象不在视野内
		 */
		outLook(obj: any, checkNow: boolean): void {
			let idx = this._inLookQueue.indexOf(obj);
			if (idx != -1) {
				this._inLookQueue.splice(idx, 1);
			}
			let avatar: AvatarBase = obj.userData;
			if (avatar) {
				this.leave(avatar, checkNow);
				if (this._scene.camera.isFocus(avatar.pos)) {
					this._scene.camera.focusPos.x = avatar.pos.x;
					this._scene.camera.focusPos.y = avatar.pos.y;
				}
				obj.userData = null;
				obj = obj as gamecomponent.object.IClear;
				if (obj) {
					obj.isCanClear = true;
					obj.clear();
					obj = null;
				}
			}
		}
		/**
		 * 形象加入
		 */
		private join(avatar: AvatarBase): void {
			// logd("roc.scene.AvatarDrawtor.join[", avatar.name, ",", avatar.guid, "]");
			if (this._avatars.indexOf(avatar) == -1) {
				this._avatars[this._avatars.length] = avatar;
			}
		}

		/**
		 * 形象离开
		 */
		private leave(avatar: AvatarBase, checkNow: boolean): void {
			// logd("roc.scene.AvatarDrawtor.leave[", avatar.name, ",", avatar.guid, "]");
			//Avatar从列表中删除
			let idx: number = this._avatars.indexOf(avatar);
			if (idx >= 0) {
				this._avatars.splice(idx, 1);
			}
			avatar.clear(checkNow);
			avatar = null;
		}

		public onDraw(diff: number): void {
			//avatar渲染器心跳，主要为了剔除
			this.updateInLook(diff);
			this.updateInLookQueue();


			if (this._isMultiLayer) {
				for (let layer of this._layerGraghics) {
					layer.clear();
				}
			} else {
				let bG: Graphics = this._commonLayer.graphics;
				//清理画布
				bG.clear();
			}

			//深度排序,绘制
			this._avatars.sort(this.worldObjectDeepCmp);
			let len: number = this._avatars.length;
			for (let i: number = 0; i < len; i++) {
				//运算位置
				let avatar: AvatarBase = this._avatars[i];
				if (!avatar.visible || avatar.hasClear) continue;
				//绘制
				if (this._isMultiLayer) {
					avatar.onMultiDraw(diff, this._layerGraghics, this._scene);
				} else {
					avatar.onDraw(diff, this._commonLayer.graphics, this._scene);
				}
			}

		}

		/*深度比较排序*/
		private worldObjectDeepCmp(a: AvatarBase, b: AvatarBase): number {
			if (b.sortScore != a.sortScore) {
				return b.sortScore - a.sortScore;
			}
			return b.oid - a.oid;
		}

		// 绘制边框
		private drawBorder(g: Graphics): void {
			const color = "#000000";
			let camera = this._scene.camera;
			if (camera.bufferOffsetX > 0) {
				g.drawRect(0, 0, camera.bufferOffsetX, camera.height, color);
			}
			let w = camera.width - camera.bufferOffsetX - camera.bufferWidth;
			if (w > 0) {
				g.drawRect(camera.bufferOffsetX + camera.bufferWidth, 0, w, camera.height, color);
			}
			if (camera.bufferOffsetY > 0) {
				g.drawRect(0, 0, camera.width, camera.bufferOffsetY, color);
			}
			let h = camera.height - camera.bufferOffsetY - camera.bufferHeight;
			if (h > 0) {
				g.drawRect(0, camera.bufferOffsetY + camera.bufferHeight, camera.width, h, color);
			}
		}
		
		//设置窗口大小
		resize(clientWidth: number, clientHeight: number): void {
			super.resize(clientWidth, clientHeight);
		}

		//通过oid找形象
		findAvatarByOid(oid: number): AvatarBase {
			if (oid) {
				let len: number = this._avatars.length;
				for (let i = 1; i < len; i++) {
					let avatar = this._avatars[i]
					if (avatar.oid == oid) {
						return avatar;
					}
				}
			}
			return null;
		}

		/**
		 * 清理
		 */
		clear(): void {
			let len: number = this._avatars.length;
			for (let i: number = 0; i < len; i++) {
				this._avatars[i].clear(true);
			}
			this._avatars.length = 0;
			this._inLookQueue.length = 0;
			let fG: Graphics = this._commonLayer.graphics;
			//清理画布
			fG.clear();

			len = this._layerGraghics ? this._layerGraghics.length : 0;
			for (let index = 0; index < len; index++) {
				this._layerGraghics[index] && this._layerGraghics[index].clear();
			}
		}
	}
}