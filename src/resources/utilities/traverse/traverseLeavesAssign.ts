/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment
*/

import { IllegalInvocationError } from '../../errors';

export const traverseLeavesAssign = <T extends Record<any, any>>(
	from: T,
	to: Record<any, any> = {},
	instantiator = (
		fromClass: new (...args: any[]) => Record<any, any>,
		fromLeaf: Record<any, any>,
		toLeaf: any,
		key: string | number | symbol,
		fromParent: any,
		toParent: any,
	): any => {
		throw new IllegalInvocationError(
			`Attempted to assign class instance to mismatched object when traversing, without providing an instantiator`,
		);
	},
): T => {
	for (const [key, value] of Object.entries(from))
		if (Object(value) === value)
			traverseLeavesAssign(
				value,
				Object(to[key]) === to[key]
					? to[key]
					: value.constructor === Array
					? []
					: value.constructor === Object
					? {}
					: instantiator(
							value.constructor,
							value,
							to[key],
							key,
							from,
							to,
					  ),
			);
		else to[key] = value;

	return to;
};
