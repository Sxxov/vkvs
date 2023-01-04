<script
	lang="ts"
	context="module"
>
	import { v4 as uuid } from 'uuid';

	const RIPPLE_GRADIENT_ID = uuid();
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeIn } from '../../core/transitioner/Transitioner';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { singleton } from './common/singleton';
	import CircleLoader from './loaders/CircleLoader.svelte';
	import LineLoader from './loaders/LineLoader.svelte';
	import Ripple from './Ripple.svelte';
	import { resize } from '../../core/blocks/use/resize';

	const enum RippleConstants {
		SIZE_IN = 20,
		OPACITY_IN = 0.2,
		SIZE_MIN = 560,
		DURATION_MIN = 0,
		DURATION_MAX = 3000,
	}

	export let backgroundColour: TCss = '--colour-accent-secondary';
	export let hoverBackgroundColour: TCss = '--colour-background-secondary';
	export let rippleColour: TCss = 'white';
	export let textColour: TCss = '--colour-accent-primary';
	export let hoverTextColour: TCss = textColour;
	export let border: TCss = '';
	export let hoverBorder: TCss = '';
	export let iconSize: TCss = '1rem';
	export let width: TCss = 'max-content';
	export let roundness: TCss = '--roundness';
	export let height: TCss = 56;
	export let justify: TCss = 'center';
	export let padding: TCss = $$slots.default
		? '16px max(var(--roundness), 24px)'
		: '16px';
	export let hoverShadow: TCss = '--shadow-lg';
	export let shadow: TCss = 'var(--shadow-inner-sm), var(--shadow-md)';
	export let isFocused = false;
	export let isDisabled = false;
	export let isHovered = false;
	export let isAnimated = true;
	export let transition = isAnimated
		? 'background 0.2s var(--ease-fast-slow), outline 0.3s var(--ease-slow-slow), box-shadow 0.3s var(--ease-fast-slow), transform 0.3s var(--ease-fast-slow)'
		: 'unset';
	export let isTextInvertedAgainstBackground = false;
	export let type: 'button' | 'reset' | 'submit' = 'button';

	let button: HTMLButtonElement;
	let offsetWidth: number;
	let offsetHeight: number;

	let isPressing = false;
	let isPressed = false;
	let hasMounted = false;
	let shouldHover = true;

	let ripples: { x: number; y: number }[] = [];
	let rippleCleanupHandle: ReturnType<typeof setTimeout> | undefined;
	const {
		mount: onMountRippleGradient,
		shouldMount: shouldMountRippleGradient,
	} = singleton(RIPPLE_GRADIENT_ID);

	onMount(() => {
		hasMounted = true;

		const media = window.matchMedia('(pointer: fine)');

		({ matches: shouldHover } = media);
		media.addEventListener('change', (e) => {
			({ matches: shouldHover } = e);
		});
	});

	$: rippleSize = Math.max(
		Math.hypot(offsetWidth / 2, offsetHeight / 2) * 8,
		RippleConstants.SIZE_MIN,
	);
	$: rippleDuration = Math.min(
		Math.max(rippleSize * 4, RippleConstants.DURATION_MIN),
		RippleConstants.DURATION_MAX,
	);

	// browsers on touch screens emit a mousedown & mouseup event,
	// even on touches...
	//
	// this happens in this sequence:
	// user down
	// → touchdown (timestamp: x)
	// user up
	// → touchup (timestamp: x + touch duration)
	// → mousedown (timestamp: y)
	// → mouseup (timestamp: y)
	let isTouching = false;
	function onDown(event: MouseEvent | TouchEvent) {
		isPressing = true;

		if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
			// navigator.vibrate([2]);

			isTouching = true;
		}

		const { x: buttonX, y: buttonY } = button.getBoundingClientRect();
		const [eventX, eventY] = resolveClientCoordinates(event);
		const [rippleX, rippleY]: [number, number] = [
			eventX - buttonX,
			eventY - buttonY,
		];

		if (
			typeof MouseEvent !== 'undefined' &&
			event instanceof MouseEvent &&
			isTouching
		) {
			return;
		}

		ripples.push({
			x: rippleX,
			y: rippleY,
		}) - 1;
		ripples = ripples;

		clearTimeout(rippleCleanupHandle);
		rippleCleanupHandle = setTimeout(() => {
			ripples.length = 0;
			ripples = ripples;
		}, rippleDuration ?? 0);

		isPressed = true;
	}

	function onUp(event: MouseEvent | TouchEvent) {
		isPressing = false;
		isPressed = false;

		if (typeof MouseEvent !== 'undefined' && event instanceof MouseEvent) {
			isTouching = false;
		}
	}

	function resolveClientCoordinates(event: MouseEvent | TouchEvent) {
		return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
			? [event.touches[0].clientX, event.touches[0].clientY]
			: typeof MouseEvent !== 'undefined' && event instanceof MouseEvent
			? [event.clientX, event.clientY]
			: [NaN, NaN];
	}
</script>

<div
	component="<Button>"
	class="component"
	class:pressed={isPressed}
	class:hovered={isHovered}
	style="
		--width: {css(width)};
		--height: {css(height)};
		--border: {css(border)};
		--border-hover: {css(isAnimated ? hoverBorder : border)};
		--border-radius: {css(roundness)};
		--transition: {isAnimated ? transition : 'unset'};
		--shadow-hover: {css(hoverShadow)};
		--shadow: {css(shadow)};
	"
	on:mouseover
	on:mouseover={() => {
		if (shouldHover) isHovered = true;
	}}
	on:mouseout
	on:mouseout={() => {
		isHovered = false;
	}}
	on:focus
	on:blur
	use:resize={({ width, height }) => {
		offsetHeight = height;
		offsetWidth = width;
	}}
>
	<button
		{type}
		bind:this={button}
		style="
			--colour-background: {css(backgroundColour)};
			--colour-background-hover: {css(
			isAnimated ? hoverBackgroundColour : backgroundColour,
		)};
			--colour-ripple: {css(rippleColour)};
			--colour-text: {css(isTextInvertedAgainstBackground ? 'white' : textColour)};
			--colour-text-hover: {css(isAnimated ? hoverTextColour : textColour)};
			--button-padding: {css(padding)};
			--icon-size: {css(iconSize)};
			--justify: {justify};
			--mix-blend-mode: {isTextInvertedAgainstBackground ? 'difference' : 'unset'};
		"
		on:click
		on:focus={() => {
			isFocused = true;
		}}
		on:blur={() => {
			isFocused = false;
		}}
		on:touchstart|passive
		on:mousedown
		on:touchend|passive
		on:mouseup
		on:touchstart|passive={onDown}
		on:mousedown={onDown}
		on:touchend={onUp}
		on:mouseup={onUp}
		disabled={isDisabled}
	>
		{#if hasMounted}
			<div
				class="content"
				in:fadeIn
			>
				<slot
					{isHovered}
					{isDisabled}
					{isAnimated}
					{isFocused}
					{isPressing}
				/>
			</div>
		{:else}
			<div class="loader">
				<slot name="loader">
					{#if $$slots.default}
						<LineLoader />
					{:else}
						<CircleLoader strokeWeight={5} />
					{/if}
				</slot>
			</div>
		{/if}
		<svg>
			{#if $shouldMountRippleGradient}
				<defs use:onMountRippleGradient>
					<radialGradient id={RIPPLE_GRADIENT_ID}>
						<stop
							offset="0%"
							stop-color="var(--colour-text-transparent)"
						/>
						<stop
							offset="40%"
							stop-color="var(--colour-text-secondary)"
						/>
						<stop
							offset="80%"
							stop-color="var(--colour-text-secondary)"
						/>
						<stop
							offset="100%"
							stop-color="var(--colour-text-transparent)"
						/>
					</radialGradient>
				</defs>
			{/if}
			{#each ripples as ripple}
				<Ripple
					x={ripple.x}
					y={ripple.y}
					size={rippleSize}
					duration={rippleDuration}
					sizeIn={RippleConstants.SIZE_IN}
					opacityIn={RippleConstants.OPACITY_IN}
					fill="url(#{RIPPLE_GRADIENT_ID})"
				/>
			{/each}
		</svg>
	</button>
</div>

<style lang="postcss">
	.component {
		position: relative;

		height: var(--height);
		width: var(--width);

		border: var(--border);
		border-radius: var(--border-radius);

		/* &:focus-within {
			box-shadow: var(--shadow-none);
		} */

		&,
		& * {
			transition: var(--transition);
		}
	}

	button {
		height: 100%;
		width: 100%;

		background: var(--colour-background);
		/* border: solid 1px var(--colour-background); */
		border: none;

		transform: matrix(1, 0, 0, 1, 0, 0);
		padding: var(--button-padding);

		outline: solid 1px var(--colour-background);
		outline-offset: -1px;

		cursor: pointer;

		text-align: var(--justify);

		border-radius: var(--border-radius);
		box-sizing: border-box;

		box-shadow: var(--shadow);

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		/*
			replaces `@media (hover: none)`
			https://www.ctrl.blog/entry/css-media-hover-samsung.html
		*/
		@media (pointer: fine) {
			&:hover,
			.hovered > & {
				background: var(--colour-background-hover);
				outline: solid 1px var(--colour-background-hover);
				box-shadow: var(--shadow-inner-sm), var(--shadow-hover);

				& * {
					color: var(--colour-text-hover);
				}
			}
		}

		&:active {
			transition: var(--transition), outline 0s;
			box-shadow: var(--shadow-inner-md);
			outline: solid 1px var(--colour-text-tertiary);

			@media (pointer: coarse) {
				background: var(--colour-background-hover);

				& * {
					color: var(--colour-text-hover);
				}
			}
		}

		& * {
			color: var(--colour-text);
			mix-blend-mode: var(--mix-blend-mode);
		}

		& > .content {
			position: relative;
			height: 100%;
			width: 100%;

			display: flex;
			align-items: center;
			justify-content: var(--justify);

			user-select: none;
		}

		& > .loader {
			display: grid;
			align-items: center;
			justify-items: center;

			height: 100%;
			width: 100%;
		}

		& > svg {
			height: 100%;
			width: 100%;

			border-radius: var(--border-radius);

			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
	}
</style>
