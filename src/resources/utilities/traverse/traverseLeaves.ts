export const traverseLeaves = (
	object: any,
	callback: (
		leaf: any,
		key: string | number | symbol,
		parent: any,
	) => void | boolean,
) => {
	for (const [key, value] of Object.entries(object))
		if (Object(value) === value) traverseLeaves(value, callback);
		else {
			const ret = callback(value, key, object);

			if (ret !== undefined && !ret) break;
		}
};
