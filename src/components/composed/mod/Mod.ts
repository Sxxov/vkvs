import { Thing } from '../../../core/blocks/thing/Thing';
import { v4 as uuid } from 'uuid';
import type { IWhenDo } from '../when-do/IWhenDo';
import type { IFabCell } from '../fab-row/IFabCell';

export interface IMod extends Required<IModParameters> {}

interface IModParameters {
	uid?: string;
	name: string;
	whens: IWhenDo[];
	dos: IWhenDo[];
	buttons: IFabCell[];
}

export class Mod extends Thing<IModParameters>()(
	class {
		uid = uuid();
	},
) {}
