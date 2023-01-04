/* eslint-disable @typescript-eslint/ban-types */
import { ExtendableStore } from './ExtendableStore.js';

export type TWeakSetStorify<T extends Set<any>> = T extends WeakSet<infer U>
	? WeakSetStore<U>
	: never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface WeakSetStore<T extends object = object>
	extends ExtendableStore<WeakSet<T>>,
		Set<T> {}

export class WeakSetStore<T extends object = object> extends ExtendableStore<
	WeakSet<T>
> {
	constructor(iterable?: Iterable<T>, isWritable?: boolean) {
		super(new Set(iterable), isWritable);

		// eslint-disable-next-line no-constructor-return
		return this.proxy();
	}

	public add(value: T): this {
		const has = this.has(value);

		this.value.add(value);

		if (!has) this.trigger();

		return this;
	}

	public delete(value: T): boolean {
		const result = this.value.delete(value);

		if (result) {
			this.trigger();
		}

		return result;
	}
}
