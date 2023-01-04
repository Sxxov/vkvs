<script lang="ts">
	import { v4 as uuid } from 'uuid';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import {
		ComputedPieSegment,
		type IComputedPieSegment,
	} from './pie/ComputedPieSegment';
	import PiePath from './pie/PiePath.svelte';
	import { PieSegmentKinds } from './pie/PieSegmentKinds';
	import type { TPieSegment } from './pie/TPieSegment';

	export let segments: TPieSegment[];
	export let radius: number;
	export let strokeColour: TCss = '--colour-background-primary';
	export let strokeWeight: TCss = 0;
	export let rotation = 0;

	$: segmentsValueSum = segments.reduce(
		(sum, segment) => sum + segment.value,
		0,
	);
	$: computedSegments = segments.reduce<IComputedPieSegment<TPieSegment>[]>(
		(computeds, segment, i) => [
			...computeds,
			new ComputedPieSegment({
				id: `${uuid()}::${i}`,
				segment,
				startRad: computeds[computeds.length - 1]?.endRad ?? 0,
				endRad:
					(computeds[computeds.length - 1]?.endRad ?? 0) +
					(segment.value / segmentsValueSum) * Math.PI * 2,
			}),
		],
		[],
	);
</script>

<svg
	component="<Pie>"
	height={radius * 2}
	width={radius * 2}
>
	{#each computedSegments as { id, startRad, endRad, segment }}
		{#if segment.kind === PieSegmentKinds.IMAGE}
			<clipPath {id}>
				<PiePath
					{radius}
					{startRad}
					{endRad}
					{rotation}
					fill="none"
				/>
			</clipPath>
			<image
				href={segment.src}
				x="0"
				y="0"
				width={radius * 2}
				height={radius * 2}
				clip-path="url(#{id})"
			/>
		{:else}
			<PiePath
				{radius}
				{startRad}
				{endRad}
				{rotation}
				fill={css(segment.colour)}
			/>
		{/if}
	{/each}

	{#each computedSegments as { endRad }}
		<line
			x1={radius}
			y1={radius}
			x2={Math.cos(endRad) * radius + radius}
			y2={Math.sin(endRad) * radius + radius}
			stroke={css(strokeColour)}
			stroke-width={css(strokeWeight)}
		/>
	{/each}
</svg>
