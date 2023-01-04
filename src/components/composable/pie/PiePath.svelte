<script lang="ts">
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';

	export let startRad: number;
	export let endRad: number;
	export let fill: TCss;
	export let radius: number;
	export let rotation: number;
	export let x = 0;
	export let y = 0;
</script>

<path
	component="<PiePath>"
	d={`${
		//
		'M'
	} ${radius + x}, ${radius + y} ${
		//
		'L'
	} ${Math.cos(startRad) * radius + radius + x}, ${
		Math.sin(startRad) * radius + radius + y
	} ${
		//
		'A'
	} ${radius}, ${radius} 0 ${endRad - startRad > Math.PI ? 1 : 0} 1 ${
		Math.cos(endRad) * radius + radius + x
	}, ${Math.sin(endRad) * radius + radius + y} ${
		//
		'Z'
	}`}
	fill={css(fill)}
	transform="
		rotate({rotation} {radius + x} {radius + y})
	"
	{...$$restProps}
/>
