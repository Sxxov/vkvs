import type { IWhenDo } from './IWhenDo';

export interface IWhenDoGroup {
	name: string;
	icon: string;
	subgroups: {
		name: string;
		icon: string;
		children: IWhenDo[];
	}[];
}
