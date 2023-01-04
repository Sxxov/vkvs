import { Thing } from '../../../core/blocks/thing/Thing';
import { Levels } from '../common/enums/Levels';
import { v4 as uuid } from 'uuid';

export interface IToast extends Required<IToastParameters> {}

interface IToastParameters {
	uid?: string;
	text: string;
	level?: Levels;
	duration?: number;
}

export class Toast extends Thing<IToastParameters>()(
	class {
		uid = uuid();
		level = Levels.INFO;
		duration = 2000;
	},
) {}
