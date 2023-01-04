<script lang="ts">
	import {
		ic_arrow_back,
		ic_close,
		ic_delete,
		ic_delete_forever,
		ic_edit,
		ic_save,
		ic_undo,
	} from 'maic/two_tone';
	import { createEventDispatcher } from 'svelte';
	import { focusSelectAll } from '../../core/blocks/use/focusSelectAll';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import { Levels } from '../composable/common/enums/Levels';
	import Dialog from '../composable/Dialog.svelte';
	import Spacer from '../composable/Spacer.svelte';
	import Svg from '../composable/Svg.svelte';
	import { Toast } from '../composable/toast/Toast';
	import { toastsW } from '../composable/Toaster.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';
	import FabRow from './FabRow.svelte';
	import type { IMod } from './mod/IMod';
	import WhenDo from './WhenDo.svelte';

	const dispatch = createEventDispatcher();

	export let mod: IMod;
	export let isActive = false;
	export let isSavePromptActive = false;
	export let isDeletePromptActive = false;

	let bottomSheetState: BottomSheetStates = isActive
		? BottomSheetStates.PEEK
		: BottomSheetStates.IDLE;
	let hasChanged = false;
	let modCopy: IMod;

	$: isActive = Boolean(
		bottomSheetState & (BottomSheetStates.PEEK | BottomSheetStates.FULL),
	);

	$: isActive, onActivationStateChange();

	$: mod, onModChange();

	$: if (hasChanged && bottomSheetState & BottomSheetStates.IDLE) {
		isSavePromptActive = true;
		bottomSheetState = BottomSheetStates.PEEK;
	}

	function onModChange() {
		modCopy = {
			...mod,
			dos: [...mod.dos],
			whens: [...mod.whens],
		};
	}

	function onActivationStateChange() {
		bottomSheetState = isActive
			? BottomSheetStates.PEEK
			: BottomSheetStates.IDLE;
	}

	function save() {
		dispatch('save', { mod });
		hasChanged = false;
		bottomSheetState = BottomSheetStates.IDLE;
		toastsW.push(
			Toast.from({
				text: `Successfully saved "${modCopy.name}"`,
				level: Levels.OK,
			}),
		);

		mod = modCopy;
	}

	function discard() {
		dispatch('discard', { mod });
		hasChanged = false;
		bottomSheetState = BottomSheetStates.IDLE;
		mod = { ...mod };
	}

	function deleteForever() {
		dispatch('delete', { mod });
		toastsW.push(
			Toast.from({
				text: `Deleted "${mod.name}"`,
				level: Levels.INFO,
			}),
		);
	}
</script>

<div
	component="<ModEdit>"
	class="component"
>
	<BottomSheet bind:state={bottomSheetState}>
		<BottomSheetFrame
			on:back={() => {
				if (hasChanged) isSavePromptActive = true;
				else bottomSheetState = BottomSheetStates.IDLE;
			}}
		>
			<p slot="heading">
				<span
					class:blank={mod.name.length <= 0}
					contenteditable
					bind:textContent={modCopy.name}
					use:focusSelectAll
					on:input={() => {
						hasChanged = true;
						dispatch('change', { mod });
					}}
				/>
				<Svg
					colour="--colour-text-primary"
					height=".7em"
					width=".7em"
					svg={ic_edit}
				/>
			</p>
			<div class="whendo">
				<WhenDo
					whens={modCopy.whens}
					dos={modCopy.dos}
					isEditable
					on:change={() => {
						hasChanged = true;
						dispatch('change', { mod });
					}}
				/>
			</div>
		</BottomSheetFrame>
		<div
			class="buttons"
			slot="overlay"
		>
			<div class="content">
				<FabRow
					cells={[
						{
							icon: ic_undo,
							action() {},
						},
						{
							icon: ic_save,
							action() {
								save();
							},
						},
					]}
				/>
			</div>
		</div>
	</BottomSheet>
	<div class="prompt">
		<Dialog
			bind:isActive={isSavePromptActive}
			roundness="var(--roundness) var(--roundness) 40px 40px"
			let:dismiss
			><div
				slot="buttons"
				class="buttons"
			>
				<SvgButton
					svg={ic_close}
					svgColour="--colour-text-primary"
					backgroundColour="--colour-background-primary"
					hoverBackgroundColour="--colour-background-secondary"
					on:click={dismiss}
				/>
			</div>
			<div class="content">
				<div class="heading">
					<Svg
						svg={ic_save}
						height="2.5rem"
						width="2.5rem"
					/>
					<h3>wait</h3>
				</div>
				<Spacer height={16} />
				<p>do you want to save the changes made to "{mod.name}"?</p>
			</div>
			<div class="buttons">
				<FabRow
					cells={[
						{
							icon: ic_delete,
							action() {
								discard();
								dismiss();
							},
						},
						{
							icon: ic_save,
							text: 'save',
							action() {
								save();
								dismiss();
							},
						},
					]}
				/>
			</div></Dialog
		>
	</div>
	<div class="prompt">
		<Dialog
			bind:isActive={isDeletePromptActive}
			roundness="var(--roundness) var(--roundness) 40px 40px"
			let:dismiss
			><div
				slot="buttons"
				class="buttons"
			>
				<SvgButton
					svg={ic_close}
					svgColour="--colour-text-primary"
					backgroundColour="--colour-background-primary"
					hoverBackgroundColour="--colour-background-secondary"
					on:click={dismiss}
				/>
			</div>
			<div class="content">
				<div class="heading">
					<Svg
						svg={ic_delete}
						height="2.5rem"
						width="2.5rem"
					/>
					<h3>wait</h3>
				</div>
				<Spacer height={16} />
				<p>do you want to delete "{mod.name}"?</p>
			</div>
			<div class="buttons">
				<FabRow
					cells={[
						{
							icon: ic_arrow_back,
							action() {
								dismiss();
							},
						},
						{
							icon: ic_delete_forever,
							text: 'delete forever',
							action() {
								deleteForever();

								dismiss();
							},
						},
					]}
				/>
			</div></Dialog
		>
	</div>
</div>

<style lang="postcss">
	.component {
		display: contents;

		& p {
			& > span {
				outline: none;
			}
		}

		& .buttons {
			width: 100vw;

			& > .content {
				float: right;
				margin: 12px;
			}
		}

		& > .prompt {
			position: fixed;

			height: 100%;
			width: 100%;

			top: 0;
			left: 0;

			padding: var(--padding);
			box-sizing: border-box;

			display: grid;
			align-items: center;

			z-index: 100;

			pointer-events: none;

			& .content {
				padding: var(--padding) var(--padding) 12px var(--padding);

				pointer-events: auto;

				& > .heading {
					display: flex;
					gap: 16px;
					align-items: center;

					& > h3 {
						margin: 0;
					}
				}
			}

			& .buttons {
				width: 100%;
				padding: 12px;
				box-sizing: border-box;
			}
		}
	}
</style>
