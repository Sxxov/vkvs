<script lang="ts">
	import { Axes } from '../../composable/common/enums/Axes';
	import type { IResResContext } from './IResResContext';

	export let i: number;
	export let ctx: IResResContext;

	$: diffFromBigStart = i - ctx.position;
	$: diffFromBigEnd = i - (ctx.position + ctx.bigCount);

	$: sizePx =
		diffFromBigStart < 0
			? Math.abs(diffFromBigStart) > ctx.smallCount - 1
				? // top stacked
				  Math.max(ctx.smallCount - Math.abs(diffFromBigStart), 0) *
				  ctx.smallSizePx
				: // top small
				  (1 - Math.min(Math.abs(diffFromBigStart), 1)) *
						(ctx.bigSizePx - ctx.smallSizePx) +
				  ctx.smallSizePx
			: diffFromBigStart > ctx.bigCount
			? diffFromBigEnd > ctx.smallCount - 1
				? // bottom stacked
				  Math.max(ctx.smallCount - diffFromBigEnd, 0) * ctx.smallSizePx
				: //   0
				  // bottom small
				  // (1 - Math.min(diffFromBigEnd, 1)) *
				  ctx.smallSizePx
			: // ctx.smallSizePx
			  // big
			  Math.min(Math.abs(diffFromBigEnd), 1) *
					(ctx.bigSizePx - ctx.smallSizePx) +
			  ctx.smallSizePx;
	$: gapPx =
		diffFromBigStart < 0
			? (1 -
					Math.min(
						Math.max(
							Math.abs(diffFromBigStart) -
								(ctx.smallCount + ctx.stackedCount - 2),
							0,
						),
						1,
					)) *
			  ctx.gapSizePx
			: (1 -
					Math.min(
						Math.max(
							Math.abs(diffFromBigEnd) -
								(ctx.smallCount + ctx.stackedCount),
							0,
						),
						1,
					)) *
			  ctx.gapSizePx;
</script>

<div
	component="<ResResItem>"
	class="component"
	style="
		--height: {ctx.currAxis === Axes.Y ? `${sizePx}px` : '100%'};
		--width: {ctx.currAxis === Axes.X ? `${sizePx}px` : '100%'};
		--margin: {ctx.currAxis === Axes.Y ? `${gapPx}px 0 0 0` : `0 0 0 ${gapPx}px`};
	"
>
	<slot />
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		transition: 0.3s var(--ease-fast-slow);

		margin: var(--margin);
	}
</style>
