const onFocus = (e: Event) => {
	if (!(e.target instanceof HTMLElement)) return;

	if (e.target instanceof HTMLInputElement) {
		e.target.select();
		return;
	}

	const range = document.createRange();
	range.selectNodeContents(e.target);

	const sel = window.getSelection();

	if (!sel) return;

	sel.removeAllRanges();
	sel.addRange(range);
};

export const focusSelectAll = (node: HTMLElement) => {
	node.addEventListener('focus', onFocus);

	return {
		destroy() {
			node.addEventListener('focus', onFocus);
		},
	};
};
