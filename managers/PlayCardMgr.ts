/**
* name 发牌管理器
*/
module gamecomponent.managers{
	export class PlayCardMgr{
		public max_card:number = 3;
		private _sceneGame:SceneGame;
		private _cards:PlayingChip[] = [];
		constructor(g:SceneGame){
			this._sceneGame = g;
		}

		init()
		{	
			for (let index = 0; index < 1; index++) {
				let card = this._sceneGame.sceneObjectMgr.createOfflineObject(SceneRoot.CARD_MARK,PlayingChip) as PlayingChip;
				card.pos = new Vector2(640,360);
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