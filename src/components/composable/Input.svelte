<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import { css } from '../../resources/utilities/css/css';
	import { randomString } from '../../resources/utilities/random/randomString';

	// @export
	export let value = '';
	export let isFocused = false;

	export let label = 'Input';
	export let name = label;
	export let height: TCss = 56;
	export let width: TCss = '100%';
	export let buttonWidth: TCss = height;
	export let labelTop: TCss = 36;
	export let indent: TCss = 'max(var(--min-indent), var(--roundness))';
	export let minIndent: TCss = 28;
	export let hasFloatingLabel = true;
	export let floatingLabelIndent: TCss = 0;
	export let backgroundColour: TCss = '--colour-background-secondary';
	export let focusBackgroundColour: TCss = '--colour-background-primary';
	export let textColour: TCss = '--colour-text-primary';
	export let labelColour: TCss = textColour;
	export let shadow: TCss = 'var(--shadow-none), var(--shadow-inner-sm)';
	export let focusShadow: TCss = 'var(--shadow-md), var(--shadow-inner-sm)';
	export let placeholder: string | undefined = undefined;
	export let isMultiline = false;
	export let autocomplete = 'off';

	const dispatch = createEventDispatcher();

	const randomFormId = randomString();
	const randomInputId = randomString();
	let input: HTMLInputElement | HTMLTextAreaElement | undefined;

	$: if (isFocused) input?.focus();
	else input?.blur();

	function submit(): void {
		dispatch('submit', value);
	}

	function onFocus() {
		isFocused = true;
	}

	function onBlur() {
		isFocused = false;
	}

	function focus() {
		isFocused = true;
	}

	function blur() {
		isFocused = false;
	}
</script>

<div
	component="<Input>"
	class="component"
	style="
		--width: {css(width)};
		--height: {css(height)};
		--label-top: {css(labelTop)};
		--min-indent: {css(minIndent)};
		--indent: {css(indent)};
		--button-width: {css(buttonWidth)};
	"
>
	<form
		class:multiline={isMultiline}
		class:valued={value.length > 0}
		on:submit|preventDefault={() => (submit(), false)}
		id={randomFormId}
		style="
			--colour-background-active: {css(focusBackgroundColour)};
			--colour-background: {css(backgroundColour)};
			--form-valued-margin-top: {hasFloatingLabel ? 'var(--label-top)' : '0'};
			--shadow: {css(shadow)};
			--shadow-focus: {css(focusShadow)};
		"
	>
		{#if isMultiline}
			<div class="grabber" />
			<textarea
				type="text"
				form={randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				{autocomplete}
				bind:value
				bind:this={input}
				on:input
				on:focus
				on:blur
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {css(textColour)};
				"
				{...$$restProps}
			/>
		{:else}
			<input
				type="text"
				form={randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				{autocomplete}
				bind:value
				bind:this={input}
				on:input
				on:focus
				on:blur
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {css(textColour)};
				"
				{...$$restProps}
			/>
		{/if}
		<label
			for={randomInputId}
			style="
				--colour-label: {css(labelColour)};
				--indent-label-floating: {css(floatingLabelIndent)};
				--top-label-focused: {hasFloatingLabel
				? 'calc(0px - var(--label-top))'
				: 'calc((56px - 1.3em) / 2)'};
				--opacity-label-focused: {hasFloatingLabel ? 1 : 0.2};
				--opacity-label-focused-no-placeholder: {hasFloatingLabel ? 1 : 0};
				--label-focused-indent: {hasFloatingLabel
				? 'var(--indent-label-floating)'
				: 'calc(var(--indent) + var(--indent-label-floating))'};
				--label-transition-duration: {hasFloatingLabel ? '0.2s' : '0.1s'};
			"
		>
			<p>
				<slot
					name="label"
					{label}
					{isFocused}
					{value}>{label}</slot
				>
			</p>
		</label>
		<slot
			name="button"
			{focus}
			{blur}
			{submit}
			{isFocused}
			{value}
		/>
	</form>
	<slot name="hint" />
</div>

<style lang="postcss">
	.component {
		position: relative;

		/*
		 * don't collapse margins
		 * https://stackoverflow.com/a/1939980/
		 */
		padding-top: 1px;
		margin-top: -1px;

		width: var(--width);
	}

	form {
		display: flex;
		margin: 0;

		transform: matrix(1, 0, 0, 1, 0, 0);

		transition: 0.2s var(--ease-slow-slow);

		border-radius: var(--roundness);

		/* box-shadow: var(--shadow-none); */

		&:focus-within {
			margin-top: var(--form-valued-margin-top);
			/* box-shadow: var(--shadow-xl); */
		}

		&.valued {
			margin-top: var(--form-valued-margin-top);
		}

		& .button {
			width: var(--button-width);
		}

		& .text {
			height: var(--height);
			width: 100%;

			border: 0;
			outline: 0;

			background: var(--colour-background);

			padding: calc(0.65em - var(--height)) var(--indent);
			box-sizing: border-box;

			color: var(--colour-text);

			user-select: text;

			transition: color 0.2s var(--ease-slow-slow),
				box-shadow 0.2s var(--ease-slow-slow),
				background 0.2s var(--ease-slow-slow);

			box-shadow: var(--shadow);

			border-radius: var(--roundness);

			&:focus-within {
				box-shadow: var(--shadow-focus);
			}

			/* Chrome, Safari, Edge, Opera */
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}

			/* Firefox */
			&[type='number'] {
				-moz-appearance: textfield;
			}

			&::placeholder {
				color: transparent;
			}

			/* reset input */
			&:required,
			&:invalid {
				box-shadow: none;
			}

			&:focus {
				background: var(--colour-background-active);
			}
		}

		&.multiline .text {
			padding-top: calc((56px - 1.3em) / 2);
			padding-bottom: calc((56px - 1.3em) / 2);

			resize: vertical;
			min-height: 56px;

			box-sizing: border-box;
		}

		& label {
			position: absolute;
			display: block;

			/* for browsers that doesn't support the default value with 'max()' */
			text-indent: var(--min-indent);
			text-indent: var(--indent);

			cursor: text;
			top: calc((var(--height) - 1.3em) / 2);

			transition: top var(--label-transition-duration)
					var(--ease-slow-slow),
				opacity var(--label-transition-duration) var(--ease-slow-slow),
				text-indent var(--label-transition-duration)
					var(--ease-slow-slow);

			& > p {
				color: var(--colour-label);
				display: inline;

				transition: color var(--label-transition-duration)
					var(--ease-slow-slow);
			}
		}

		&.multiline label {
			top: calc((56px - 1.3em) / 2);
		}

		& .text:focus ~ label,
		& .text:not(:placeholder-shown) ~ label {
			top: var(--top-label-focused);
			opacity: var(--opacity-label-focused-no-placeholder);
			text-indent: var(--label-focused-indent);
		}

		& .text:focus:placeholder-shown ~ label {
			opacity: var(--opacity-label-focused);
		}
	}
</style>
