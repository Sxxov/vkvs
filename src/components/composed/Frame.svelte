<script lang="ts">
	import { Ctx } from '../../core/ctx/Ctx';
	import LottieToggleButton from '../composable/buttons/LottieToggleButton.svelte';
	import HamburgerMenu from '../composable/HamburgerMenu.svelte';
	import Logo from './Logo.svelte';

	let isHamburgerActive = false;
</script>

<div
	component="<Frame>"
	class="component"
>
	<div class="hamburger">
		<HamburgerMenu
			toppings={Ctx.toppings}
			bind:isActive={isHamburgerActive}
		/>
	</div>
	<div class="content">
		<div class="logo"><Logo /></div>
		<div class="hamburger">
			<LottieToggleButton
				animationData={import(
					'../../assets/lottie/hamburger/index.json'
				)}
				width={56}
				height={56}
				bind:isActive={isHamburgerActive}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	.content {
		position: fixed;

		height: 100%;
		width: 100%;

		top: 0;
		left: 0;

		z-index: 10;

		pointer-events: none;

		display: grid;
		grid-template-areas:
			'logo _ hamburger'
			'__ __ __'
			'___ ___ ___';
		grid-template-columns: 56px 1fr auto;
		grid-template-rows: auto 1fr auto;

		padding: var(--padding);

		& * {
			pointer-events: auto;
		}

		& .hamburger {
			grid-area: hamburger;
		}
	}

	.hamburger {
		position: relative;
		z-index: 10;
	}
</style>
