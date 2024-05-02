import type { GlobalPreloadHook, InitializeHook } from 'node:module';
import type { Data } from '../api/register.js';

// eslint-disable-next-line import-x/no-mutable-exports
export let active = true;

// eslint-disable-next-line import-x/no-mutable-exports
export let namespace: string | void;

export const initialize: InitializeHook = async (
	data: Data | void,
) => {
	if (!data) {
		throw new Error('tsx must be loaded with --import instead of --loader\nThe --loader flag was deprecated in Node v20.6.0 and v18.19.0');
	}

	if (data.namespace) {
		namespace = data.namespace;
	}

	if (data.port) {
		// Unregister
		data.port.on('message', (message: string) => {
			if (message === 'deactivate') {
				active = false;
				data.port!.postMessage('deactivated');
			}
		});
	}
};

export const globalPreload: GlobalPreloadHook = () => 'process.setSourceMapsEnabled(true);';