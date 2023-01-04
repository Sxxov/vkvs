<script lang="ts">
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import Expandable from './Expandable.svelte';
	import FabRow from './FabRow.svelte';
	import type { IMod } from './mod/IMod';
	import WhenDo from './WhenDo.svelte';

	export let height: TCss = 400;
	export let width: TCss = '100%';

	export let item: IMod;
	export let isExpanded = false;
</script>

<div
	component="<Mod>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
	"
>
	<Expandable
		bind:isExpanded
		let:isExpanded
		expandedHeight={height}
		roundness={isExpanded ? '14px 14px 40px 14px' : '14px 28px 28px 14px'}
	>
		<slot
			name="name"
			slot="name"
			{item}
		>
			<span>{item.name}</span>
		</slot>
		<WhenDo
			whens={item.whens}
			dos={item.dos}
		/>
		<div class="gradient" />
		<div
			slot="overlay"
			class="buttons"
			style="--margin: {isExpanded ? 12 : 6}px;"
		>
			<FabRow
				cells={item.buttons}
				cellHeight={isExpanded ? 56 : 28}
				cellWidth={isExpanded ? 56 : 28}
				cellPadding={isExpanded ? 14 : 7}
			/>
		</div>
	</Expandable>
</div>

<style lang="postcss">
	.component {
		height: auto;
		width: var(--width);

		& .gradient {
			position: absolute;
			bottom: 0;
			height: 108px;
			width: 100%;
			background: linear-gradient(
				0deg,
				var(--colour-background-primary) 0%,
				var(--colour-background-transparent) 100%
			);
			border-radius: var(--roundness);
			pointer-events: none;
		}

		& .buttons {
			position: absolute;
			right: 0;
			bottom: 0;

			width: min-content;

			margin: var(--margin);

			transition: margin 0.2s var(--ease-fast-slow);
		}
	}
</style>
