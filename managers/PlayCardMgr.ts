/**
* name 发牌测试管理器
*/
module gamecomponent.managers {
	export class PlayCardMgr {
		public max_card: number = 3;
		private _game: Game;
		private _cards: PlayingChip[] = [];
		constructor(g: Game) {
			this._game = g;
		}

		private static _ins: PlayCardMgr;
		public static get ins(): PlayCardMgr {
			if (!this._ins) this._ins = new PlayCardMgr(main.game)
			return this._ins;
		}

		initCard() {
			for (let index = 0; index < 1; index++) {
				let card = this._game.sceneObjectMgr.createOfflineObject(SceneRoot.CARD_MARK, PlayingChip) as PlayingChip;
				card.pos = new Vector2(MathU.randomRange(550, 700), MathU.randomRange(250, 450));
				card.size = 0.5
				card["_val"] = "1000000";
				this._cards.push(card);
			}
		}

		initChip() {
			for (let index = 0; index < 1; index++) {
				let card = this._game.sceneObjectMgr.createOfflineObject(SceneRoot.CARD_MARK, PlayingChip) as PlayingChip;
				card.pos = new Vector2(MathU.randomRange(550, 700), MathU.randomRange(250, 450));
				card.size = 0.5
				card["_val"] = "1000000";
				this._cards.push(card);
			}
		}

		update(diff: number) {
			this._cards.forEach(card => {
				card && card.update(diff);
			});
		}

		up_show() {
			this._cards.forEach(card => {
				card && (card.isUIShow = true)
			});
		}

		down_show() {
			this._cards.forEach(card => {
				card && (card.isUIShow = false)
			});
		}

		// fapai()
		// {
		// 	for (let index = 0; index < this._cards.length; index++) {
		// 		let element = this._cards[index];
		// 		Laya.timer.once(200 * index,this,()=>{
		// 			element.fapai();
		// 		})

		// 	}
		// }
		// fanpai()
		// {
		// 	for (let index = 0; index < this._cards.length; index++) {
		// 		let element = this._cards[index];
		// 		Laya.timer.once(200 * index,this,()=>{
		// 			element.fanpai();
		// 		})

		// 	}
		// }

	}
}