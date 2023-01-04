<script lang="ts">
	import { ic_arrow_back } from 'maic/two_tone';
	import { createEventDispatcher } from 'svelte';
	import SvgButton from '../composable/buttons/SvgButton.svelte';

	const dispatch = createEventDispatcher();
</script>

<div
	component="<BottomSheetFrame>"
	class="component"
>
	<div class="handle" />
	<div class="heading">
		<SvgButton
			backgroundColour="transparent"
			shadow="none"
			svg={ic_arrow_back}
			on:click={() => {
				dispatch('back');
			}}
		/>
		<slot name="heading" />
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="postcss">
	.component {
		min-height: 100%;
		width: 100%;

		display: flex;
		flex-direction: column;

		border-radius: var(--roundness) var(--roundness) 0 0;
		background: var(--colour-background-secondary);

		overflow: hidden;
		overflow: clip;

		box-shadow: var(--shadow-inner-sm);

		& > .handle {
			position: absolute;

			height: 2px;
			padding: 4px;

			width: 100%;

			z-index: 1;

			&::after {
				content: '';
				position: absolute;
				height: 2px;
				width: 72px;
				left: 50%;
				margin-left: -36px;
				border-radius: var(--roundness);
				background: var(--colour-text-secondary);
			}
		}

		& > .heading {
			height: 56px;
			width: 100%;

			gap: 0px;
			box-sizing: border-box;

			display: flex;
			align-items: center;
		}

		& > .content {
			width: 100%;
			flex-grow: 1;

			border-radius: var(--roundness) var(--roundness) 0 0;
			background: var(--colour-background-tertiary);

			box-shadow: var(--shadow-inner-sm), var(--shadow-sm);
		}
	}
</style>
