<script lang="ts">
	import { ic_info, ic_done, ic_error, ic_warning } from 'maic/two_tone';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { LevelColours } from './common/enums/LevelColours';
	import { Levels } from './common/enums/Levels';
	import Svg from './Svg.svelte';

	export let level: Levels = Levels.INFO;
	export let overrideColour: TCss | undefined = undefined;

	const LevelIconSvg = [ic_info, ic_warning, ic_error, ic_done, ''] as const;

	$: colour = overrideColour ?? LevelColours[level];
</script>

<div
	component="<Hint>"
	class="component"
	on:click
>
	<span
		class:none={level === Levels.NONE}
		class="content"
	>
		{#if LevelIconSvg[level]}
			<Svg
				svg={LevelIconSvg[level]}
				width={16}
				colour={css(colour)}
			/>
		{/if}
		{#if $$slots.default}
			<p
				class="text"
				style="
				--colour: {css(colour)};
			"
			>
				<slot />
			</p>
		{/if}
	</span>
</div>

<style lang="postcss">
	.content {
		display: flex;
		align-items: center;

		gap: 12px;

		overflow: hidden;

		opacity: 1;
		min-height: calc(1rem + 2em);

		transition: 0.2s var(--ease-slow-slow);

		&.none {
			opacity: 0;
			height: 0;
		}

		& > p {
			color: var(--colour);

			transition: 0.2s var(--ease-slow-slow);
		}
	}
</style>
