<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Lottie from '../Lottie.svelte';
	import type { Css } from '../../../resources/utilities';
	import type { AnimationItem } from 'lottie-web';
	import type { Readable } from 'svelte/store';

	export let isActive = false;

	export let src = '';
	export let animationData: Record<any, any> = {};
	export let hoverBackgroundColour: TCss = '#fff1';
	export let backgroundColour: TCss = '#0000';
	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let overrideColour: TCss = '';
	export let padding: TCss = '16px 16px';

	let animationR: Readable<AnimationItem>;

	$: if ($animationR?.playDirection) {
		isActive = -$animationR.playDirection > 0;
	}

	$: $animationR?.setDirection(isActive ? 1 : -1), $animationR?.play();

	const dispatch = createEventDispatcher();
</script>

<div
	component="<LottieToggleButton>"
	class="component"
>
	<Button
		{...$$restProps}
		{height}
		{width}
		{backgroundColour}
		{hoverBackgroundColour}
		{padding}
		roundness="--roundness"
		on:click={() => {
			isActive = !isActive;

			dispatch('click', isActive);
		}}
	>
		<Lottie
			{src}
			{animationData}
			{overrideColour}
			options={{
				autoplay: false,
				loop: false,
			}}
			bind:animationR
		/>
	</Button>
</div>
