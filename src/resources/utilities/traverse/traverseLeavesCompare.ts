export const traverseLeavesCompare = <
	T1 extends Record<string, any>,
	T2 extends Record<string, any>,
>(
	object1: T1,
	object2: T2,
	comparator = (
		leaf1: any,
		leaf2: any,
		key: string | number | symbol,
		parent1: any,
		parent2: any,
	) => leaf1 === leaf2,
) => {
	for (const [key, value] of Object.entries(object1))
		if (Object(value) === value && Object(object2[key]) === object2[key]) {
			if (!traverseLeavesCompare(value, object2[key], comparator))
				return false;
		} else if (!comparator(value, object2[key], key, object1, object2))
			return false;

	return true;
};
