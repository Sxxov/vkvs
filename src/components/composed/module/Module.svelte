<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { resize } from '../../../core/blocks/use/resize';
	import {
		dropIn,
		dropOut,
		noop,
	} from '../../../core/transitioner/Transitioner';
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';
	import { Axes } from '../../composable/common/enums/Axes';
	import Svg from '../../composable/Svg.svelte';
	import type { IResResContext } from '../res-res/IResResContext';

	export let ctx: IResResContext;
	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let svg: `<svg${string}`;
	export let name: string;

	let componentDiv: HTMLDivElement;

	const dropInOnlyY = (...args: Parameters<typeof dropIn>) =>
		ctx.currAxis === Axes.Y ? dropIn(...args) : noop;

	const dropOutOnlyY = (...args: Parameters<typeof dropOut>) =>
		ctx.currAxis === Axes.Y ? dropOut(...args) : noop;

	let clientHeight: number;
	let clientWidth: number;

	let layoutSyncRafHandle:
		| ReturnType<typeof requestAnimationFrame>
		| undefined;

	onMount(() => {
		layoutSyncRafHandle = requestAnimationFrame(() => {
			// force sync layout & set clientHeight, clientWidth
			({ clientHeight, clientWidth } = componentDiv);
		});
	});

	onDestroy(() => {
		if (layoutSyncRafHandle) {
			cancelAnimationFrame(layoutSyncRafHandle);
		}
	});
</script>

<div
	component="<Module>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
	"
	use:resize={({ width, height }) => {
		clientHeight = height;
		clientWidth = width;
	}}
	bind:this={componentDiv}
>
	<div
		class="name"
		class:landscape={ctx.currAxis === Axes.Y && clientWidth <= 180}
		in:dropIn
		out:dropOut
	>
		<Svg {svg} />
		<p>{name}</p>
	</div>
	{#if clientWidth > 180}
		<div
			class="inner"
			in:dropInOnlyY
			out:dropOutOnlyY
		>
			<div class="content">
				<p class="label">when:</p>
				<slot name="hooks" />
				<hr />
				<p class="label">do:</p>
				<slot name="actions" />
			</div>
			<div class="gradient" />
		</div>
	{/if}
</div>

<style lang="postcss">
	.component {
		min-height: 56px;
		min-width: 56px;

		height: var(--height);
		width: var(--width);

		background: var(--colour-background-secondary);
		border: #fff3 solid 1px;
		border-radius: var(--roundness);
		box-sizing: border-box;

		transition: 0.3s var(--ease-fast-slow);

		overflow: hidden;
		overflow: clip;

		& > .name {
			display: flex;
			align-items: center;

			gap: 8px;

			padding: 0 14px;
			min-width: 56px;
			min-height: 56px;
			box-sizing: border-box;

			& > p {
				margin: 0;
			}

			&.landscape {
				margin-top: 21px;
				writing-mode: vertical-rl;
			}
		}

		& > .inner {
			display: flex;
			flex-direction: column;

			height: calc(100% - 56px);
			width: 100%;

			bottom: 0;

			background: #fff1;
			border: #fff3 solid 1px;
			border-radius: var(--roundness);
			box-sizing: border-box;

			overflow: hidden;

			& > .content {
				padding: 14px;

				box-sizing: border-box;

				& > hr {
					width: calc(100% - 28px);
					border: none;
					border-top: var(--colour-background-primary) 1px solid;
					margin: 8px 14px;
				}

				& > .label {
					margin: 0;
					margin-bottom: 14px;
				}
			}

			& > .gradient {
				position: absolute;

				bottom: 0;

				height: calc(100% - 56px);
				width: 100%;

				max-height: 56px;
				max-width: 100%;

				pointer-events: none;

				background: linear-gradient(
					0deg,
					var(--colour-background-secondary) 0%,
					#0000 100%
				);

				border-radius: var(--roundness);
			}
		}
	}
</style>
