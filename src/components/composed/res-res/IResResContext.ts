import type { Axes } from '../../composable/common/enums/Axes';

export interface IResResContext {
	smallCount: number;
	stackedCount: number;
	bigCount: number;
	position: number;
	bigSizePx: number;
	smallSizePx: number;
	gapSizePx: number;
	currAxis: Axes;
}
