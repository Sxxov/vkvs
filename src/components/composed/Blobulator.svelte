<script
	lang="ts"
	context="module"
>
	import { v4 as uuid } from 'uuid';

	const THRESHOLD_FILTER_ID = uuid();
</script>

<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { Transition } from '../../core/transitioner/Transition';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { singleton } from '../composable/common/singleton';

	export let height: TCss = '100%';
	export let width: TCss = '100%';

	const {
		mount: onThresholdFilterMount,
		shouldMount: shouldMountThresholdFilter,
	} = singleton(THRESHOLD_FILTER_ID);

	function blurFade(
		element: Element,
		{ delay = 0, duration = 1000, easing = quintOut } = {},
		tick?: Transition['tick'],
	): Transition {
		return Transition.from({
			delay,
			duration,
			easing,
			css: (t) => `opacity: ${0.5 + t * 0.5};
						 filter: blur(${(1 - t) * 2}px);`,
			tick,
		});
	}
</script>

<div
	component="<Blobulator>"
	class="component"
>
	{#if $shouldMountThresholdFilter}
		<defs use:onThresholdFilterMount>
			<filter id={THRESHOLD_FILTER_ID}>
				<feColorMatrix
					in="SourceGraphic"
					type="matrix"
					values="1 0 0 0 0
						0 1 0 0 0
						0 0 1 0 0
						0 0 0 255 -140"
				/>
			</filter>
		</defs>
	{/if}

	<div
		class="content"
		style="
			--height: {css(height)};
			--width: {css(width)};
			--url-filter-threshold: url(#{THRESHOLD_FILTER_ID});
		"
	>
		<slot transition={blurFade} />
	</div>
</div>

<style lang="postcss">
	.component {
		display: contents;

		.content {
			filter: var(--url-filter-threshold);
		}
	}
</style>
