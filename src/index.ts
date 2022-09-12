export type Context<R> = {
	return(value: R): never;
	onThrow(listener: (error: unknown) => void): void;
	after(listener: (result: R) => void): void;
};

export type Callback<A extends any[], R> = (this: Context<R>, ...args: A) => R;
export type ReturnOverride<R> = { set: false } | { set: true; value: R };

export function sense<A extends any[], R>(callback: Callback<A, R>): (...args: A) => R {
	return (...args: A): R => {
		const throwListeners = new Set<(error: unknown) => void>();
		const afterListeners = new Set<(result: R) => void>();

		let overridden: ReturnOverride<R> = { set: false };

		const context: Context<R> = {
			return(value) {
				overridden = {
					set: true,
					value,
				};

				// This is the only time I will ever throw something
				// that is not a class that extends Error.
				// JavaScript is a blessing and a curse.
				throw overridden;
			},

			onThrow(listener) {
				throwListeners.add(listener);
			},

			after(listener) {
				afterListeners.add(listener);
			},
		};

		try {
			const result = callback.bind(context)(...args);

			for (const after of afterListeners) {
				after(result);
			}

			return result;
		} catch (callbackOrAfterError: unknown) {
			if (callbackOrAfterError === overridden) {
				return (callbackOrAfterError as { value: R }).value;
			}

			for (const listener of throwListeners) {
				try {
					listener(callbackOrAfterError);
				} catch (listenerError: unknown) {
					if (listenerError === overridden) {
						return (listenerError as { value: R }).value;
					}

					throw listenerError;
				}
			}

			throw callbackOrAfterError;
		}
	};
}
