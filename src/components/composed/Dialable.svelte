<script lang="ts">
	import { onDestroy } from 'svelte';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { uncss } from '../../resources/utilities/css/uncss';

	export let height: TCss = 'min-content';
	export let width: TCss = 'min-content';

	let clientHeight: number;
	let clientWidth: number;

	const FRICTION_AMBIENT = 0.03;
	const FRICTION_TOUCH = 1;
	const VELOCITY_MULTIPLIER = 20;
	const INERTIA_STOP = 0.03;
	const INERTIA_MAX = 40;

	let rotation = 0;
	let velocity = 0;
	let inertia = 0;

	let componentDiv: HTMLDivElement | undefined;
	let componentRect: DOMRect | undefined;

	let swooshRafHandle: ReturnType<typeof requestAnimationFrame> | undefined;
	let touchingRafHandle: ReturnType<typeof requestAnimationFrame> | undefined;

	let isTouching = false;
	let prevEventRotation = 0;
	let eventRotation = 0;

	onDestroy(() => {
		if (swooshRafHandle) {
			cancelAnimationFrame(swooshRafHandle);
			swooshRafHandle = undefined;
		}
	});

	$: computedHeight = clientHeight ?? (uncss(String(height)) || 0);
	$: computedWidth = clientWidth ?? (uncss(String(width)) || 0);
	$: [midX, midY] = [
		(componentRect?.left ?? 0) + computedWidth / 2,
		(componentRect?.top ?? 0) + computedHeight / 2,
	];

	function onDown(event: MouseEvent | TouchEvent) {
		isTouching = true;
		velocity = 0;
		componentRect = componentDiv?.getBoundingClientRect();
		eventRotation = resolveEventRotation(resolveCoordinates(event));
		prevEventRotation = eventRotation;

		if (!touchingRafHandle) {
			touchingRafHandle = requestAnimationFrame(function onTouching() {
				setInertiaFromTouch(eventRotation);
				touchingRafHandle = requestAnimationFrame(onTouching);
			});
		}
	}

	function onUp() {
		isTouching = false;

		if (touchingRafHandle) {
			cancelAnimationFrame(touchingRafHandle);
			touchingRafHandle = undefined;
		}
	}

	function onMove(event: MouseEvent | TouchEvent) {
		if (!isTouching) return;

		eventRotation = resolveEventRotation(resolveCoordinates(event));

		if (!swooshRafHandle) {
			swooshRafHandle = requestAnimationFrame(swoosh);
		}
	}

	let prevInertiaTime = 0;
	function setInertiaFromTouch(eventRotation: number) {
		const eventRotationDelta = eventRotation - prevEventRotation;
		const timeDelta = performance.now() - prevInertiaTime;

		if (timeDelta <= 0) return;

		rotation += eventRotationDelta;
		prevEventRotation = eventRotation;
		velocity = (eventRotationDelta / timeDelta) * VELOCITY_MULTIPLIER;
		velocity -=
			velocity > 0
				? Math.min(inertia, FRICTION_TOUCH)
				: Math.max(inertia, -FRICTION_TOUCH);
		inertia = Math.max(
			Math.min(inertia + velocity / 10, INERTIA_MAX),
			-INERTIA_MAX,
		);

		prevInertiaTime = performance.now();
	}

	function onCancel(event: MouseEvent | TouchEvent) {
		onMove(event);
		onUp();
	}

	function resolveCoordinates(event: MouseEvent | TouchEvent) {
		return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
			? ([event.touches[0].pageX, event.touches[0].pageY] as const)
			: typeof MouseEvent !== 'undefined' && event instanceof MouseEvent
			? ([event.clientX, event.clientY] as const)
			: ([0, 0] as const);
	}

	function swoosh() {
		rotation += inertia;

		const sign = Math.sign(inertia);
		const shouldStop =
			inertia >= 0 ? inertia < INERTIA_STOP : inertia > -INERTIA_STOP;

		if (shouldStop) {
			inertia = 0;

			if (swooshRafHandle) {
				cancelAnimationFrame(swooshRafHandle);
				swooshRafHandle = undefined;
			}
		} else {
			inertia -= Math.sign(inertia) * FRICTION_AMBIENT;

			if (Math.sign(inertia) === sign)
				swooshRafHandle = requestAnimationFrame(swoosh);
		}
	}

	function resolveEventRotation([eventX, eventY]: readonly [number, number]) {
		return (Math.atan2(eventY - midY, eventX - midX) * 180) / Math.PI;
	}

	function spin(additionalVelocity = 5) {
		inertia += additionalVelocity;

		if (!swooshRafHandle) swooshRafHandle = requestAnimationFrame(swoosh);
	}

	function stop() {
		if (!touchingRafHandle) {
			touchingRafHandle = requestAnimationFrame(function onTouching() {
				setInertiaFromTouch(prevEventRotation);

				if (inertia !== 0)
					touchingRafHandle = requestAnimationFrame(onTouching);
			});
		}
	}
</script>

<div
	component="<Dialable>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
	"
	bind:clientHeight
	bind:clientWidth
	bind:this={componentDiv}
	on:mousedown={onDown}
	on:touchstart={onDown}
	on:mousemove={onMove}
	on:touchmove={onMove}
	on:mouseup={onUp}
	on:touchend={onUp}
	on:mouseout={onCancel}
	on:touchcancel={onCancel}
	on:blur={onUp}
>
	<slot
		{rotation}
		{inertia}
		{velocity}
		{spin}
		{stop}
	/>
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);
	}
</style>
