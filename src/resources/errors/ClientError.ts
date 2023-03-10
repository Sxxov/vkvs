export class ClientError extends Error {
	constructor(message = 'No message provided, an error with errors?') {
		super(message);
		this.name = this.constructor.name;

		// eslint is drunk
		// eslint-disable-next-line
		(Error as any).captureStackTrace?.(this, this.constructor);
	}

	public static from<T extends ClientError>(obj: IPlainError | Error): T {
		const clientError = new this();

		clientError.name = obj.name;
		clientError.message = obj.message;
		clientError.stack = obj.stack;

		return clientError as T;
	}

	public toPlainObject(): IPlainError {
		return {
			name: this.name,
			message: this.message,
			stack: this.stack,
		};
	}
}

export interface IPlainError {
	name: string;
	message: string;
	stack?: string;
}
