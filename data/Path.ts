/**
* 路径配置
*/
module gamecomponent.data {
	export class Path {
		static ui: string = "ui/";
		static ui_dating: string = "ui/dating_ui/";
		static ui_dating_tongyong: string = "ui/dating_ui/tongyong/";
		static atlas_dating_ui: string = "res/atlas/ui/dating_ui/";
		
		
		static map: string = "map/{0}/";
		static map_far: string = "map/{0}/far/";
		static mapEffect: string = "mapEffect/";
		static music: string = "music/";
		static data: string = 'data/';
		static temp: string = 'data/temp/';
		static ui_atlas_effect: string = "custom_atlas/ui/";
		static custom_atlas: string = "custom_atlas/";
		
		static sk_dating: string = 'ui/dating_ui/sk/';
		
		static music_bg: string = Path.music + 'bg.mp3';
		static music_btn: string = Path.music + 'btn.mp3';
		static music_copy: string = Path.music + 'copy.mp3';
		static music_kefu: string = Path.music + 'kefu.mp3';
		static music_tuiguang: string = Path.music + 'tuiguang.mp3';
		static music_zhuanpan: string = Path.music + 'zhuanpan.mp3';
		static scene: string = 'scene/';
		static custom_atlas_scene: string = 'custom_atlas/scene/';
		
		/**
		 * 获得一直序列帧地址
		 * @param path 图片路径
		 * @param count 帧数
		 * @param start 起始位置
		 * @param reverse 是否倒序播放
		 */
		static getSeqFrames(path: string, count: number, start: number = 0, reverse: boolean = false): string[] {
			let paths = [];
			if (reverse)
				for (let i = count - 1; i >= start; i--) {
					paths.push(StringU.substitute(path, i));
				}
			else
				for (let i = start; i < start + count; i++) {
					paths.push(StringU.substitute(path, i));
				}
			return paths;
		}
	}
}