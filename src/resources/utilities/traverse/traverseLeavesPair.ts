export const traverseLeavesPair = <T extends Record<any, any>>(
	object1: T,
	object2: T,
	callback: (
		leaf1: any,
		leaf2: any,
		key: string | number | symbol,
		parent1: any,
		parent2: any,
	) => void | boolean,
) => {
	for (const [key, value] of Object.entries(object1))
		if (Object(value) === value)
			traverseLeavesPair(value, object2[key], callback);
		else {
			const ret = callback(value, object2[key], key, object1, object2);

			if (ret !== undefined && !ret) break;
		}
};
