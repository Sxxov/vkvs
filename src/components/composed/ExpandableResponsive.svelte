<script lang="ts">
	import { resize } from '../../core/blocks/use/resize';
	import Expandable from './Expandable.svelte';

	let containerHeight = 0;

	// eslint-disable-next-line @typescript-eslint/naming-convention
	type $$Props = Omit<Expandable['$$prop_def'], 'expandedHeight'>;
</script>

<div
	component="<ExpandableResponsive>"
	class="component"
>
	<Expandable
		{...$$props}
		expandedHeight={containerHeight}
		let:isExpanded
	>
		<slot
			name="name"
			slot="name"
		/>
		<div
			class="container"
			use:resize={({ height }) => {
				containerHeight = height;
			}}
		>
			<slot {isExpanded} />
		</div>
	</Expandable>
</div>

<style lang="postcss">
	.component {
		display: contents;
	}
</style>
