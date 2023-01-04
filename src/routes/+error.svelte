<script lang="ts">
	import { page } from '$app/stores';
</script>

<div
	component="/+error"
	class="component"
>
	<div class="content">
		<h1>{$page.status}</h1>
		{#if $page.error}
			<p>{$page.error.message}</p>
		{/if}
	</div>
</div>

<style>
	.component {
		padding: 20vw;
		box-sizing: border-box;
		display: grid;
		height: calc(100% - 168px * 2);
		justify-items: center;
		align-items: center;
	}

	.content {
		text-align: center;
	}

	h1 {
		font-size: 4rem;
		line-height: 2;
	}
</style>
