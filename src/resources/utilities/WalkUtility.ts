/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment,
		@typescript-eslint/no-unsafe-return
*/

import type { traverseChildren } from './traverse/traverseChildren';
import type { traverseLeaves } from './traverse/traverseLeaves';
import type { traverseLeavesAssign } from './traverse/traverseLeavesAssign';
import type { traverseLeavesCompare } from './traverse/traverseLeavesCompare';
import type { traverseLeavesMap } from './traverse/traverseLeavesMap';
import type { traverseLeavesPair } from './traverse/traverseLeavesPair';

/**
 * @deprecated Use
 *   {@linkcode traverseChildren}/{@linkcode traverseLeaves}/{@linkcode traverseLeavesAssign}/{@linkcode traverseLeavesCompare}/{@linkcode traverseLeavesMap}/{@linkcode traverseLeavesPair}
 *   instead
 */
export class WalkUtility {
	public static walkAlongChildren<T>(
		object: T,
		childKey: keyof T,
		callback: (object: T[typeof childKey]) => boolean,
	) {
		if (typeof object[childKey] !== 'object') {
			return;
		}

		const keys = Object.keys(object[childKey] as any);

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			// @ts-expect-error obj[string]
			const value = object[childKey][key];

			if (callback(value)) {
				this.walkAlongChildren(value, childKey, callback);
			}
		}
	}

	public static walkAndReturnObject(
		object: any,
		callback: (object: any) => any,
	) {
		if (typeof object !== 'object') {
			return callback(object);
		}

		const keys = Object.keys(object as Record<any, any>);
		const result: Record<string, any> = {};

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			const value = object[key];

			result[key] = this.walkAndReturnObject(value, callback);
		}

		return result;
	}

	public static walkAndReturnVoid<
		T extends Record<string | number | symbol, any>,
	>(
		object: T,
		callback: (
			leaf: T[keyof T],
			key?: keyof typeof object,
			parent?: typeof object[keyof typeof object],
		) => void,
		key?: keyof typeof object,
		parent?: typeof object[keyof typeof object],
	) {
		if (typeof object !== 'object') {
			callback(object, key, parent);

			return;
		}

		const keys = Object.keys(object as Record<any, any>);

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			const value = object[key];

			this.walkAndReturnVoid(
				value,
				callback,
				key,
				object as typeof object[keyof typeof object],
			);
		}
	}

	public static mirror<T extends Record<string, any>>(from: T, to: T) {
		for (const key in from) {
			if (!Object.prototype.hasOwnProperty.call(from, key)) {
				continue;
			}

			const fromValue = from[key];

			if (fromValue === null || typeof fromValue !== 'object') {
				to[key] = fromValue;

				continue;
			}

			if (to[key] === null || typeof to[key] !== 'object') {
				// @ts-expect-error obj[string]
				to[key] =
					(fromValue as any[]).constructor === Array
						? []
						: (fromValue as Record<any, any>).constructor === Object
						? {}
						: // not a POJO/POJA, just copy ref
						  fromValue;
			}

			this.mirror(fromValue, to[key]);
		}
	}

	// TODO: separate this into another utility
	public static walkAndCompare<
		T1 extends Record<string, any>,
		T2 extends Record<string, any>,
	>(
		obj1: T1,
		obj2: T2,
		comparator: (
			v1: T1[keyof T1],
			v2: T2[keyof T2],
			key: keyof T1,
		) => boolean,
	): boolean {
		for (const key in obj1) {
			if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
				continue;
			}

			// is leaf node
			if (obj1[key] === null || typeof obj1[key] !== 'object') {
				if (!comparator(obj1[key], obj2[key], key)) {
					return false;
				}

				continue;
			}

			// if false return false, else continue onto next loop iteration
			if (!this.walkAndCompare(obj1[key], obj2[key], comparator)) {
				return false;
			}
		}

		return true;
	}
}
