<script lang="ts">
	import Button from '../composable/Button.svelte';
	import Spacer from '../composable/Spacer.svelte';
	import Svg from '../composable/Svg.svelte';
	import { ic_expand_less, ic_expand_more } from 'maic/two_tone';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { Axes } from '../composable/common/enums/Axes';
	import { resize } from '../../core/blocks/use/resize';

	export let isExpanded = false;
	export let width: TCss = '100%';
	export let expandedHeight: TCss = 400;
	export let roundness: TCss = '--roundness';
	export let expanderColour: TCss = '--colour-background-secondary';
	export let hoverExpanderColour: TCss = '--colour-background-primary';
	export let expandedColour: TCss = '--colour-background-tertiary';

	let expanderHeight = 24;
</script>

<div
	component="<Expandable>"
	class="component"
	style="
		--height-expander: {expanderHeight}px;
		--height: {isExpanded
		? `calc(${css(expandedHeight)} + var(--height-expander) + 32px + 2px)`
		: 'calc(var(--height-expander) + 32px + 2px)'};
		--height-expanded: {css(expandedHeight)};
		--width: {css(width)};
		--border-radius: {css(roundness)};
	"
>
	<Button
		backgroundColour={expanderColour}
		hoverBackgroundColour={hoverExpanderColour}
		width="100%"
		height="100%"
		shadow="none"
		hoverShadow="none"
		transition="
			background 0.2s var(--ease-fast-slow),
			outline 0.3s var(--ease-slow-slow),
			box-shadow 0.2s var(--ease-fast-slow),
			height 0.3s var(--ease-fast-slow),
			border-radius 0.3s var(--ease-slow-slow)
		"
		{roundness}
		justify="left"
		on:click={() => {
			isExpanded = !isExpanded;
		}}
	>
		<div class="expander">
			<div
				class="content"
				use:resize={({ height }) => {
					expanderHeight = height;
				}}
			>
				<Svg
					svg={isExpanded ? ic_expand_less : ic_expand_more}
					height="1rem"
					width="1rem"
					colour="--colour-text-primary"
				/>
				<Spacer
					width={16}
					direction={Axes.HORIZONTAL}
				/>
				<p>
					<slot
						name="name"
						{isExpanded}
					/>
				</p>
			</div>
		</div>
	</Button>
	<div
		class="expanded"
		style="
			--colour-expanded: {css(expandedColour)};
			--height-curr: {isExpanded ? css(expandedHeight) : '0px'}
		"
	>
		<div class="content">
			<slot {isExpanded} />
		</div>
	</div>
	<slot name="overlay" />
</div>

<style lang="postcss">
	.component {
		position: relative;
		width: var(--width);
		height: var(--height);

		transition: height 0.3s var(--ease-fast-slow);

		& .expander {
			height: 100%;
			width: 100%;

			& > .content {
				width: 100%;
				min-height: 24px;

				/* box-sizing: border-box; */
				/* padding: 16px 24px; */

				display: flex;
				align-items: center;

				& > p {
					font-size: 1rem;
					margin: 0;
				}
			}
		}

		& .expanded {
			height: calc(var(--height-curr) + var(--height-expander) + 32px);
			width: 100%;

			position: absolute;
			bottom: 0px;
			left: 0;

			border-radius: var(--border-radius);

			pointer-events: none;

			overflow: hidden;
			overflow: clip;

			box-shadow: var(--shadow-lg);

			transition: height 0.3s var(--ease-fast-slow),
				border-radius 0.3s var(--ease-slow-slow);

			& > .content {
				position: relative;
				top: calc(var(--height-expander) + 32px);

				height: var(--height-expanded);
				width: calc(100% - 2px);

				margin: 1px;
				box-sizing: border-box;

				background: var(--colour-expanded);

				border-radius: var(--border-radius);
				/* box-shadow: var(--shadow-inner-sm); */

				pointer-events: auto;
			}
		}
	}
</style>
