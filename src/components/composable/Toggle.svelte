<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

	export let isOn = false;
	export let height: TCss = 28;
	export let width: TCss = 56;
	export let heightTrack: TCss = 28;
	export let colourBackground: TCss = '--colour-background-primary';
	export let colourTrack: TCss = '--colour-background-primary';
	export let colourKnob: TCss = '--colour-background-secondary';
	export let colourKnobHover: TCss = '--colour-background-tertiary';
	export let roundness: TCss = '--roundness';
	export let roundnessKnob: TCss = '--roundness';

	let hasMounted = false;

	onMount(() => {
		hasMounted = true;
	});

	$: dispatch('change', isOn);
	$: if (isOn) dispatch('on');
	else dispatch('off');
</script>

<div
	component="<Toggle>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
		--height-track: {css(heightTrack)};
		--colour-background: {css(colourBackground)};
		--colour-track: {css(colourTrack)};
		--border-radius: {css(roundness)};
		--left-knob: {isOn ? `calc(${css(width)} - ${css(height)})` : '0'};
	"
>
	{#if $$slots['label-left']}
		<p class="label left"><slot name="label-left" /></p>
	{/if}
	<Button
		backgroundColour={colourBackground}
		hoverBackgroundColour={colourBackground}
		{width}
		{height}
		{roundness}
		padding={hasMounted ? 0 : '0 12px'}
		justify="left"
		on:click={() => {
			isOn = !isOn;
		}}
	>
		<div class="content">
			<div class="track"><div class="content" /></div>
			<div class="knob">
				<Button
					{height}
					width={height}
					backgroundColour={colourKnob}
					hoverBackgroundColour={colourKnobHover}
					roundness={roundnessKnob}
					padding={0}
				/>
			</div>
		</div>
	</Button>
	{#if $$slots['label-left']}
		<p class="label right"><slot name="label-right" /></p>
	{/if}
</div>

<style lang="postcss">
	.component {
		display: flex;
		gap: 8px;
		align-items: center;

		& > .label {
			margin: 0;
		}

		& .content {
			& > .track {
				height: 100%;
				width: 56px;
				display: flex;
				align-items: center;

				& > .content {
					height: var(--height-track);
					width: 100%;

					background: var(--colour-track);
					border-radius: var(--border-radius);
				}
			}

			& .knob {
				position: absolute;

				left: var(--left-knob);
				top: 0;

				transition: left 0.3s var(--ease-fast-slow);
			}
		}
	}
</style>
