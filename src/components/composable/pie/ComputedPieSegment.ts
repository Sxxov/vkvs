import { Thing } from '../../../core/blocks/thing/Thing';
import type { IPieSegment } from './AbstractPieSegment';
import type { IColourPieSegment } from './ColourPieSegment';
import type { IImagePieSegment } from './ImagePieSegment';
import type { TPieSegment } from './TPieSegment';

export interface IComputedPieSegment<T extends TPieSegment>
	extends Required<IComputedPieSegmentParameters<T>> {}

interface IComputedPieSegmentParameters<T extends TPieSegment> {
	id: string;
	startRad: number;
	endRad: number;
	segment: T;
}

export class ComputedPieSegment<T extends TPieSegment> extends (() => Thing)()<
	IComputedPieSegmentParameters<T>
> {}
