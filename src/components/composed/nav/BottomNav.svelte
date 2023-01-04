<script lang="ts">
	import SvgButton from '../../composable/buttons/SvgButton.svelte';

	export let selectedNavIndex: number;
	export let navs: { icon: string; route: string }[];
</script>

<div
	component="<BottomNav>"
	class="component"
>
	<div class="background" />
	<div class="buttons">
		{#each navs as { icon, route }, i}
			<a
				href={route}
				style="--flex-grow: {selectedNavIndex === i ? 1 : 0.0001}"
			>
				<SvgButton
					svg={icon}
					width={selectedNavIndex === i ? '100%' : 56}
					roundness={selectedNavIndex === i ? 56 : 14}
					backgroundColour={selectedNavIndex === i
						? '--colour-background-secondary'
						: '--colour-background-secondary'}
					hoverBackgroundColour={selectedNavIndex === i
						? '--colour-background-primary'
						: '--colour-background-primary'}
					svgColour={selectedNavIndex === i
						? '--colour-text-primary'
						: '--colour-text-primary'}
					hoverSvgColour={selectedNavIndex === i
						? '--colour-text-primary'
						: '--colour-text-primary'}
				/>
			</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	.component {
		position: relative;

		& > .background {
			position: absolute;
			bottom: 0;

			height: 56px;
			width: 100%;
		}

		& > .buttons {
			width: 100%;
			display: flex;
			gap: 8px;
			align-items: center;
			justify-content: space-evenly;

			padding: 6px;
			box-sizing: border-box;

			background: var(--colour-background-secondary);

			& > a {
				flex-grow: var(--flex-grow);

				transition: flex-grow 0.3s var(--ease-fast-slow);
			}
		}
	}
</style>
