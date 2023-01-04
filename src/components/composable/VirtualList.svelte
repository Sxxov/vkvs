<script lang="ts">
	// based on https://github.com/sveltejs/svelte-virtual-list

	import { onMount, tick, onDestroy } from 'svelte';
	import { resize } from '../../core/blocks/use/resize';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	type T = $$Generic<Record<any, any>>;

	export let items: T[];
	export let height: TCss = '100%';
	export let itemHeight: number | undefined = undefined;
	export let initialVisibleCount = 0;

	let startVisibleIndex = 0;
	let endVisibleIndex = initialVisibleCount;

	const itemHeights: number[] = [];
	const rowDivBinds: (HTMLDivElement | null)[] = [];
	let componentDiv: HTMLDivElement | undefined;
	let offsetHeight = 0;
	let isMounted = false;

	let topGapHeight = 0;
	let bottomGapHeight = 0;
	let averageHeight: number;

	onMount(() => {
		isMounted = true;
	});

	onDestroy(() => {
		isMounted = false;
	});

	$: itemIndexAndItem = items
		.slice(startVisibleIndex, endVisibleIndex)
		.map((item, i) => [i + startVisibleIndex, item] as const);

	$: rowDivs = rowDivBinds.filter(Boolean) as HTMLDivElement[];

	$: if (isMounted) {
		items;
		offsetHeight;
		itemHeight;

		void refresh();
	}

	async function refresh() {
		if (!componentDiv) return;

		const { scrollTop } = componentDiv;

		await tick(); // wait until the DOM is up to date

		let contentHeight = topGapHeight - scrollTop;
		let i = startVisibleIndex;

		while (contentHeight < offsetHeight && i < items.length) {
			const visibleIndex = i - startVisibleIndex;

			if (visibleIndex < 0 || visibleIndex >= rowDivs.length) {
				endVisibleIndex = i + 1;

				await tick(); // render the newly visible row
			}

			const row = rowDivs[visibleIndex];
			const rowHeight = itemHeight ?? row.offsetHeight;

			itemHeights[i] = rowHeight;
			contentHeight += rowHeight;
			i += 1;
		}

		endVisibleIndex = i;

		const remaining = items.length - endVisibleIndex;
		averageHeight = (topGapHeight + contentHeight) / endVisibleIndex;

		bottomGapHeight = remaining * averageHeight;
		itemHeights.length = items.length;
	}

	async function onScroll() {
		if (!componentDiv) return;

		const { scrollTop } = componentDiv;

		const prevStart = startVisibleIndex;

		for (let i = 0; i < rowDivs.length; ++i)
			itemHeights[startVisibleIndex + i] =
				itemHeight ?? rowDivs[i].offsetHeight;

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const rowHeight = itemHeights[i] || averageHeight;

			if (y + rowHeight > scrollTop) {
				startVisibleIndex = i;
				topGapHeight = y;

				break;
			}

			y += rowHeight;
			i += 1;
		}

		while (i < items.length) {
			y += itemHeights[i] || averageHeight;
			i += 1;

			if (y > scrollTop + offsetHeight) break;
		}

		endVisibleIndex = i;

		const remaining = items.length - endVisibleIndex;
		averageHeight = y / endVisibleIndex;

		while (i < items.length) itemHeights[i++] = averageHeight;
		bottomGapHeight = remaining * averageHeight;

		// prevent jumping if we scrolled up into unknown territory
		if (startVisibleIndex < prevStart) {
			await tick();

			let expectedHeight = 0;
			let actualHeight = 0;

			for (let i = startVisibleIndex; i < prevStart; i += 1) {
				if (rowDivs[i - startVisibleIndex]) {
					expectedHeight += itemHeights[i];
					actualHeight +=
						itemHeight ??
						rowDivs[i - startVisibleIndex].offsetHeight;
				}
			}

			const d = actualHeight - expectedHeight;
			componentDiv.scrollTo({
				left: 0,
				top: scrollTop + d,
				behavior: 'smooth',
			});
		}

		// TODO if we overestimated the space these
		// rows would occupy we may need to add some
		// more. maybe we can just call handle_scroll again?
	}
</script>

<div
	component="<VirtualList>"
	class="component"
	style="--height: {css(height)};"
	bind:this={componentDiv}
	on:scroll={onScroll}
	use:resize={({ height }) => {
		offsetHeight = height;
	}}
>
	<div
		class="content"
		style="
			--height-gap-top: {topGapHeight}px;
			--height-gap-bottom: {bottomGapHeight}px;
		"
	>
		{#each itemIndexAndItem as [itemIndex, item] (itemIndex)}
			<div
				class="row"
				bind:this={rowDivBinds[itemIndex]}
			>
				<slot
					{item}
					{itemIndex}
					{startVisibleIndex}
					{endVisibleIndex}
					{refresh}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.component {
		position: relative;

		height: var(--height);

		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.content {
		padding-top: var(--height-gap-top);
		padding-bottom: var(--height-gap-bottom);
	}

	.row {
		overflow: hidden;
		overflow: clip;
	}
</style>
