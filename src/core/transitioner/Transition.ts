import { quintInOut } from 'svelte/easing';
import { Thing } from '../blocks/thing/Thing';

export interface ITransition extends Required<ITransitionParameters> {}

interface ITransitionParameters {
	delay: number;
	duration: number;
	easing: (t: number) => number;
	css: (time: number, invertedTime: number) => string;
	tick?: ((time: number, invertedTime: number) => void) | undefined;
}

export class Transition extends Thing<ITransitionParameters>()(class {}) {}
