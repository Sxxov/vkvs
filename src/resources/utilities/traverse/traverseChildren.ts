export const traverseChildren = <
	T extends Record<any, any>,
	Key extends keyof T,
>(
	object: T,
	childrenKey: Key,
	callback: (object: T[Key][number]) => void | boolean,
) => {
	if (Object(object[childrenKey]) !== object[childrenKey]) return;

	for (const value of Object.values<T[Key][number]>(object[childrenKey])) {
		const ret = callback(value);

		if (ret === undefined || ret)
			traverseChildren(value, childrenKey, callback);
	}
};
