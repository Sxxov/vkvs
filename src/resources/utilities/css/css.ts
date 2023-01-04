import type { TCss } from './TCss';

export const css = (value: TCss) => {
	if (typeof value === 'number' || !Number.isNaN(Number(value)))
		return `${value}px`;

	if (value.startsWith('--')) return `var(${value})`;

	return value;
};
