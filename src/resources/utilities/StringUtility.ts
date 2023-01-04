import { IllegalArgumentError } from '../errors/IllegalArgumentError';
import { NoMatchError } from '../errors/NoMatchError';
import { EscapeUtility } from './EscapeUtility';

/** @deprecated @see {@link StringUtility} */
export enum StringModes {
	START = 'start',
	BISECT = 'bisect',
	END = 'end',
}

type TPosition = StringModes | number;

/**
 * @deprecated This class was never a good idea. String builders are an
 *   antiquated pattern, just use template literals
 */
export class StringUtility {
	public static Modes = StringModes;

	constructor(private ctx: string) {}

	public build(): string {
		return this.ctx;
	}

	public bisectBr(): string {
		return this.br(this.ctx.length / 2);
	}

	public bisect(): string {
		return this.newLine(this.ctx.length / 2);
	}

	public newLine(position: TPosition): string {
		return this.insertAt('\n', position);
	}

	public br(position: TPosition): string {
		return this.insertAt('<br>', position);
	}

	public crlf(position: TPosition): string {
		return this.insertAt('&#13;&#10;', position);
	}

	public splice(start: number, length: number, item = '') {
		return `${this.ctx.substr(0, start)}${item}${this.ctx.substr(
			start + length,
		)}`;
	}

	public insertAt(substr: string, position: TPosition): string {
		return `${this.ctx.substring(
			this.getModePosition(StringModes.START),
			this.getPosition(position),
		)}${substr}${this.ctx.substring(
			this.getPosition(position),
			this.getModePosition(StringModes.END),
		)}`;
	}

	public splitAt(matcher: string | RegExp, eat = false): string[] {
		if (typeof matcher === 'string') {
			matcher = new RegExp(EscapeUtility.escapeRegex(matcher));
		}

		const match = matcher.exec(this.ctx);

		if (match == null) {
			throw new NoMatchError(
				`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`,
			);
		}

		const position = match.index;

		return [
			this.ctx.substring(
				this.getModePosition(StringModes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				position + Number(eat && match[0].length),
				this.getModePosition(StringModes.END),
			),
		];
	}

	public splitAtLast(matcher: string | RegExp, eat = false): string[] {
		if (typeof matcher === 'string') {
			matcher = new RegExp(EscapeUtility.escapeRegex(matcher), 'g');
		} else {
			matcher = new RegExp(matcher.source, 'g');
		}

		let execResult: RegExpExecArray | null = null;
		let match: RegExpExecArray | null = null;
		let position = 0;

		while ((execResult = matcher.exec(this.ctx)) != null) {
			match = execResult;
			position = execResult.index;
		}

		if (match == null) {
			throw new NoMatchError(
				`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`,
			);
		}

		return [
			this.ctx.substring(
				this.getModePosition(StringModes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				position + Number(eat && match[0].length),
				this.getModePosition(StringModes.END),
			),
		];
	}

	public splitAtIndex(position: TPosition, eat = false): string[] {
		return [
			this.ctx.substring(
				this.getModePosition(StringModes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				this.getPosition(position) + Number(eat),
				this.getModePosition(StringModes.END),
			),
		];
	}

	private getPosition(position: TPosition): number {
		switch (typeof position) {
			case 'string':
				return this.getModePosition(position);
			case 'number':
				return position;
			default:
				throw new IllegalArgumentError(
					`${position as string} is not a string or number`,
					'position',
				);
		}
	}

	private getModePosition(mode: StringModes): number {
		switch (mode) {
			case StringModes.START:
				return 0;
			case StringModes.END:
				return this.ctx.length;
			case StringModes.BISECT:
				return (() => {
					const ctxParts = this.ctx.split(' ');

					return this.ctx.indexOf(
						ctxParts[Math.floor(ctxParts.length / 2)],
					);
				})();
			default:
				throw new IllegalArgumentError(
					`${String(mode)} is not one of Modes`,
					'mode',
				);
		}
	}
}
