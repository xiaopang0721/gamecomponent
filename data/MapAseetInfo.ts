module gamecomponent.data {
	export class MapAssetInfo {
		// 地图ID
		id: string;
		// 地图资源id
		imgId: string;
		// 地图名称 
		name: string;
		// 地图像素宽 
		pxWidth: number;
		// 地图像素高 
		pxHeight: number;
		// 地图逻辑宽 
		logicWidth: number;
		// 地图逻辑高 
		logicHeight: number;
		// 场景音乐
		sound: string;
		//场次
		maplv:number = 0;

		load(mapid: string,mapUrl?:string,mlv:number=0): void {
			this.clear();
			this.id = mapid;
			this.imgId = mapUrl;
			this.maplv = mlv;
			this.pxWidth =  1280;
			this.pxHeight = 720;
			this.logicWidth = this.pxWidth / SceneRes.CELL_WIDTH;
			this.logicHeight = this.pxHeight / SceneRes.CELL_HEIGHT;
			if (this.onLoadedComplete)
				this.onLoadedComplete();
		}
		
		// 加载完成回调
		onLoadedComplete: Function;

		clear(): void {
			// 地图ID
			this.id = "";
			// 地图资源id
			this.imgId = "";
			// 地图名称 
			this.name = '';
			// 地图像素宽 
			this.pxWidth = 0;
			// 地图像素高 
			this.pxHeight = 0;
			// 地图逻辑宽 
			this.logicWidth = 0;
			// 地图逻辑高 
			this.logicHeight = 0;
			// 场景音乐
			this.sound = '';
		}
	}
}