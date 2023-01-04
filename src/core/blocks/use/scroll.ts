export const scroll = (
	node: HTMLElement,
	callback: (scroll: { x: number; y: number }) => void,
) => {
	const onScroll = () => {
		callback({
			x: node.scrollLeft,
			y: node.scrollTop,
		});
	};

	node.addEventListener('scroll', onScroll);

	return {
		destroy() {
			node.removeEventListener('scroll', onScroll);
		},
	};
};
