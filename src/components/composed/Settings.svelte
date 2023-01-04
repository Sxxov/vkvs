<script lang="ts">
	import { ic_notes, ic_pin, ic_settings, ic_toggle_on } from 'maic/two_tone';
	import { Dropdown } from '../../components/composable/dropdown/Dropdown';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import Svg from '../composable/Svg.svelte';
	import Toggle from '../composable/Toggle.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';

	export let isActive = false;

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
	component="<Settings>"
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
					svg={ic_settings}
				/>
				<p>settings</p>
			</div>
			<div class="settings">
				<p>dark mode:</p>
				<Toggle
					isOn={Boolean(
						globalThis.matchMedia?.('(prefers-color-scheme: dark)')
							.matches,
					)}
					on:on={() => {
						document.documentElement.classList.add('dark');
						document.documentElement.classList.remove('light');
					}}
					on:off={() => {
						document.documentElement.classList.remove('dark');
						document.documentElement.classList.add('light');
					}}
				/>
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

		& .settings {
			display: flex;
			flex-direction: column;
			gap: 16px;

			padding: 24px;

			& p {
				margin: 0;
			}
		}
	}
</style>
