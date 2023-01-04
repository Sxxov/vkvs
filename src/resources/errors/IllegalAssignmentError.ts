import { ClientError } from './ClientError';

export class IllegalAssignmentError extends ClientError {
	constructor(message: string, variableName?: string) {
		super(
			`Illegal assignment${variableName ? ` (to ${variableName})` : ''}${
				message ? `: ${message}` : ''
			}`,
		);
	}
}
