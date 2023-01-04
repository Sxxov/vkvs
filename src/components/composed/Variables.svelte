<script lang="ts">
	import {
		ic_emoji_symbols,
		ic_notes,
		ic_pin,
		ic_toggle_on,
	} from 'maic/two_tone';
	import DropdownModule from '../../components/composable/Dropdown.svelte';
	import { Dropdown } from '../../components/composable/dropdown/Dropdown';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import Input from '../composable/Input.svelte';
	import Svg from '../composable/Svg.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';
	import ExpandableResponsive from './ExpandableResponsive.svelte';

	export let isActive = false;

	const dropdowns = [
		Dropdown.from({
			id: 'string',
			text: 'string',
			svg: ic_notes,
		}),
		Dropdown.from({
			id: 'number',
			text: 'number',
			svg: ic_pin,
		}),
		Dropdown.from({
			id: 'boolean',
			text: 'boolean',
			svg: ic_toggle_on,
		}),
	];

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
	component="<Variables>"
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
					svg={ic_emoji_symbols}
				/>
				<p>variables</p>
			</div>
			<div class="modules">
				<ExpandableResponsive>
					<span slot="name"> %variable_str </span>
					<div class="content">
						<p>type:</p>
						<div class="dropdown">
							<DropdownModule
								items={dropdowns}
								chosenItem={dropdowns[0]}
								itemsHeight={112}
							/>
						</div>
						<p>value:</p>
						<Input
							label=""
							hasFloatingLabel={false}
						/>
					</div>
				</ExpandableResponsive>
			</div>
		</BottomSheetFrame>
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

		& .modules {
			display: flex;
			flex-direction: column;
			gap: 16px;

			padding: 24px;

			& .content {
				box-sizing: border-box;
				padding: 24px;

				display: flex;
				flex-direction: column;
				gap: 16px;

				& p {
					margin: 0;
				}

				& > .dropdown {
					height: auto;
					width: 100%;

					z-index: 999;
				}
			}
		}
	}
</style>
