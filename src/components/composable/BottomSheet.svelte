<script
	context="module"
	lang="ts"
>
	export enum BottomSheetStates {
		FULL = 0b00001,
		PEEK = 0b00010,
		IDLE = 0b00100,
		SETTLING = 0b01000,
		DRAGGING = 0b10000,
	}
</script>

<script lang="ts">
	import { resize } from '../../core/blocks/use/resize';
	import { scroll } from '../../core/blocks/use/scroll';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';

	export let state: BottomSheetStates;
	export let backgroundColour: TCss = '--colour-background-secondary';
	export let fullHeight: TCss = '100vh';
	export let peekHeight: TCss = '50vh';
	export let idleHeight: TCss = 0;
	export let threshold = 0.25;

	let currHeight: TCss;

	let fullHeightComputed = 0;
	let peekHeightComputed = 0;
	let idleHeightComputed = 0;
	let currHeightComputed = 0;

	let contentDiv: HTMLDivElement | undefined;
	let componentDiv: HTMLDivElement | undefined;

	let isDragging = false;
	let startY = NaN;
	let deltaY = 0;
	let scrollY = 0;

	$: opacity =
		currHeightComputed === 0 && peekHeightComputed === 0
			? 1
			: Math.min(currHeightComputed / peekHeightComputed, 1);
	$: canDrag = scrollY <= 0;

	$: if (state & BottomSheetStates.FULL) currHeight = fullHeight;
	else if (state & BottomSheetStates.PEEK) currHeight = peekHeight;
	else if (state & BottomSheetStates.IDLE) currHeight = idleHeight;
	else
		console.warn(
			`Encountered invalid BottomSheet state(${state.toString(2)})`,
		);

	$: if (!(state & BottomSheetStates.DRAGGING))
		if (
			(state & BottomSheetStates.PEEK &&
				currHeightComputed === fullHeightComputed) ||
			currHeightComputed === idleHeightComputed ||
			(state & BottomSheetStates.FULL &&
				currHeightComputed === peekHeightComputed) ||
			currHeightComputed === idleHeightComputed ||
			(state & BottomSheetStates.IDLE &&
				currHeightComputed === fullHeightComputed) ||
			currHeightComputed === peekHeightComputed
		)
			state &= ~BottomSheetStates.SETTLING;
		else state |= BottomSheetStates.SETTLING;

	function onDragStart(event: MouseEvent | TouchEvent) {
		isDragging = true;

		if (!canDrag) return;

		if (!hasParentElem(event.target as HTMLElement, contentDiv!)) return;

		[, startY] = resolvePageCoordinates(event);
		state |= BottomSheetStates.DRAGGING;
	}

	function onDragMove(event: MouseEvent | TouchEvent) {
		if (!isDragging) return;

		if (
			!(state & BottomSheetStates.FULL) ||
			currHeightComputed !== fullHeightComputed
		)
			event.preventDefault();

		// const { top, left, height, width } =
		// 	contentDiv!.getBoundingClientRect();

		// if (x >= left && x <= left + width && y >= top && y <= top + height)
		// 	event.preventDefault();

		if (event.currentTarget !== componentDiv) return;

		// event.preventDefault();
		event.stopImmediatePropagation();

		if (!canDrag || Number.isNaN(startY)) return;

		const [, y] = resolvePageCoordinates(event);
		deltaY = startY - y;
	}

	function onDragEnd() {
		isDragging = false;

		onDragRelease();
	}

	function onDragRelease() {
		state &= ~BottomSheetStates.DRAGGING;

		if (
			state & BottomSheetStates.PEEK &&
			deltaY > (fullHeightComputed - peekHeightComputed) * threshold
		)
			state = BottomSheetStates.FULL;
		else if (
			state & BottomSheetStates.PEEK &&
			deltaY < (idleHeightComputed - peekHeightComputed) * threshold
		)
			state = BottomSheetStates.IDLE;
		else if (
			state & BottomSheetStates.IDLE &&
			deltaY > (peekHeightComputed - idleHeightComputed) * threshold
		)
			state = BottomSheetStates.PEEK;
		else if (
			state & BottomSheetStates.FULL &&
			deltaY <
				(idleHeightComputed - fullHeightComputed) * threshold -
					peekHeightComputed
		)
			state = BottomSheetStates.IDLE;
		else if (
			state & BottomSheetStates.FULL &&
			deltaY < (peekHeightComputed - fullHeightComputed) * threshold
		)
			state = BottomSheetStates.PEEK;

		startY = NaN;
		deltaY = 0;
	}

	function resolvePageCoordinates(event: MouseEvent | TouchEvent) {
		return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
			? [event.touches[0].clientX, event.touches[0].clientY]
			: typeof MouseEvent !== 'undefined' && event instanceof MouseEvent
			? [event.clientX, event.clientY]
			: [NaN, NaN];
	}

	function hasParentElem(elem: HTMLElement, parent: HTMLElement): boolean {
		if (elem === parent) return true;

		if (elem.parentElement)
			return hasParentElem(elem.parentElement, parent);

		return false;
	}
</script>

<div
	component="<BottomSheet>"
	class="component"
	style="
		--colour-background: {css(backgroundColour)};
		--height-idle: {css(idleHeight)};
		--height-peek: {css(peekHeight)};
		--height-full: {css(fullHeight)};
		--height-curr: clamp(var(--height-idle), calc({css(
		currHeight,
	)} + {deltaY}px), var(--height-full));
	"
	bind:this={componentDiv}
	on:mousedown={onDragStart}
	on:touchstart={onDragStart}
	on:mousemove={onDragMove}
	on:touchmove={onDragMove}
	on:mouseup={onDragEnd}
	on:touchend={onDragEnd}
	on:touchcancel={onDragEnd}
	on:drag={onDragRelease}
>
	{#if !(state & BottomSheetStates.IDLE) || state & BottomSheetStates.SETTLING}
		<div
			class="underlay"
			style="
				--opacity: {opacity};
			"
			on:click={() => {
				state = BottomSheetStates.IDLE | BottomSheetStates.SETTLING;
			}}
		/>
	{/if}
	<div
		class="container"
		class:dragging={state & BottomSheetStates.DRAGGING}
		use:resize={({ height }) => {
			currHeightComputed = height;
		}}
	>
		<div
			class="content"
			style=""
			bind:this={contentDiv}
			on:scroll={onDragRelease}
			use:scroll={({ y }) => {
				scrollY = y;
			}}
		>
			<slot {state} />
		</div>
		<div class="overlay">
			<slot name="overlay" />
		</div>
	</div>
	<div
		class="sizer"
		style="--height: var(--height-full)"
		use:resize={({ height }) => {
			fullHeightComputed = height;
		}}
	/>
	<div
		class="sizer"
		style="--height: var(--height-peek)"
		use:resize={({ height }) => {
			peekHeightComputed = height;
		}}
	/>
	<div
		class="sizer"
		style="--height: var(--height-idle)"
		use:resize={({ height }) => {
			idleHeightComputed = height;
		}}
	/>
</div>

<style lang="postcss">
	.component {
		position: fixed;

		height: 100%;
		width: 100%;

		top: 0;
		left: 0;

		z-index: 10;

		pointer-events: none;

		& > .underlay {
			position: absolute;

			height: 100%;
			width: 100%;

			top: 0;
			left: 0;

			background: var(--colour-overlay);
			opacity: var(--opacity);

			pointer-events: auto;
		}

		& > .container {
			position: absolute;
			bottom: 0;
			left: 0;
			height: var(--height-curr);

			width: 100%;

			border-radius: var(--roundness) var(--roundness) 0 0;
			overflow: hidden;
			overflow: clip;
			background: var(--colour-background);

			box-shadow: 0 0 32px -1px rgb(17 24 39 / 60%);

			pointer-events: auto;
			touch-action: none;

			transition: height 0.5s var(--ease-fast-slow);

			&.dragging {
				cursor: grabbing;

				transition: none;
			}

			& > .content {
				height: var(--height-full);
				width: 100%;

				overflow: auto;
			}

			& > .overlay {
				position: absolute;

				bottom: 0;
				right: 0;
			}
		}

		& > .sizer {
			position: absolute;

			height: var(--height);

			visibility: hidden;
		}
	}
</style>
