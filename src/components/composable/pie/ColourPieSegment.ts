import { Thing } from '../../../core/blocks/thing/Thing';
import type { IPieSegment } from './AbstractPieSegment';
import { PieSegmentKinds } from './PieSegmentKinds';

export interface IColourPieSegment
	extends Required<IColourPieSegmentParameters> {
	kind: PieSegmentKinds.COLOUR;
}

interface IColourPieSegmentParameters extends Omit<IPieSegment, 'kind'> {
	colour: string;
}

export class ColourPieSegment extends Thing<IColourPieSegmentParameters>()(
	class {},
) {
	kind = PieSegmentKinds.COLOUR as const;
}
