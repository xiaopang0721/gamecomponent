/**
* name 
*/
module gamecomponent.object {
	/**
	 * 场景对象
	 */
	export interface ISceneObject extends IClear {
		/**
		 * 位置
		 */
		pos: Vector2;
		/**
		 * 目标位置
		 */
		targe_pos: Vector2;
		/**
		 * /归属
		 */
		owner: Unit;
		/**
		 * 水平翻转
		 */
		scaleX: number;
		/**
		 * 垂直翻转
		 */
		scaleY: number;
		/**
		 * 大小
		 */
		size: number;
		/**
		 *序列
		 */
		index: number;
		/**
		 * 排序
		 */
		sortScore: number;
		/**
		 * 是否ui场景
		 */
		isUIShow: boolean;
		/**
		 * 是否可以清理
		 */
		isCanClear: boolean;
		/**
		 * 是否是终点坐标
		 */
		isFinalPos: boolean;
		/**
		 * 是否在摄像机可视范围内
		 */
		// lookInCamera:boolean;
		//是否状态
		toggle: boolean;
		//toggle开关
		toggleEnable: boolean;

		update(diff: number);
	}

	export interface IClear {
		isCanClear: boolean;
		clear();
	}

	//牌行为
	export interface IAction {
		//发牌
		fapai();
		//翻牌
		fanpai();
		//排序
		sort();
	}

	/**
	 * 排序对象
	 */
	export interface ISortDrawObject {
		oid: number;
		sortScore: number;
		visible: boolean;
		update(diff: number): void;
		onDraw(diff: number, g: Graphics, ...args): void;
		clear(checkNow: boolean): void;
	}

	export interface IMouseHandle {
		/**
		 * 鼠标点击
		 */
		onMouseClick(xMouse: number, yMouse: number): void | boolean;
		/**
		 * 鼠标区域移动
		 */
		onMouseAreaMove(area: Array<number>): void | boolean;
		/**
		 * 鼠标区域弹起
		 */
		onMouseAreaUp(area: Array<number>): void | boolean;
	}

	export interface IMouseHit {
		/**
		 * 鼠标点击命中
		 */
		onMouseClickHit(xMouse: number, yMouse: number): void | boolean;
		/**
		 * 鼠标移动命中
		 */
		onMouseAreaMoveHit(): void | boolean;
		/**
		 * 鼠标弹起命中
		 */
		onMouseAreaUpHit(): void | boolean;
	}

	/**
	 * 更新剔除对象
	 */
	export interface IInLook {
		//视图对象创建
		inLook(obj: any, isFollow: boolean): AvatarBase;
		//更新视图对象
		updateInLook(obj: GuidObject): string;
	}

	/**
	 * 房卡类型接口参数
	 */
	export interface IStoryCardRoomDataSource {
		//房间ID
		RoomID: string;
		//房间类型
		RoomType: number;
		//房间回合
		RoomRound: number;
		//付费类型
		PayType:number;
		//额外参数
		Agrs:string;

	}
}