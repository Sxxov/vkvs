<script lang="ts">
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	export let height: TCss = '16px';
	export let width: TCss = '24px';

	export let svg: `<svg${string}`;
	export let colour: TCss = '--colour-accent-primary';

	$: sizeCorrectedSvg = svg
		.replace(/(height=")\s*.*?\s*(?=")/, `$1${css(height)}`)
		.replace(/(width=")\s*.*?\s*(?=")/, `$1${css(width)}`);
</script>

<span
	component="<Svg>"
	class="component"
	style="
		--colour-svg: {css(colour)};
	"
>
	{@html sizeCorrectedSvg}
</span>

<style lang="postcss">
	.component {
		display: contents;

		/* required to prevent bug in button, where it fires a mousedown but not a click, sometimes */
		pointer-events: none;

		fill: var(--colour-svg);

		transition: fill 0.2s var(--ease-fast-slow);
	}
</style>
