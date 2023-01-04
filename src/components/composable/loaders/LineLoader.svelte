<script lang="ts">
	import { css } from '../../../resources/utilities/css/css';
	import type { TCss } from '../../../resources/utilities/css/TCss';

	export let width: TCss = '100%';
	export let strokeColour: TCss = '--colour-accent-primary';
	export let backgroundStrokeColour: TCss = '--colour-accent-secondary';
	export let strokeWeight: TCss = 1;
	export let completion = NaN;
</script>

<div
	component="<LineLoader>"
	class="component"
	style="
		--width: {css(width)};
		--weight-stroke: {css(strokeWeight)};
		--colour-stroke: {css(strokeColour)};
		--colour-stroke-background: {css(backgroundStrokeColour)};
		--completion: {Number.isNaN(completion) ? 0 : completion * 100}%;
	"
>
	<div
		class="line primary"
		class:indeterminate={completion <= 0 || Number.isNaN(completion)}
	/>
	<div
		class="line secondary"
		class:indeterminate={completion <= 0 || Number.isNaN(completion)}
	/>
</div>

<style lang="postcss">
	.component {
		position: relative;

		height: auto;
		width: var(--width);

		overflow: hidden;
		overflow: clip;

		border-radius: var(--roundness);

		& > .line {
			position: relative;

			height: var(--weight-stroke);
			width: 100%;

			background: var(--colour-stroke-background);

			&.secondary {
				position: absolute;
				top: 0;
				left: 0;
			}

			&::before {
				content: '';

				position: absolute;
				top: 0;
				left: 0;

				height: var(--weight-stroke);
				width: var(--completion);

				background: var(--colour-stroke);
				border-radius: var(--roundness);
			}

			&.indeterminate::before {
				animation: sweep 2s var(--ease-slow-slow) infinite,
					offset 10s linear infinite;

				@keyframes sweep {
					0% {
						left: 0%;
						width: 0%;
					}
					50% {
						width: 100%;
					}
					100% {
						width: 0%;
						left: 100%;
					}
				}
			}

			&.primary::before {
				animation-delay: 0s;
			}

			&.secondary::before {
				animation-delay: 5s;
			}

			@keyframes offset {
				0% {
					transform: translateX(-100%);
				}

				100% {
					transform: translateX(0%);
				}
			}
		}
	}
</style>
