export const resize = (
	node: HTMLElement,
	callback: (rect: { width: number; height: number }) => void,
) => {
	const observer = new ResizeObserver((entries) => {
		for (const {
			contentBoxSize: [{ inlineSize: width, blockSize: height }],
		} of entries)
			callback({ width, height });
	});

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
};
