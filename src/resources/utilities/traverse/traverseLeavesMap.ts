/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment
*/

export const traverseLeavesMap = (
	object: any,
	callback: (leaf: any, key: string | number | symbol, parent: any) => any,
) => {
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(object))
		result[key] =
			Object(value) === value
				? traverseLeavesMap(value, callback)
				: callback(value, key, object);

	return result;
};
