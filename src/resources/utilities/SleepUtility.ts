import { IncorrectUsageError } from '../errors/IncorrectUsageError';
import type { sleep } from './sleep/sleep';
import type { sleepSync } from './sleep/sleepSync';

/** @deprecated Use {@linkcode sleep}/{@linkcode sleepSync} instead */
export class SleepUtility {
	public static async sleep(ms = 0): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	public static sleepSync(ms: number): void {
		try {
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1, ms);
		} catch (_: unknown) {
			throw new IncorrectUsageError(
				'sleepSync() can only be used in later versions of node & web workers. (not on web main thread!)',
			);
		}
	}
}
