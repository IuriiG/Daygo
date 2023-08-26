const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;

export function flushPromises() {
	return new Promise((resolve) => {
		scheduler(resolve, 0);
	});
}

export const call = (cb: () => void, times = 1) => {
	for(let i = 0; i < times; i++) cb();
};
