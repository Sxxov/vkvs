<script lang="ts">
	import { ic_close, ic_save, ic_undo } from 'maic/two_tone';
	import { createEventDispatcher } from 'svelte';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import Input from '../composable/Input.svelte';
	import Svg from '../composable/Svg.svelte';
	import Toggle from '../composable/Toggle.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';
	import FabRow from './FabRow.svelte';
	import type { IWhenDoData } from './when-do/IWhenDoData';
	import { WhenDoDatumKinds } from './when-do/WhenDoDatumKinds';

	const dispatch = createEventDispatcher();

	export let isActive = false;
	export let data: IWhenDoData;

	let bottomSheetState: BottomSheetStates = isActive
		? BottomSheetStates.PEEK
		: BottomSheetStates.IDLE;

	$: isActive, onActivationStateChange();

	$: isActive = Boolean(
		bottomSheetState & (BottomSheetStates.PEEK | BottomSheetStates.FULL),
	);

	function onActivationStateChange() {
		bottomSheetState = isActive
			? BottomSheetStates.PEEK
			: BottomSheetStates.IDLE;
	}
</script>

<div
	component="<WhenDoEdit>"
	class="component"
>
	<BottomSheet bind:state={bottomSheetState}>
		<BottomSheetFrame
			on:back={() => {
				bottomSheetState = BottomSheetStates.IDLE;
			}}
		>
			<div
				class="heading"
				slot="heading"
			>
				<Svg
					colour="--colour-text-primary"
					height=".7em"
					width=".7em"
					svg={data.icon}
				/>
				<p>{data.name}</p>
			</div>
			<div class="content">
				{#each data.data as { name, kind }}
					<div class="datum">
						<p>{name}:</p>
						{#if kind === WhenDoDatumKinds.STRING}
							<Input
								label=""
								hasFloatingLabel={false}
							/>
						{:else if kind === WhenDoDatumKinds.NUMBER}
							<Input
								label=""
								hasFloatingLabel={false}
								type="number"
							/>
						{:else if kind === WhenDoDatumKinds.BOOLEAN}
							<Toggle />
						{/if}
					</div>
				{/each}
			</div>
		</BottomSheetFrame>
		<div
			class="buttons"
			slot="overlay"
		>
			<FabRow
				cells={[
					{
						icon: ic_save,
						action() {
							bottomSheetState = BottomSheetStates.IDLE;
							dispatch('edit', data);
						},
					},
				]}
			/>
		</div>
	</BottomSheet>
</div>

<style lang="postcss">
	.component {
		display: contents;

		& .heading {
			width: 100%;

			display: flex;
			gap: 8px;
			align-items: center;
		}

		& .content {
			padding: 24px;
			box-sizing: border-box;

			display: flex;
			flex-direction: column;
			gap: 24px;

			& .datum {
				display: flex;
				flex-direction: column;
				gap: 14px;

				& > p {
					margin: 0;
				}
			}
		}

		& .buttons {
			float: right;
			margin: 12px;
		}
	}
</style>
