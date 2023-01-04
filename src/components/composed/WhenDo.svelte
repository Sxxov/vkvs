<script lang="ts">
	import {
		ic_add_circle,
		ic_bluetooth,
		ic_play_arrow,
		ic_play_circle,
		ic_sign_language,
		ic_smartphone,
		ic_stop,
		ic_swipe,
		ic_touch_app,
		ic_wifi,
	} from 'maic/two_tone';
	import { createEventDispatcher } from 'svelte';
	import Button from '../composable/Button.svelte';
	import { Axes } from '../composable/common/enums/Axes';
	import Spacer from '../composable/Spacer.svelte';
	import Svg from '../composable/Svg.svelte';
	import type { IWhenDo } from './when-do/IWhenDo';
	import { WhenDoDatumKinds } from './when-do/WhenDoDatumKinds';
	import WhenDoAdd from './WhenDoAdd.svelte';
	import WhenDoEdit from './WhenDoEdit.svelte';

	const dispatch = createEventDispatcher();

	export let whens: IWhenDo[];
	export let dos: IWhenDo[];
	export let isEditable = false;

	let isAddingWhen = false;
	let isAddingDo = false;
	let editWhenDo: IWhenDo;
	let isEditing = false;
</script>

<div
	component="<WhenDo>"
	class="component"
>
	<p>when:</p>
	{#each whens as item}
		{@const { icon, name: description, action } = item}
		<Button
			width="100%"
			backgroundColour="--colour-background-secondary"
			hoverBackgroundColour="--colour-background-primary"
			on:click={action}
			on:click={() => {
				editWhenDo = item;
				isEditing = true;
			}}
		>
			<div class="module">
				<Svg
					svg={icon}
					height="1rem"
					width="1rem"
					colour="--colour-text-primary"
				/>
				<Spacer
					width={16}
					direction={Axes.HORIZONTAL}
				/>
				<div>
					<p>{description}</p>
				</div>
			</div>
		</Button>
	{/each}
	{#if isEditable}
		<Button
			width="100%"
			backgroundColour="--colour-background-secondary"
			hoverBackgroundColour="--colour-background-primary"
			on:click={() => {
				isAddingWhen = true;
			}}
		>
			<div class="module">
				<Svg
					svg={ic_add_circle}
					height="1rem"
					width="1rem"
					colour="--colour-text-primary"
				/>
				<Spacer
					width={16}
					direction={Axes.HORIZONTAL}
				/>
				<div class="new">
					<p>new…</p>
				</div>
			</div>
		</Button>
	{/if}
	<hr />
	<p>do:</p>
	{#each dos as item}
		{@const { icon, name: description, action } = item}
		<Button
			width="100%"
			backgroundColour="--colour-background-secondary"
			hoverBackgroundColour="--colour-background-primary"
			on:click={action}
			on:click={() => {
				editWhenDo = item;
				isEditing = true;
			}}
		>
			<div class="module">
				<Svg
					svg={icon}
					height="1rem"
					width="1rem"
					colour="--colour-text-primary"
				/>
				<Spacer
					width={16}
					direction={Axes.HORIZONTAL}
				/>
				<div>
					<p>{description}</p>
				</div>
			</div>
		</Button>
	{/each}
	{#if isEditable}
		<Button
			width="100%"
			backgroundColour="--colour-background-secondary"
			hoverBackgroundColour="--colour-background-primary"
			on:click={() => {
				isAddingDo = true;
			}}
		>
			<div class="module">
				<Svg
					svg={ic_add_circle}
					height="1rem"
					width="1rem"
					colour="--colour-text-primary"
				/>
				<Spacer
					width={16}
					direction={Axes.HORIZONTAL}
				/>
				<div class="new">
					<p>new…</p>
				</div>
			</div>
		</Button>
	{/if}

	<WhenDoAdd
		groups={[
			{
				name: 'connections',
				icon: ic_wifi,
				subgroups: [
					{
						name: 'bluetooth',
						icon: ic_bluetooth,
						children: [
							{
								name: 'when connected',
								icon: ic_bluetooth,
								action() {},
							},
							{
								name: 'when disconnected',
								icon: ic_bluetooth,
								action() {},
							},
						],
					},
				],
			},
			{
				name: 'device',
				icon: ic_smartphone,
				subgroups: [
					{
						name: 'media',
						icon: ic_play_circle,
						children: [
							{
								name: 'when media plays',
								icon: ic_play_arrow,
								action() {},
							},
							{
								name: 'when media stops',
								icon: ic_stop,
								action() {},
							},
						],
					},
					{
						name: 'touch',
						icon: ic_touch_app,
						children: [
							{
								name: 'when gesture',
								icon: ic_swipe,
								action() {},
							},
							{
								name: 'when tap combo',
								icon: ic_sign_language,
								action() {},
							},
						],
					},
				],
			},
		]}
		bind:isActive={isAddingWhen}
		on:add={({ detail }) => {
			editWhenDo = detail;
			isEditing = true;
		}}
	/>

	<WhenDoAdd
		groups={[
			{
				name: 'connections',
				icon: ic_wifi,
				subgroups: [
					{
						name: 'bluetooth',
						icon: ic_bluetooth,
						children: [
							{
								name: 'connect to device',
								icon: ic_bluetooth,
								action() {},
							},
							{
								name: 'disconnect from device',
								icon: ic_bluetooth,
								action() {},
							},
						],
					},
				],
			},
			{
				name: 'device',
				icon: ic_smartphone,
				subgroups: [
					{
						name: 'media',
						icon: ic_play_circle,
						children: [
							{
								name: 'play media',
								icon: ic_play_arrow,
								action() {},
							},
							{
								name: 'stop media',
								icon: ic_stop,
								action() {},
							},
						],
					},
					{
						name: 'touch',
						icon: ic_touch_app,
						children: [
							{
								name: 'perform gesture',
								icon: ic_swipe,
								action() {},
							},
							{
								name: 'perform tap combo',
								icon: ic_sign_language,
								action() {},
							},
						],
					},
				],
			},
		]}
		bind:isActive={isAddingDo}
		on:add={({ detail }) => {
			editWhenDo = detail;
			isEditing = true;
		}}
	/>
	<WhenDoEdit
		data={{
			name: 'aaa',
			icon: ic_add_circle,
			data: [
				{ name: 'str', kind: WhenDoDatumKinds.STRING },
				{ name: 'num', kind: WhenDoDatumKinds.NUMBER },
				{ name: 'bool', kind: WhenDoDatumKinds.BOOLEAN },
			],
		}}
		bind:isActive={isEditing}
		on:edit={() => {
			isAddingDo = false;
			isAddingWhen = false;
			dispatch('change');
		}}
	/>
</div>

<style lang="postcss">
	.component {
		box-sizing: border-box;
		padding: 24px;

		display: flex;
		flex-direction: column;
		gap: 16px;

		& > p {
			margin: 0;
			font-size: 1rem;
		}

		& .module {
			height: 100%;
			width: 100%;
			display: grid;
			grid-template-columns: min-content min-content auto;
			align-items: center;

			& > div {
				min-width: 0;

				& > p {
					margin: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					text-align: left;
				}
			}

			& > .new {
				& > p {
					color: var(--colour-text-secondary);
				}
			}
		}
	}
</style>
