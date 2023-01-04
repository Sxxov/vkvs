import { Thing } from '../../../core/blocks/thing/Thing';
import type { PieSegmentKinds } from './PieSegmentKinds';

export interface IPieSegment<Kind extends PieSegmentKinds = PieSegmentKinds>
	extends Required<IPieSegmentParameters<Kind>> {}

interface IPieSegmentParameters<
	Kind extends PieSegmentKinds = PieSegmentKinds,
> {
	kind: Kind;
	value: number;
}

export abstract class AbstractPieSegment<
	Kind extends PieSegmentKinds = PieSegmentKinds,
> extends Thing<IPieSegmentParameters<any>>()(class {}) {
	public declare kind: Kind;
}
