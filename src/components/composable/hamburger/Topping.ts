import { Thing } from '../../../core/blocks/thing/Thing';

export interface ITopping extends Required<IToppingParameters> {}

interface IToppingParameters {
	svg: string;
	name: string;
	action: () => void;
}

export class Topping extends Thing<IToppingParameters>()(class {}) {}
