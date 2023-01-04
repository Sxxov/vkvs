<script lang="ts">
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';

	export let height: TCss = '100%';
	export let width: TCss = '100%';
</script>

<div
	component="<ResResItemContent>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
	"
/>

<style lang="postcss">
	.component {
		min-height: 56px;
		min-width: 56px;

		height: var(--height);
		width: var(--width);

		transition: 0.3s var(--ease-fast-slow);

		background: red;
		border: blue solid 4px;
		box-sizing: border-box;
	}
</style>
