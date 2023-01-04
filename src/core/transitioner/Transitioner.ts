import * as easings from 'svelte/easing';
import { Transition } from './Transition';

type TEasing = typeof easings[keyof typeof easings];
interface ITransitionOptions {
	delay?: number;
	duration?: number;
	easing?: TEasing;
}

export class Transitioner {
	private isInRegistered = false;
	private isOutRegistered = false;
	private inIndex = 0;
	private outIndex = 0;
	private inLength = 0;
	private outLength = 0;

	// use arrow functions to keep 'this' bound
	// even if destructured
	public t = (): Partial<Transition> => {
		let index = this.inIndex % this.inLength;

		if (!this.isInRegistered) {
			index = this.inLength++;

			setTimeout(() => {
				this.isInRegistered = true;
			}, 0);
		}

		++this.inIndex;

		return {
			delay: index * 50,
		};
	};

	public tt = (): Partial<Transition> => {
		let index = this.outIndex % this.outLength;

		if (!this.isOutRegistered) {
			index = this.outLength++;

			setTimeout(() => {
				this.isOutRegistered = true;
			}, 0);
		}

		++this.outIndex;

		return {
			delay: index * 50,
		};
	};

	public static noop(): Transition {
		return Transition.from({
			delay: 0,
			duration: 0,
			easing: (t) => t,
			css: () => '',
		});
	}

	public static fade(
		element: Element,
		{
			delay = 0,
			duration = 200,
			easing = easings.quintInOut,
		}: ITransitionOptions = {},
		tick?: Transition['tick'],
	): Transition {
		const { opacity } = getComputedStyle(element);

		return Transition.from({
			delay,
			duration,
			easing,
			css: (t) => `opacity: ${t * Number(opacity)}`,
			tick,
		});
	}

	public static fadeIn(
		element: Element,
		options?: ITransitionOptions,
	): Transition {
		return Transitioner.fade(element, {
			easing: easings.quintOut,
			...options,
		});
	}

	public static fadeOut(
		element: Element,
		options?: ITransitionOptions,
	): Transition {
		return Transitioner.fade(element, {
			easing: easings.quintIn,
			...options,
		});
	}

	public static dropIn(
		element: Element,
		{
			delay = 0,
			duration = 500,
			easing = easings.expoOut,
		}: ITransitionOptions = {},
	): Transition {
		const computed = getComputedStyle(element);
		const opacity = Number(computed.opacity);
		const transform =
			computed.transform === 'none' ? '' : computed.transform;

		return Transition.from({
			delay,
			duration,
			easing,
			css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * Math.min(t * 2, 1)};
			`,
		});
	}

	public static dropOut(
		element: Element,
		{
			delay = 0,
			duration = 200,
			easing = easings.expoIn,
		}: ITransitionOptions = {},
	): Transition {
		const computed = getComputedStyle(element);
		const opacity = Number(computed.opacity);
		const transform =
			computed.transform === 'none' ? '' : computed.transform;

		return Transition.from({
			delay,
			duration,
			easing,
			css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * t};
			`,
		});
	}
}

export const { fade, fadeIn, fadeOut, dropIn, dropOut, noop } = Transitioner;

export { easings };
