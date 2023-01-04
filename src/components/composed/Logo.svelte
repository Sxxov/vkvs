<script lang="ts">
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import logo from '../../assets/img/logo.svg';
	import { ic_arrow_back } from 'maic/two_tone';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let colour: TCss = '--colour-text-primary';
	export let hoverBackgroundColour: TCss = '#fff1';
	export let backgroundColour: TCss = 'transparent';
</script>

<div
	component="<Logo>"
	class="component"
>
	<SvgButton
		on:click={() => {
			void goto('/');

			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
		}}
		svg={logo}
		svgColour={colour}
		{backgroundColour}
		{hoverBackgroundColour}
		{...$$restProps}
	/>
	{#if $page.url.pathname !== '/'}
		<SvgButton
			on:click={() => {
				history.back();
			}}
			svg={ic_arrow_back}
			svgColour={colour}
			{backgroundColour}
			{hoverBackgroundColour}
			{...$$restProps}
		/>
	{/if}
</div>

<style lang="postcss">
	.component {
		height: auto;
		width: auto;
		display: flex;
	}
</style>
