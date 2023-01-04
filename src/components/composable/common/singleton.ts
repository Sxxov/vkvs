import { Store } from '../../../core/blocks/store';
import { SetStore } from '../../../core/blocks/store/stores/SetStore';

const mountedKeys = new SetStore<any>();
const keyToInstances = new Map<any, number>();

export const singleton = (key: any) => {
	const shouldMount = new Store(false);
	let mountLock = false;

	const unsubscribe = mountedKeys.subscribe((v) => {
		shouldMount.set(mountLock || !v.has(key));
	});

	return {
		shouldMount,
		mount(this: void, _: Element) {
			mountLock = true;
			mountedKeys.add(key);

			keyToInstances.set(key, (keyToInstances.get(key) ?? 0) + 1);

			return {
				destroy(this: void) {
					mountLock = false;
					mountedKeys.delete(key);

					const instances = (keyToInstances.get(key) ?? 0) - 1;

					if (instances > 0) {
						keyToInstances.set(key, instances);
					} else {
						keyToInstances.delete(key);
						unsubscribe();
					}
				},
			};
		},
	};
};
