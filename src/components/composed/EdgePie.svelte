<script lang="ts">
	import { v4 as uuid } from 'uuid';
	import { Bezier } from '../../resources/utilities/bezier/Bezier';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import type { IColourPieSegment } from '../composable/pie/ColourPieSegment';
	import {
		ComputedPieSegment,
		type IComputedPieSegment,
	} from '../composable/pie/ComputedPieSegment';

	import PiePath from '../composable/pie/PiePath.svelte';

	export let height: TCss = '100%';
	export let width: TCss = '100%';
	export let segments: IColourPieSegment[];
	export let gap = 1;
	export let minStrokeWeight = 5;
	export let maxStrokeWeight = 5;
	export let rotation = 0;

	const RADIUS = 100;
	const clipRadius = Math.hypot(RADIUS, RADIUS);
	const namespaceId = uuid();

	$: gapRad = (gap * Math.PI) / 180;
	$: segmentsValueSum = segments.reduce(
		(sum, segment) => sum + segment.value,
		0,
	);
	$: computedSegments = segments.reduce<
		IComputedPieSegment<IColourPieSegment>[]
	>((computeds, segment, i) => {
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

	function resolveStrokeWeight(
		rotation: number,
		startRad: number,
		endRad: number,
	) {
		const [startDeg, endDeg] = [
			(startRad * 180) / Math.PI,
			(endRad * 180) / Math.PI,
		];

		const rotationNeg = (360 - rotation) % 360;
		const bezier = new Bezier(1, 0, 1, 0);
		const midDeg = (startDeg + endDeg) / 2;
		const delta = Math.abs(
			differenceBetweenAngles(midDeg + 180, rotationNeg),
		);

		return (
			bezier.at(delta / 180) * (maxStrokeWeight - minStrokeWeight) +
			minStrokeWeight
		);
	}

	function differenceBetweenAngles(angle1: number, angle2: number) {
		const diff = ((angle2 - angle1 + 180) % 360) - 180;
		return diff < -180 ? diff + 360 : diff;
	}
</script>

<div
	component="<EdgePie>"
	class="component"
	style="
		--height: {css(height)};
		--width: {css(width)};
	"
>
	<svg
		component="<Pie>"
		height="100%"
		width="100%"
		viewBox="0 0 {RADIUS * 2} {RADIUS * 2}"
		preserveAspectRatio="none"
	>
		{#each computedSegments as { id, startRad, endRad, segment }}
			<clipPath id="{id}::clip">
				<PiePath
					x={RADIUS - clipRadius}
					y={RADIUS - clipRadius}
					radius={clipRadius}
					{startRad}
					{endRad}
					rotation={rotation - 90}
					fill="none"
				/>
			</clipPath>
			<rect
				x={0}
				y={0}
				height={RADIUS * 2}
				width={RADIUS * 2}
				clip-path="url(#{id}::clip)"
				fill="none"
				stroke={css(segment.colour)}
				stroke-width={resolveStrokeWeight(rotation, startRad, endRad)}
				vector-effect="non-scaling-stroke"
			/>
		{/each}
	</svg>
</div>

<style lang="postcss">
	.component {
		position: relative;
		height: var(--height);
		width: var(--width);

		& > svg {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>
