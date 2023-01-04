<script lang="ts">
	import {
		ic_delete,
		ic_edit,
		ic_expand_less,
		ic_expand_more,
	} from 'maic/two_tone';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Svg from '../composable/Svg.svelte';

	const dispatch = createEventDispatcher();

	type T = $$Generic;

	export let key: string;
	export let value: T;
	export let isDeleteable = true;

	let observer: MutationObserver | undefined;
	let isExpanded = false;

	let editSpan: HTMLSpanElement | undefined;
	let chipSpan: HTMLSpanElement | undefined;

	const keyToValue = new Map<string, T>();

	onMount(() => {
		if (editSpan) {
			observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					keyToValue.set(key, mutation.target.textContent as T);
					dispatch('change', {
						key,
						value: mutation.target.textContent ?? '',
					});
				}
			});
			observer.observe(editSpan, { characterData: true, subtree: true });
		}
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<div
	component="<KeyValue>"
	class="component"
>
	<p>
		<span
			class="key"
			on:keydown={({ currentTarget }) => {
				currentTarget.click();
			}}
			on:click={() => {
				chipSpan?.click();
			}}><b>{key}</b></span
		>
		&nbsp;{#if typeof value !== 'object'}&nbsp;=&nbsp;&nbsp;{/if}
		{#if typeof value !== 'object'}
			<span
				class="value chip"
				bind:this={chipSpan}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === 'Escape') {
						e.preventDefault();
						if (editSpan) {
							editSpan.blur();
							window.getSelection()?.removeAllRanges();
						}
					}
				}}
				on:click={() => {
					if (editSpan) {
						editSpan.focus();
						const range = document.createRange();
						range.selectNodeContents(editSpan);
						const sel = window.getSelection();
						sel?.removeAllRanges();
						sel?.addRange(range);
					}
				}}
			>
				<span
					contenteditable
					bind:this={editSpan}
					class="edit text"
					on:blur={() => {
						const value = keyToValue.get(key);
						if (value) {
							dispatch('submit', { key, value });
							keyToValue.delete(key);
						}
					}}>{value}</span
				>&nbsp;&nbsp;<Svg
					svg={ic_edit}
					height="0.7em"
					width="0.7em"
					colour="--colour-text-primary"
				/></span
			>
		{:else}
			<span
				class="value chip"
				bind:this={chipSpan}
				on:keydown={({ currentTarget, key }) =>
					void (key === 'Enter' && currentTarget.click())}
				on:click={() => {
					if ((isExpanded = !isExpanded))
						dispatch('expand', { key, value });
					else dispatch('collapse', { key, value });
				}}
				>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Svg
					svg={isExpanded ? ic_expand_less : ic_expand_more}
					height="0.7em"
					width="0.7em"
					colour="--colour-text-primary"
				/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
			>
		{/if}
		{#if isDeleteable}
			<span
				class="delete chip"
				on:keydown={({ currentTarget, key }) =>
					void (key === 'Enter' && currentTarget.click())}
				on:click={() => dispatch('delete', { key, value })}
				><Svg
					svg={ic_delete}
					height="0.7em"
					width="0.7em"
					colour="#ea2027"
				/></span
			>
		{/if}
		<!-- {#if typeof value === 'object'}&nbsp;=&nbsp;&nbsp;{/if} -->
	</p>
</div>

<style lang="postcss">
	.component {
		p {
			line-height: 2em;
			/* display: inline-block; */
			/* margin: 0; */

			& .key {
				/* font-style: italic; */
				display: inline-block;
				margin: 0;
				cursor: pointer;

				&:hover {
					text-decoration: dotted underline;
					text-underline-offset: 8px;
				}
			}

			& .chip {
				background: var(--colour-background-secondary);
				padding: 0 4px;
				margin: 0 2px;
				outline: solid 1px var(--colour-background-tertiary);
				border: solid 4px transparent;
				border-radius: 4px;
				white-space: pre;

				transition: background 0.3s var(--ease-fast-slow);

				&:hover {
					background: var(--colour-background-tertiary);
				}

				&:active {
					background: var(--colour-background-primary);
				}
			}

			& .value {
				/* cursor: pointer; */
				user-select: none;

				& > .edit {
					&.text {
						user-select: auto;
						cursor: text;
						text-decoration: dotted underline;
						text-underline-offset: 4px;
					}
				}
			}

			& .delete {
				/* cursor: pointer; */
				background: #3a1011;
				outline: solid 1px #521718;

				&:hover {
					background: #782224;
				}

				&:active {
					background: var(--colour-background-primary);
				}
			}
		}
	}
</style>
