<script lang="ts">
	import SvgButton from '../../composable/buttons/SvgButton.svelte';
</script>

<!-- <SvgButton width="100%" overflow="auto" /> -->

<div
	component="<ModuleItem>"
	class="component"
/>

<style lang="postcss">
	.component {
		height: 56px;
		width: 100%;

		overflow: auto;

		background: #fff1;
		border: #fff3 1px solid;
		border-radius: var(--roundness);
		box-sizing: border-box;
	}
</style>
