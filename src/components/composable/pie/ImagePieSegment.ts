import { Thing } from '../../../core/blocks/thing/Thing';
import type { IPieSegment } from './AbstractPieSegment';
import { PieSegmentKinds } from './PieSegmentKinds';

export interface IImagePieSegment extends Required<IImagePieSegmentParameters> {
	kind: PieSegmentKinds.IMAGE;
}

interface IImagePieSegmentParameters extends Omit<IPieSegment, 'kind'> {
	src: string;
}

export class ImagePieSegment extends Thing<IImagePieSegmentParameters>()(
	class {},
) {
	kind = PieSegmentKinds.IMAGE as const;
}
