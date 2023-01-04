/* 
	eslint-disable
		@typescript-eslint/no-unsafe-assignment,
		@typescript-eslint/no-unsafe-return,
*/

import type { TArrayElement } from '../../types/TArrayElement.js';
import { ExtendableStore } from './ExtendableStore.js';

export type TShapedArrayStorify<T extends any[]> = ShapedArrayStore<T>;

// @ts-expect-error shape will refer to the value, which is safe
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ShapedArrayStore<Shape extends any[] = unknown[]>
	extends ExtendableStore<Shape>,
		Shape {}

export class ShapedArrayStore<
	Shape extends any[],
> extends ExtendableStore<Shape> {
	constructor(array: Shape, isWritable?: boolean) {
		super(array, isWritable);

		// eslint-disable-next-line no-constructor-return
		return this.proxy();
	}

	public [Symbol.iterator](): IterableIterator<TArrayElement<Shape>> {
		return this.value.values();
	}

	public get length(): Shape['length'] {
		return this.value.length;
	}

	public removeAt(index: number): void {
		this.value.splice(index, 1);

		this.trigger();
	}

	public remove(...items: TArrayElement<Shape>[]): void {
		items.forEach((item) => {
			this.value.splice(this.value.indexOf(item), 1);
		});

		this.trigger();
	}

	public setAt<Index extends number>(
		index: Index,
		newValue: Shape[Index],
	): void {
		this.value[index] = newValue;

		this.trigger();
	}

	public getAt<Index extends number>(index: Index): Shape[Index] {
		return this.value[index];
	}

	public push(...items: TArrayElement<Shape>[]): number {
		const result = this.value.push(...items);

		this.trigger();

		return result;
	}

	public pop(): TArrayElement<Shape> | undefined {
		const result = this.value.pop();

		this.trigger();

		return result;
	}

	public shift(): TArrayElement<Shape> | undefined {
		const result = this.value.shift();

		this.trigger();

		return result;
	}

	public unshift(...items: TArrayElement<Shape>[]): number {
		const result = this.value.unshift(...items);

		this.trigger();

		return result;
	}

	public splice(start: number, deleteCount?: number): TArrayElement<Shape>[] {
		const result = this.value.splice(start, deleteCount);

		this.trigger();

		return result;
	}

	public reverse(): TArrayElement<Shape>[] {
		const result = this.value.reverse();

		this.trigger();

		return result;
	}

	public sort(
		compareFn?: (
			a: TArrayElement<Shape>,
			b: TArrayElement<Shape>,
		) => number,
	): this {
		this.value.sort(compareFn);

		this.trigger();

		return this;
	}
}
