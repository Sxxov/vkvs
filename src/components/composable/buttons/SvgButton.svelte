<script lang="ts">
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';
	import Button from '../Button.svelte';
	import { Axes } from '../common/enums/Axes.js';
	import CircleLoader from '../loaders/CircleLoader.svelte';
	import LineLoader from '../loaders/LineLoader.svelte';
	import Spacer from '../Spacer.svelte';
	import Svg from '../Svg.svelte';

	export let svgHeight: TCss = 16;
	export let svgWidth: TCss = 24;

	export let svg: `<svg${string}`;
	export let svgColour: TCss = '--colour-accent-primary';
	export let hoverSvgColour: TCss = svgColour;

	// eslint-disable-next-line @typescript-eslint/naming-convention
	type $$Props = Button['$$prop_def'] & {
		svg: typeof svg;
		svgHeight?: typeof svgHeight;
		svgWidth?: typeof svgWidth;
		svgColour?: typeof svgColour;
		hoverSvgColour?: typeof hoverSvgColour;
	};

	$: hasContent = $$slots.default && svg && svgHeight > 0 && svgWidth > 0;
</script>

<div
	component="<SvgButton>"
	class="component"
>
	<Button
		padding={$$slots.default
			? '16px max(var(--border-radius), 24px)'
			: '16px'}
		{...$$restProps}
		on:blur
		on:click
		on:focus
		on:mousedown
		on:mouseout
		on:mouseover
		on:mouseup
		on:touchend
		on:touchstart
		let:isAnimated
		let:isDisabled
		let:isFocused
		let:isHovered
		let:isPressing
	>
		<Svg
			{svg}
			height={svgHeight}
			width={svgWidth}
			colour={css(isPressing ? hoverSvgColour : svgColour)}
		/>
		{#if hasContent}
			<Spacer
				width={8}
				direction={Axes.HORIZONTAL}
			/>
		{/if}
		<div
			slot="loader"
			class="loader"
		>
			{#if hasContent}
				<LineLoader />
			{:else}
				<CircleLoader strokeWeight={5} />
			{/if}
		</div>
		<slot
			{isHovered}
			{isDisabled}
			{isAnimated}
			{isFocused}
		/>
	</Button>
</div>

<style lang="postcss">
	.component {
		display: contents;

		& .loader {
			display: flex;
			align-items: center;
			justify-content: center;

			height: 100%;
			width: 100%;
		}
	}
</style>
