<script lang="ts">
	import { onMount } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	export let x: number;
	export let y: number;
	export let sizeIn: number;
	export let size: number;
	export let duration: number;
	export let opacityIn: number;
	export let fill: TCss;

	const rippleSize = tweened(sizeIn, { duration: duration / 3 });
	const rippleOpacity = tweened(opacityIn, {
		duration,
		easing: expoOut,
	});

	let hasFinishedTweening = false;

	onMount(async () => {
		await Promise.all([rippleSize.set(size), rippleOpacity.set(0)]);

		hasFinishedTweening = true;
	});
</script>

{#if !hasFinishedTweening}
	<circle
		style="fill: {css(fill)};"
		cx={x}
		cy={y}
		r={$rippleSize}
		opacity={$rippleOpacity}
	/>
{/if}
