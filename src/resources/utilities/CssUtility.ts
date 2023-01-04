import { IncorrectUsageError, UnexpectedValueError } from '../errors';
import { WindowUtility } from './WindowUtility';
import type { css } from './css/css';
import type { uncss } from './css/uncss';
import type { TCss } from './css/TCss';

/** @deprecated Use {@linkcode TCss} instead */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type Css = string | number;

/** @deprecated Use {@linkcode css}/{@linkcode uncss} instead */
export class CssUtility {
	public static parse(value: TCss): string {
		switch (true) {
			case typeof value === 'number':
			case this.isNumber(value):
				return `${value}px`;
			case (value as string).startsWith('--'):
				return `var(${value})`;
			default:
				return value as string;
		}
	}

	public static unparse(value: string, ctx?: HTMLElement): number {
		switch (true) {
			case value == null:
				return 0;
			case this.isNumber(value):
				return Number(value);
			case value.endsWith('%'):
				this.assertCtx(ctx);

				return ctx.clientWidth * (Number.parseFloat(value) / 100);
			case this.isSingularValue(value, 'px'):
				return Number.parseFloat(value);
			case this.isSingularValue(value, 'vh'):
				return (
					(this.getSinglularValue(value, 'vh') *
						WindowUtility.viewport.height) /
					100
				);
			case this.isSingularValue(value, 'vw'):
				return (
					this.getSinglularValue(value, 'vw') *
					WindowUtility.viewport.width
				);
			case this.isSingularValue(value, 'vmax'):
				return Math.max(
					WindowUtility.viewport.height,
					WindowUtility.viewport.width,
				);
			case this.isSingularValue(value, 'vmin'):
				return Math.min(
					WindowUtility.viewport.height,
					WindowUtility.viewport.width,
				);
			case value.startsWith('var(--'):
				return Number(this.getVariable(value, ctx));
			default:
				this.assertCtx(ctx);

				return this.getComputed(value, ctx);
		}
	}

	public static tryUnparse(value: string, ctx?: HTMLElement) {
		try {
			return this.unparse(value, ctx);
		} catch {
			return NaN;
		}
	}

	public static getVariable(
		variable: string,
		ctx: HTMLElement = document.documentElement,
	): string {
		return getComputedStyle(ctx)
			.getPropertyValue(variable.replace(/^var\(/, '').replace(/\)$/, ''))
			.trim();
	}

	public static isSingularValue(value: string, suffix: string): boolean {
		return !Number.isNaN(this.getSinglularValue(value, suffix));
	}

	public static getComputed(value: string, ctx: HTMLElement): number {
		// @ts-expect-error use fake css prop to compute value
		ctx.style.x = value;

		// @ts-expect-error use fake css prop to compute value
		const result = Number.parseFloat(getComputedStyle(ctx).x);

		// @ts-expect-error use fake css prop to compute value
		delete ctx.style.x;

		if (Number.isNaN(result)) {
			throw new UnexpectedValueError('result === NaN');
		}

		return result;
	}

	private static assertCtx(ctx: HTMLElement | undefined): asserts ctx {
		if (ctx != null) {
			return;
		}

		throw new IncorrectUsageError(`ctx === ${String(ctx)}`);
	}

	private static getSinglularValue(value: string, suffix: string) {
		return Number(value.replace(new RegExp(`${suffix}$`), ''));
	}

	private static isNumber(value: unknown): boolean {
		return !Number.isNaN(Number(value));
	}
}
