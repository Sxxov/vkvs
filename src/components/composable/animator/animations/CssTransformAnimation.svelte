<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Animator } from '../../../../core/animator';
	import { WhenNotAnimatingBehaviour } from '../../../../core/animator/animations/AbstractElementAnimation';
	import { CssTransformAnimation } from '../../../../core/animator/animations/CssTransformAnimation';
	import { WalkUtility } from '../../../../resources/utilities';

	export let animator: Animator;
	export let inFrame: TCssTransformAnimation['in'];
	export let length: TCssTransformAnimation['length'];
	export let transformProperty: TCssTransformAnimation['transformProperty'];
	export let value: TCssTransformAnimation['value'];
	export let whenNotAnimating: TCssTransformAnimation['whenNotAnimating'] =
		WhenNotAnimatingBehaviour.SHOW;
	export let delayPerNode = 0;

	let container: HTMLDivElement;
	let i = 0;

	onMount(() => {
		WalkUtility.walkAlongChildren(container, 'childNodes', (node) => {
			if (node instanceof HTMLElement) {
				const { display } = getComputedStyle(node);

				if (display !== 'contents') {
					animator.add(
						CssTransformAnimation.from({
							elem: node,
							in: inFrame + i++ * delayPerNode,
							length,
							transformProperty,
							value,
							whenNotAnimating,
						}),
					);

					return false;
				}
			}

			return true;
		});
	});

	onDestroy(() => {
		animator.composition.destroy();
	});
</script>

<div
	component="<CssTransformAnimation>"
	class="component"
	bind:this={container}
>
	<slot />
</div>

<style>
	.component {
		display: contents;
	}
</style>
