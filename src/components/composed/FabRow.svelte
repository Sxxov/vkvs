<script lang="ts">
	import type { TCss } from '../../resources/utilities/css/TCss';
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import type { IFabCell } from './fab-row/IFabCell';

	export let cells: IFabCell[];
	export let cellHeight: TCss = 56;
	export let cellWidth: TCss = 56;
	export let cellPadding: TCss = 14;
</script>

<div
	component="<FabRow>"
	class="component"
>
	{#each cells as { icon, action, text }, i}
		<!-- ctrl+c ctrl+v ass workaround for svelte to correctly detect $$props.default is false -->
		{#if text}
			<div class="texted">
				<SvgButton
					svg={icon}
					height={cellHeight}
					width="100%"
					padding={cellPadding}
					roundness={56}
					transition="
					height 0.2s var(--ease-fast-slow),
					width 0.2s var(--ease-fast-slow),
					background 0.2s var(--ease-fast-slow),
					outline 0.3s var(--ease-slow-slow),
					box-shadow 0.2s var(--ease-fast-slow)
				"
					svgColour={i === cells.length - 1
						? '--colour-accent-primary'
						: '--colour-text-primary'}
					hoverSvgColour={i === cells.length - 1
						? '--colour-accent-primary'
						: '--colour-text-primary'}
					backgroundColour={i === cells.length - 1
						? '--colour-accent-secondary'
						: '--colour-background-secondary'}
					hoverBackgroundColour={i === cells.length - 1
						? '--colour-background-secondary'
						: '--colour-background-primary'}
					on:click={action}>{text}</SvgButton
				>
			</div>
		{:else}
			<SvgButton
				svg={icon}
				height={cellHeight}
				width={cellWidth}
				padding={cellPadding}
				roundness={56}
				transition="
				height 0.2s var(--ease-fast-slow),
				width 0.2s var(--ease-fast-slow),
				background 0.2s var(--ease-fast-slow),
				outline 0.3s var(--ease-slow-slow),
				box-shadow 0.2s var(--ease-fast-slow)
			"
				svgColour={i === cells.length - 1
					? '--colour-accent-primary'
					: '--colour-text-primary'}
				hoverSvgColour={i === cells.length - 1
					? '--colour-accent-primary'
					: '--colour-text-primary'}
				backgroundColour={i === cells.length - 1
					? '--colour-accent-secondary'
					: '--colour-background-secondary'}
				hoverBackgroundColour={i === cells.length - 1
					? '--colour-background-secondary'
					: '--colour-background-primary'}
				on:click={action}
			/>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.component {
		display: flex;
		gap: 8px;

		background: var(--colour-background-primary);
		border-radius: 56px;

		padding: 8px;

		box-shadow: var(--shadow-inner-sm), var(--shadow-md);

		& > .texted {
			flex-grow: 1;
		}
	}
</style>
