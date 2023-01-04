<script lang="ts">
	/* eslint-disable max-depth */
	import Colour from 'color';
	import { v4 as uuid } from 'uuid';
	import { onDestroy, onMount } from 'svelte';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import type { IColourPieSegment } from '../composable/pie/ColourPieSegment';
	import {
		ComputedPieSegment,
		type IComputedPieSegment,
	} from '../composable/pie/ComputedPieSegment';
	import { tweened } from 'svelte/motion';
	import { quintInOut, quintOut } from 'svelte/easing';

	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let segments: IColourPieSegment[];
	export let gap = 1;
	export let strokeWeight = 2;
	export let glowWeight = 10;
	export let rotation = 0;

	const enum Edges {
		TOP,
		RIGHT,
		BOTTOM,
		LEFT,
	}

	const namespaceId = uuid();
	const drawInDegTweened = tweened(0, {
		duration: 2000,
		easing: quintInOut,
		//
	});

	let clientHeight = 0;
	let clientWidth = 0;

	let updateClientHeight = NaN;
	let updateClientWidth = NaN;
	let updateRotation = NaN;
	let updateDrawInDeg = NaN;
	let updateRafHandle: ReturnType<typeof requestAnimationFrame> | undefined;

	let canvas: HTMLCanvasElement | undefined;
	let ctx: CanvasRenderingContext2D | undefined;

	$: segmentsValueSum = segments.reduce(
		(sum, segment) => sum + segment.value,
		0,
	);
	$: computedSegments = segments.reduce<
		IComputedPieSegment<IColourPieSegment>[]
	>((computeds, segment, i) => {
		const gapRad = (gap * Math.PI) / 180;
		const startRad =
			(computeds[computeds.length - 1]?.endRad ?? 0) + gapRad;

		return [
			...computeds,
			new ComputedPieSegment({
				id: `${namespaceId}::${i}`,
				startRad,
				endRad:
					startRad +
					(segment.value / segmentsValueSum) * Math.PI * 2 -
					gapRad,
				segment,
			}),
		];
	}, []);
	$: [widthDeg, heightDeg] = [
		(clientWidth / (clientHeight + clientWidth)) * 180,
		(clientHeight / (clientHeight + clientWidth)) * 180,
	];
	$: [topEndDeg, rightEndDeg, bottomEndDeg, leftEndDeg] = [
		widthDeg,
		widthDeg + heightDeg,
		widthDeg + heightDeg + widthDeg,
		widthDeg + heightDeg + widthDeg + heightDeg,
	];
	$: if (drawInDeg > 0 && clientHeight > 0 && clientWidth > 0)
		updateRafHandle = requestAnimationFrame(update);
	$: segmentAtRotation = computedSegments.find(
		({ startRad, endRad }) =>
			(Math.sign(rotation) > 0 ? 0 : -360) + (rotation % 360) >=
				(startRad * 180) / Math.PI &&
			(Math.sign(rotation) > 0 ? 0 : -360) + (rotation % 360) <
				(endRad * 180) / Math.PI + gap,
	)?.segment;
	$: drawInDeg = $drawInDegTweened;

	onMount(() => {
		ctx = canvas!.getContext('2d')!;

		void drawInDegTweened.set(360);
	});

	onDestroy(() => {
		if (updateRafHandle) {
			cancelAnimationFrame(updateRafHandle);
		}
	});

	function update() {
		updateRafHandle = requestAnimationFrame(update);

		if (
			!ctx ||
			(updateRotation === rotation &&
				updateDrawInDeg === drawInDeg &&
				updateClientHeight === clientHeight &&
				updateClientWidth === clientWidth)
		)
			return;

		ctx.clearRect(0, 0, clientWidth, clientHeight);

		for (let i = 0, l = computedSegments.length; i < l; ++i) {
			const { startRad, endRad, segment } = computedSegments[i];

			ctx.shadowColor = segment.colour;
			ctx.shadowBlur = glowWeight;

			const startDeg =
				(startRad * 180) / Math.PI + (((rotation % 360) + 360) % 360);
			const endDeg =
				(endRad * 180) / Math.PI + (((rotation % 360) + 360) % 360);

			let prevVertex: readonly [x: number, y: number] | undefined;

			rollover: for (let i = 0; ; ++i)
				for (const [edge, deg] of [
					[Edges.TOP, topEndDeg],
					[Edges.RIGHT, rightEndDeg],
					[Edges.BOTTOM, bottomEndDeg],
					[Edges.LEFT, leftEndDeg],
				]) {
					const curr = i * 360;
					const currDeg = curr + deg;

					if (startDeg - curr > drawInDeg) break;

					if (!prevVertex && startDeg < currDeg)
						prevVertex = resolveEdgeXy(
							edge,
							Math.min(startDeg - curr, drawInDeg),
						);

					if (prevVertex) {
						const currVertex = resolveEdgeXy(
							edge,
							Math.min(endDeg - curr, drawInDeg),
						);

						const gradient = ctx.createLinearGradient(
							prevVertex[0],
							prevVertex[1],
							currVertex[0],
							currVertex[1],
						);
						const { colour } = segment;
						const lightened = Colour(colour).lighten(0.3).hex();

						gradient.addColorStop(0, lightened);
						gradient.addColorStop(0.5, colour);
						gradient.addColorStop(1, lightened);

						ctx.fillStyle = gradient;

						ctx.fillRect(
							...resolveEdgeRect(
								edge,
								prevVertex,
								currVertex,
								strokeWeight,
								// +
								// ((1 - segment.value / segmentsValueMax) *
								// 	20 *
								// 	(Math.sin(
								// 		((startDeg * Math.PI) / 180) * 3 +
								// 			((rotation * Math.PI) / 180) *
								// 				5,
								// 	) +
								// 		1)),
							),
						);

						prevVertex = currVertex;

						if (endDeg < currDeg) break rollover;
					}
				}
		}

		updateRotation = rotation;
		updateDrawInDeg = drawInDeg;
		updateClientHeight = clientHeight;
		updateClientWidth = clientWidth;
	}

	function resolveEdgeXy(
		edge: Edges,
		deg: number,
	): readonly [x: number, y: number] {
		switch (edge) {
			case Edges.TOP:
				return [
					Math.min(Math.max(deg / widthDeg, 0), 1) * clientWidth,
					0,
				] as const;
			case Edges.RIGHT:
				return [
					clientWidth,
					Math.min(Math.max((deg - topEndDeg) / heightDeg, 0), 1) *
						clientHeight,
				] as const;
			case Edges.BOTTOM:
				return [
					Math.min(
						Math.max(1 - (deg - rightEndDeg) / widthDeg, 0),
						1,
					) * clientWidth,
					clientHeight,
				] as const;
			case Edges.LEFT:
				return [
					0,
					Math.min(
						Math.max(1 - (deg - bottomEndDeg) / heightDeg, 0),
						1,
					) * clientHeight,
				] as const;
			default:
				console.warn(`Unknown edge: ${edge}`);
				return [0, 0] as const;
		}
	}

	function resolveEdgeRect(
		edge: Edges,
		[x1, y1]: readonly [x: number, y: number],
		[x2, y2]: readonly [x: number, y: number],
		strokeWeight = 0,
	): readonly [x: number, y: number, w: number, h: number] {
		switch (edge) {
			case Edges.TOP:
				return [x1, y1, x2 - x1, y2 - y1 + strokeWeight] as const;
			case Edges.RIGHT:
				return [
					x1 - strokeWeight,
					y1,
					x2 - x1 + strokeWeight,
					y2 - y1,
				] as const;
			case Edges.BOTTOM:
				return [
					x1,
					y1 - strokeWeight,
					x2 - x1,
					y2 - y1 + strokeWeight,
				] as const;
			case Edges.LEFT:
				return [x1, y1, x2 - x1 + strokeWeight, y2 - y1] as const;
			default:
				console.warn(`Unknown edge: ${edge}`);
				return [0, 0, 0, 0] as const;
		}
	}

	function resolveDifferenceDeg(deg1: number, deg2: number) {
		return ((((deg2 - deg1 + 180) % 360) + 360) % 360) - 180;
	}

	function resolveDifferenceRad(rad1: number, rad2: number) {
		return (
			((((rad2 - rad1 + Math.PI / 2) % Math.PI) + Math.PI) % Math.PI) -
			Math.PI / 2
		);
	}
</script>

<div
	component="<FramePie>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
		
	"
	bind:clientHeight
	bind:clientWidth
>
	<canvas
		bind:this={canvas}
		height={clientHeight}
		width={clientWidth}
	/>
	<slot {segmentAtRotation} />
</div>

<style lang="postcss">
	.component {
		height: var(--height);
		width: var(--width);

		& > canvas {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>
