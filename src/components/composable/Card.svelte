<script lang="ts">
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let backgroundColour: TCss = '--colour-background-primary';
	export let backgroundShadow: TCss = '--shadow-2xl';
	export let innerShadow: TCss = '--shadow-inner-2xl';
	export let roundness: TCss = '--roundness';
	export let isClickable = true;
</script>

<div
	component="<Card>"
	class="component"
	class:clickable={isClickable}
	style="
		--height: {css(height)};
		--width: {css(width)};
		--colour-background: {css(backgroundColour)};
		--shadow-background: {css(backgroundShadow)};
		--shadow-inner: {css(innerShadow)};
		--border-radius: {css(roundness)};
	"
>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		background: var(--colour-background);
		box-shadow: var(--shadow-background);

		border-radius: var(--border-radius);

		transition: box-shadow 0.3s var(--ease-fast-slow);

		&.clickable:active {
			box-shadow: var(--shadow-none);

			& > .content {
				box-shadow: var(--shadow-inner-none);
			}
		}

		& > .content {
			height: 100%;
			width: 100%;

			border-radius: var(--border-radius);

			box-shadow: var(--shadow-inner);

			transition: box-shadow 0.3s var(--ease-fast-slow);
		}
	}
</style>
