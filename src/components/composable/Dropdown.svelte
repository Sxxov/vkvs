<script
	context="module"
	lang="ts"
>
	const LoadingDropdown = Dropdown.from({
		label: true,
		svg: ic_border_clear,
		text: 'Loading, give me a bit...',
	});
	const NoItemsDropdown = Dropdown.from({
		label: true,
		svg: ic_clear,
		text: 'No items found',
	});
</script>

<script lang="ts">
	import {
		ic_border_clear,
		ic_clear,
		ic_keyboard_arrow_down,
		ic_keyboard_arrow_up,
	} from 'maic/two_tone';
	import { dropIn, dropOut } from '../../core/transitioner/Transitioner';
	import { css } from '../../resources/utilities/css/css';
	import type { TCss } from '../../resources/utilities/css/TCss';
	import SvgButton from './buttons/SvgButton.svelte';
	import { Dropdown } from './dropdown/Dropdown';
	import Input from './Input.svelte';

	export let isActive = false;
	export let items: (Promise<Dropdown> | Dropdown)[] = [];
	export let height: TCss = 56;
	export let width: TCss = 'auto';
	export let itemsHeight: TCss = 192;
	export let label = '...';
	export let chosenItem: Dropdown | undefined = undefined;

	const resolvedItems: Dropdown[] = [];
	let isBlurCancelled = false;
	let searchQuery = '';
	let currItems: Dropdown[] = resolvedItems;
	let currIndexOfSearchPhrases: number[] = [];

	for (let i = 0, l = items.length; i < l; ++i) {
		const item = items[i];

		if (item instanceof Promise) {
			resolvedItems[i] = LoadingDropdown;
			void item.then((v) => {
				resolvedItems[i] = v;
			});
		} else {
			resolvedItems[i] = item;
		}
	}

	$: if (currItems.length <= 0) {
		currItems = [getPlaceholderItem(isPending)];
	}

	$: isPending = resolvedItems.length < items.length;

	$: if (chosenItem) {
		isActive = false;
		setSearchPhrase(chosenItem.text);
	} else setSearchPhrase('');

	// sort items according to search phrase text
	$: {
		chosenItem;

		const matchingItems: Dropdown[] = [];
		const restItems: Dropdown[] = [];
		const indexOfSearchPhrases: number[] = [];

		for (const item of resolvedItems) {
			const indexOfSearchPhrase = item.text
				.toLowerCase()
				.indexOf(searchQuery.toLowerCase());

			if (indexOfSearchPhrase >= 0) {
				indexOfSearchPhrases.push(indexOfSearchPhrase);
				matchingItems.push(item);
			} else {
				restItems.push(item);
			}
		}

		currIndexOfSearchPhrases = indexOfSearchPhrases;
		currItems = [...matchingItems, ...restItems];
	}

	// prevents svelte from complaining about currItems & isPending circular dep
	function getPlaceholderItem(isPending: boolean) {
		return isPending ? LoadingDropdown : NoItemsDropdown;
	}

	function setSearchPhrase(string: string) {
		searchQuery = string;
	}

	let prevSearchPhrase = searchQuery;
	function isNewSearchPhrase() {
		if (searchQuery !== prevSearchPhrase) {
			prevSearchPhrase = searchQuery;

			return true;
		}

		return false;
	}
</script>

<div
	component="<Dropdown>"
	class="component"
>
	<Input
		bind:isFocused={isActive}
		{label}
		bind:value={searchQuery}
		{width}
		{height}
		on:focus={(e) => {
			// without this explicit `isActive = true`,
			// the bind seems to fail onfocus
			isActive = true;
			isBlurCancelled = false;

			if (isNewSearchPhrase()) {
				// @ts-expect-error no ts zone
				e.target?.setSelectionRange(0, searchQuery.length);
			}
		}}
		on:blur={(e) => {
			if (isBlurCancelled) {
				e.stopImmediatePropagation();
				isBlurCancelled = false;
			}

			if (isNewSearchPhrase()) {
				// @ts-expect-error no ts zone
				e.target?.setSelectionRange(0, searchQuery.length);
			}
		}}
		on:submit={() => {
			if (currIndexOfSearchPhrases.length > 0) {
				chosenItem = currItems[0];
			}
		}}
		hasFloatingLabel={false}
		autocomplete="off"
	>
		<div
			class="buttons"
			slot="button"
			let:focus
		>
			<SvgButton
				backgroundColour="--colour-background-secondary"
				hoverBackgroundColour="--colour-background-primary"
				svg={ic_clear}
				on:click={() => {
					// ensure search phrase is cleared,
					// even if chosenItem is already undefined
					searchQuery = '';

					chosenItem = undefined;
					isBlurCancelled = false;
					isActive = true;
				}}
				on:mousedown={() => {
					isBlurCancelled = true;
				}}
			/>
			<SvgButton
				shadow="--shadow-none"
				svg={isActive ? ic_keyboard_arrow_up : ic_keyboard_arrow_down}
				on:click={() => {
					isActive = !isActive;
					isBlurCancelled = false;
				}}
				on:mousedown={() => {
					isBlurCancelled = true;
				}}
				on:touchstart={() => {
					isBlurCancelled = true;
				}}
			/>
		</div>
	</Input>
	<div
		class="items"
		style="
			--height: {css(itemsHeight)};
		"
	>
		{#if isActive}
			<div
				class="content"
				style="
					--pointer-events: {isActive ? 'unset' : 'none'};
				"
			>
				{#each currItems as item, i}
					<div
						class="item"
						in:dropIn={{ delay: i * 50 }}
						out:dropOut={{
							delay: i * 50,
							duration: 100,
						}}
					>
						<SvgButton
							shadow="--shadow-none"
							width="100%"
							justify="left"
							svg={item.svg}
							backgroundColour={item.backgroundColour}
							hoverBackgroundColour={item.hoverBackgroundColour}
							rippleColour={item.rippleColour}
							textColour={item.textColour}
							on:click={() => {
								chosenItem = item;
							}}
							isDisabled={item.label}
						>
							{#if i in currIndexOfSearchPhrases}
								{item.text.substring(
									0,
									currIndexOfSearchPhrases[i],
								)}<u
									>{item.text.substring(
										currIndexOfSearchPhrases[i],
										currIndexOfSearchPhrases[i] +
											searchQuery.length,
									)}</u
								>{item.text.substring(
									currIndexOfSearchPhrases[i] +
										searchQuery.length,
									item.text.length,
								)}
							{:else}
								{item.text}
							{/if}
						</SvgButton>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.component {
		background: var(--colour-background-secondary);
		border-radius: var(--roundness);
	}

	.buttons {
		display: flex;
	}

	.items {
		height: 0;
		width: 100%;

		transform: matrix(1, 0, 0, 1, 0, 0);

		& .content {
			width: 100%;
			position: absolute;
			height: var(--height);
			overflow: auto;

			display: flex;
			flex-direction: column;

			pointer-events: var(--pointer-events);

			& > * {
				margin-top: 2px;
			}
		}
	}

	.item {
		width: 100%;
	}
</style>
