<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import {
		dropIn,
		dropOut,
		fadeIn,
		fadeOut,
	} from '../../core/transitioner/Transitioner';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	export let isActive = false;
	export let shouldDismissOnOverlayClick = true;
	export let backgroundColour: TCss = '--colour-background-primary';
	export let shadow: TCss = '--shadow-xl';
	export let roundness: TCss = '--roundness';

	function dismiss() {
		isActive = false;
	}

	function show() {
		isActive = true;
	}
</script>

<div
	component="<Dialog>"
	class="component"
>
	{#if isActive}
		<div
			class="overlay"
			in:fadeIn
			out:fadeOut={{ easing: quintOut }}
			on:click={() => {
				if (shouldDismissOnOverlayClick) isActive = false;
			}}
		/>
		<div
			class="content"
			style="
				--colour-background: {css(backgroundColour)};
				--shadow: {css(shadow)};
				--border-radius: {css(roundness)};
			"
			in:dropIn
			out:dropOut
		>
			<div class="buttons">
				<slot name="buttons" />
			</div>
			<slot
				{isActive}
				{dismiss}
				{show}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.component {
		display: contents;

		& > .overlay {
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			z-index: 100;

			background: var(--colour-overlay);

			pointer-events: auto;
		}

		& > .content {
			position: relative;
			z-index: 101;
			background: var(--colour-background);

			border-radius: var(--border-radius);

			box-shadow: var(--shadow-inner-sm), var(--shadow);

			pointer-events: auto;

			& > .buttons {
				position: absolute;
				right: 0;
			}
		}
	}
</style>
