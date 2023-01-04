<script lang="ts">
	import { Store } from '../../core/blocks/store';

	export let object: Record<any, any>;
	export let history: string[] = [];
	export let sortFn: (
		a: [k: keyof typeof object, v: typeof object[keyof typeof object]],
		b: [k: keyof typeof object, v: typeof object[keyof typeof object]],
	) => number = ([a], [b]) => (a > b ? 1 : a === b ? 0 : -1);

	$: sorted = Object.fromEntries(Object.entries(object).sort(sortFn));

	const nextEnterKeyToShouldDoW = new Store<Record<any, boolean>>({});
	const generateSetShouldDoNextEnter = (key: string) => (v: boolean) => {
		if (v) nextEnterKeyToShouldDoW.value[key] = false;
		else nextEnterKeyToShouldDoW.value[key] = true;

		nextEnterKeyToShouldDoW.trigger();
	};
</script>

{#each Object.entries(sorted) as [key, value]}
	{@const setShouldDoNextEnter = generateSetShouldDoNextEnter(key)}
	{#if typeof value === 'object' && value !== null}
		<slot
			name="before-enter"
			object={sorted}
			{key}
			{value}
			{history}
			{setShouldDoNextEnter}
		/>
		{@const isSkipped = $nextEnterKeyToShouldDoW[key] ?? true}
		{#if !isSkipped}
			<svelte:self
				object={value}
				history={[...history, key]}
				let:object
				let:key
				let:value
				let:history
				let:setShouldDoNextEnter
			>
				<slot
					slot="before-enter"
					name="before-enter"
					{object}
					{key}
					{value}
					{history}
					{setShouldDoNextEnter}
				/>
				<slot
					{object}
					{key}
					{value}
					{history}
					{setShouldDoNextEnter}
				/>
				<slot
					slot="after-enter"
					name="after-enter"
					{object}
					{key}
					{value}
					{history}
				/>
			</svelte:self>
			<slot
				{object}
				{key}
				{value}
				{history}
				name="after-enter"
			/>
		{/if}
	{:else}
		<slot
			object={sorted}
			{key}
			{value}
			{history}
			{setShouldDoNextEnter}
		/>
	{/if}
{/each}
