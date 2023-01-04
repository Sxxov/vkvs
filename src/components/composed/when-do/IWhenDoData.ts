import type { WhenDoDatumKinds } from './WhenDoDatumKinds';

export interface IWhenDoData {
	name: string;
	icon: `<svg${string}`;
	data: { name: string; kind: WhenDoDatumKinds }[];
}
