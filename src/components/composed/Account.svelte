<script lang="ts">
	import {
		ic_arrow_forward,
		ic_edit,
		ic_emoji_symbols,
		ic_face,
		ic_logout,
		ic_notes,
		ic_pin,
		ic_toggle_on,
	} from 'maic/two_tone';
	import DropdownModule from '../composable/Dropdown.svelte';
	import { Dropdown } from '../composable/dropdown/Dropdown';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import Input from '../composable/Input.svelte';
	import Svg from '../composable/Svg.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';
	import ExpandableResponsive from './ExpandableResponsive.svelte';
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import LineLoader from '../composable/loaders/LineLoader.svelte';

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
					svg={ic_face}
				/>
				<p>you</p>
			</div>
			<div class="pp">
				<div class="container">
					<Svg
						svg={ic_face}
						colour="--colour-background-tertiary"
						height={224}
						width={224}
					/>
				</div>
				<div class="edit">
					<SvgButton svg={ic_edit} />
				</div>
			</div>
			<p class="user"><b>user</b></p>
			<div class="progress">
				<div class="text">
					<p class="percent">13%</p>
					<p class="quota"><b>66.2</b>/500.0mb</p>
				</div>
				<LineLoader completion={0.2} />
			</div>
			<div class="buttons">
				<SvgButton
					svg={ic_arrow_forward}
					width={224}
				>
					<b>get more&nbsp;</b>
					storage
				</SvgButton>
				<SvgButton
					svg={ic_logout}
					width={224}
					backgroundColour="#e66767"
					textColour="--colour-background-primary"
					hoverTextColour="--colour-text-primary"
					svgColour="--colour-background-primary"
					hoverSvgColour="--colour-text-primary"
				>
					<b>logout</b>
				</SvgButton>
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

		& .pp {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 56px;

			& > .container {
				width: min-content;
				height: min-content;

				padding: 24px;
				border-radius: 100%;
				background-color: var(--colour-background-secondary);
				box-shadow: var(--shadow-inner-sm), var(--shadow-lg);
			}

			& > .edit {
				position: absolute;
				bottom: 72px;
				right: 72px;
			}
		}

		& .user {
			text-align: center;
		}

		& .progress {
			padding: 0px 56px;

			& > .text {
				width: 100%;
				height: 56px;

				& > .percent {
					float: left;
					color: var(--colour-accent-primary);
				}

				& > .quota {
					float: right;
					color: var(--colour-text-secondary);
				}
			}
		}

		& .buttons {
			width: 100%;

			position: absolute;
			bottom: 0;

			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 56px;
			box-sizing: border-box;
			align-items: center;
		}
	}
</style>
