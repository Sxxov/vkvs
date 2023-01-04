<script lang="ts">
	import { resize } from '../../../core/blocks/use/resize';
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';
	import { Axes } from '../../composable/common/enums/Axes';
	import type { IResResContext } from './IResResContext';

	export let itemCount: number;
	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let stackedCount = 3;
	export let smallCount = 3;
	export let smallSizePx = 56;
	export let bigMinSizePx = 200;
	export let gapSizePx = 8;
	export let scrollDenominator = 100;

	let position = 0;
	let clientHeight: number;
	let clientWidth: number;
	let ctx: IResResContext;

	$: bigAvailableLayoutSize =
		(currAxis === Axes.Y ? clientHeight : clientWidth) -
		(smallCount + Math.min(position, smallCount - 1)) *
			(smallSizePx + gapSizePx) -
		(stackedCount * 2 + Math.min(position, stackedCount)) * gapSizePx;
	$: bigCount = Math.floor(bigAvailableLayoutSize / bigMinSizePx);
	$: bigSizePx = bigAvailableLayoutSize / bigCount;
	$: currAxis = clientHeight > clientWidth ? Axes.Y : Axes.X;
	$: ctx = {
		smallCount,
		stackedCount,
		bigCount,
		position,
		bigSizePx,
		smallSizePx,
		gapSizePx,
		currAxis,
	};
</script>

<div
	component="<ResResList>"
	class="component"
	style="
	--height: {css(height)};
	--width: {css(width)};
	"
	use:resize={({ width, height }) => {
		clientHeight = height;
		clientWidth = width;
	}}
>
	<div
		class="wrapper"
		style="
			--height: {currAxis === Axes.Y ? `${clientHeight}px` : '100%'};
			--width: {currAxis === Axes.X ? `${clientWidth}px` : '100%'};
			--overflow: {currAxis === Axes.Y ? 'hidden scroll' : 'scroll hidden'};
		"
		on:wheel={(e) => {
			if (currAxis === Axes.X) {
				e.preventDefault();

				let curr = 0;
				const duration = 10;
				const { currentTarget, deltaY: dest } = e;
				const delta = dest / duration;

				window.requestAnimationFrame(function raf() {
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					currentTarget.scrollLeft += delta;
					curr += delta;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					if (Math.abs(curr) < Math.abs(dest)) {
						window.requestAnimationFrame(raf);
					}
				});
			}
		}}
		on:scroll={(e) => {
			position =
				(currAxis === Axes.Y
					? e.currentTarget.scrollTop
					: e.currentTarget.scrollLeft) / scrollDenominator;
		}}
	>
		<div
			class="content"
			style="
				--height: {currAxis === Axes.Y ? '0' : '100%'};
				--width: {currAxis === Axes.X ? '0' : '100%'};
				--flow: {currAxis === Axes.Y ? 'row' : 'column'};
			"
		>
			<slot {ctx} />
		</div>
		<div
			class="padder"
			style="
				--height: {currAxis === Axes.Y
				? `${itemCount * scrollDenominator + clientHeight}px`
				: '100%'};
				--width: {currAxis === Axes.X
				? `${itemCount * scrollDenominator + clientHeight}px`
				: '100%'};
			"
		/>
	</div>
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		& > .wrapper {
			overflow: var(--overflow);

			height: var(--height);
			width: var(--width);

			& > .content {
				position: sticky;
				top: 0;
				left: 0;

				height: var(--height);
				width: var(--width);

				display: grid;
				grid-auto-flow: var(--flow);
			}

			& > .padder {
				height: var(--height);
				width: var(--width);
			}
		}
	}
</style>
