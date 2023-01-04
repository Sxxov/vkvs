import type { IFabCell } from '../fab-row/IFabCell';
import type { IWhenDo } from '../when-do/IWhenDo';

export interface IMod {
	name: string;
	whens: IWhenDo[];
	dos: IWhenDo[];
	buttons: IFabCell[];
}
