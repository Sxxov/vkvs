<script
	context="module"
	lang="ts"
>
	export const toastsW = new ArrayStore<IToast>();

	let instanceCount = 0;
</script>

<script lang="ts">
	import Hint from './Hint.svelte';
	import { dropIn, dropOut } from '../../core/transitioner/Transitioner';
	import SvgButton from './buttons/SvgButton.svelte';
	import Spacer from './Spacer.svelte';
	import { LevelColours } from './common/enums/LevelColours';
	import type { IToast } from './toast/Toast';
	import { ic_clear } from 'maic/two_tone';
	import { ArrayStore } from '../../core/blocks/store/stores/ArrayStore';
	import { onMount, onDestroy } from 'svelte';
	import { css } from '../../resources/utilities/css/css';

	const scheduledUids: string[] = [];

	onMount(() => {
		if (instanceCount > 0)
			console.warn('Encountered multiple instances of Toaster');

		++instanceCount;
	});

	onDestroy(() => {
		--instanceCount;
	});

	$: for (const toast of $toastsW) scheduleDismiss(toast.uid, toast.duration);

	function dismiss(uid: string) {
		toastsW.splice(
			toastsW.findIndex((toast) => toast.uid === uid),
			1,
		);
	}

	function scheduleDismiss(uid: string, duration: number) {
		if (scheduledUids.includes(uid)) {
			return;
		}

		if (duration < 0) {
			return;
		}

		setTimeout(() => {
			dismiss(uid);
		}, duration);

		scheduledUids.push(uid);
	}
</script>

<div
	component="<Toaster>"
	class="component"
>
	{#each $toastsW as toast}
		<Spacer height={8} />
		<div
			class="content"
			style="
				--colour-toast: {css(LevelColours[toast.level])}
			"
			in:dropIn
			out:dropOut
		>
			<Hint
				level={toast.level}
				overrideColour="--colour-text-primary"
			>
				{toast.text}
			</Hint>
			<SvgButton
				svg={ic_clear}
				backgroundColour="transparent"
				svgColour="--colour-text-primary"
				hoverBackgroundColour="#fff2"
				padding="8px 4px"
				height={32}
				shadow="var(--shadow-inner-sm), var(--shadow-sm)"
				on:click={() => {
					dismiss(toast.uid);
				}}
			/>
		</div>
	{/each}
</div>

<style lang="postcss">
	.component {
		position: fixed;

		right: 0;
		bottom: 0;

		margin: var(--padding);

		z-index: 1000;

		& > .content {
			background: var(--colour-toast);

			padding: 4px 24px;
			margin-top: 8px;

			display: flex;
			justify-content: center;
			align-items: center;
			gap: 12px;

			border-radius: var(--roundness);

			width: max-content;
			max-width: 25vw;
			max-width: min(400px, calc(100vw - var(--padding) * 2));

			box-sizing: border-box;

			float: right;

			box-shadow: var(--shadow-md), var(--shadow-inner-sm);
		}
	}
</style>
