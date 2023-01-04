<script
	lang="ts"
	context="module"
>
	export const buttonsW = writable<
		{ icon: string; action: (e: MouseEvent) => void }[]
	>([]);
	export const toppingsW = writable<
		{ icon: string; text: string; action: (e: MouseEvent) => void }[]
	>([]);
</script>

<script lang="ts">
	import { navigating } from '$app/stores';
	import { ic_menu } from 'maic/two_tone';
	import { writable } from 'svelte/store';
	import { dropIn, dropOut } from '../../../core/transitioner/Transitioner';
	import { css } from '../../../resources/utilities/css/css';
	import Button from '../../composable/Button.svelte';
	import SvgButton from '../../composable/buttons/SvgButton.svelte';
	import Dialog from '../../composable/Dialog.svelte';

	const MAX_HEIGHT = 168;
	const MIN_HEIGHT = 94;

	export let name: string;

	let isHamburgerActive = false;
	let scrollY = 0;

	$: currHeight = Math.max(MAX_HEIGHT - scrollY, MIN_HEIGHT);
	$: if ($navigating) {
		$buttonsW = [];
		$toppingsW = [];
	}
</script>

<svelte:window bind:scrollY />

<div
	component="<TopNav>"
	class="component"
	style="
		--height: {css(currHeight)};
	"
>
	<h1
		class="name"
		style="
			--font-size: {(currHeight / MIN_HEIGHT) * 1.5 * 16}px;
		"
	>
		{name}
	</h1>
	<div class="buttons">
		{#each $buttonsW as { icon, action }}
			<SvgButton
				svg={icon}
				height={36}
				width={36}
				padding={7}
				roundness={56}
				shadow="var(--shadow-inner-sm), var(--shadow-sm)"
				hoverShadow="var(--shadow-inner-sm), var(--shadow-md)"
				svgColour="--colour-text-primary"
				hoverSvgColour="--colour-text-primary"
				backgroundColour="--colour-background-primary"
				hoverBackgroundColour="--colour-background-secondary"
				on:click={action}
			/>
		{/each}
		<div class="hamburger">
			<div
				class="button"
				class:floating={isHamburgerActive}
			>
				<SvgButton
					svg={ic_menu}
					height={36}
					width={36}
					padding={7}
					roundness={56}
					shadow="var(--shadow-inner-sm), var(--shadow-sm)"
					hoverShadow="var(--shadow-inner-sm), var(--shadow-md)"
					svgColour="--colour-text-primary"
					hoverSvgColour="--colour-text-primary"
					backgroundColour="--colour-background-primary"
					hoverBackgroundColour="--colour-background-secondary"
					on:click={() => {
						isHamburgerActive = !isHamburgerActive;
					}}
				/>
			</div>
			<div class="dialog">
				<Dialog
					backgroundColour="none"
					shadow="none"
					bind:isActive={isHamburgerActive}
					let:dismiss
					><div class="content">
						{#each $toppingsW as { icon, text, action }, i}
							<div
								class="topping"
								in:dropIn={{ delay: i * 100 }}
								out:dropOut={{ delay: i * 100 }}
							>
								<Button
									roundness={56}
									backgroundColour="--colour-background-primary"
									hoverBackgroundColour="--colour-background-secondary"
									textColour="--colour-text-primary"
									hoverTextColour="--colour-text-primary"
									on:click={(e) => {
										action(e);
										dismiss();
									}}>{text}</Button
								>
								<SvgButton
									svg={icon}
									roundness={56}
									backgroundColour="--colour-background-primary"
									hoverBackgroundColour="--colour-background-secondary"
									svgColour="--colour-text-primary"
									hoverSvgColour="--colour-text-primary"
									on:click={(e) => {
										action(e);
										dismiss();
									}}
								/>
							</div>
						{/each}
					</div></Dialog
				>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.component {
		width: 100%;
		height: var(--height);

		display: grid;
		grid-template-columns: 1fr min-content;
		align-items: center;

		padding: 24px var(--padding);
		box-sizing: border-box;

		background: linear-gradient(
			180deg,
			var(--colour-background-primary) 80%,
			var(--colour-background-transparent) 100%
		);

		& > .name {
			margin: 0;
			margin-top: -0.25em;
			font-size: var(--font-size);
			letter-spacing: -0.05em;
		}

		& > .buttons {
			display: flex;
			gap: 6px;

			& > .hamburger {
				& > .button.floating {
					position: relative;
					z-index: 102;
					transition: z-index 0.3s 0s;
				}

				& > .dialog {
					position: absolute;
					right: var(--padding);

					& .content {
						display: grid;
						grid-auto-columns: auto;
						gap: 6px;
						justify-items: end;

						& > .topping {
							width: min-content;
							display: flex;
							gap: 6px;

							padding: 6px;

							background: var(--colour-background-primary);
							box-shadow: var(--shadow-inner-sm);
							border-radius: 56px;
						}
					}
				}
			}
		}
	}
</style>
