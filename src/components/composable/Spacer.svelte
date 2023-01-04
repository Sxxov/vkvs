<script lang="ts">
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { Axes } from './common/enums/Axes';

	export let height: TCss = 24;
	export let width: TCss = 24;
	export let direction: Axes = Axes.VERTICAL;
</script>

<div
	component="<Spacer>"
	class="component"
	style="
		--height: calc({css(direction === Axes.VERTICAL ? height : 0)});
		--width: calc({css(direction === Axes.HORIZONTAL ? width : 0)});
"
/>

<style>
	.component {
		height: var(--height);
		width: var(--width);

		user-select: none;
		pointer-events: none;
	}
</style>
