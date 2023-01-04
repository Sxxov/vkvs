<script lang="ts">
	import { signInAnonymously } from 'firebase/auth';
	import {
		type CollectionReference,
		deleteDoc,
		doc,
		setDoc,
	} from 'firebase/firestore';
	import { ic_info, ic_search, ic_settings } from 'maic/two_tone';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { collectionStore } from 'sveltefire';
	import BottomSheet, {
		BottomSheetStates,
	} from '../components/composable/BottomSheet.svelte';
	import LineLoader from '../components/composable/loaders/LineLoader.svelte';
	import Spacer from '../components/composable/Spacer.svelte';
	import Svg from '../components/composable/Svg.svelte';
	import BottomSheetFrame from '../components/composed/BottomSheetFrame.svelte';
	import KeyValueEdit from '../components/composed/KeyValueEdit.svelte';
	import {
		buttonsW,
		toppingsW,
	} from '../components/composed/nav/TopNav.svelte';
	import Traverse from '../components/composed/Traverse.svelte';
	import { auth } from '../core/firebase/raw/auth';
	import { db } from '../core/firebase/raw/db';
	import { dropIn, dropOut } from '../core/transitioner/Transitioner';

	$toppingsW = [
		{
			icon: ic_settings,
			text: 'about',
			action() {
				aboutState = BottomSheetStates.FULL;
			},
		},
	];

	$buttonsW = [
		{
			icon: ic_search,
			action() {
				console.log('search');
			},
		},
	];

	const generateUpdateDefaultDoc =
		([docRef, ...restRefs]: string[]) =>
		async (key: string, value: any) => {
			const nested = {};
			[...restRefs, key].reduce<Record<string, any>>(
				// eslint-disable-next-line no-return-assign
				(o, s, i, arr) =>
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					(o[s] = i >= arr.length - 1 ? value : {}),
				nested,
			);
			await setDoc(doc(db, defaultRef, docRef), nested, { merge: true });
		};

	const defaultRef = 'default';
	let defaultW: ReturnType<typeof collectionStore> | undefined;

	onMount(async () => {
		await signInAnonymously(auth);

		const defW = collectionStore<{
			ref: CollectionReference;
			id: string;
			[k: string]: unknown;
		}>(db, defaultRef);

		const unsubscribe = defW.subscribe(() => {
			setTimeout(() => {
				unsubscribe();
			});
			defaultW = defW;
		});
	});

	let aboutState = BottomSheetStates.IDLE;
</script>

<div
	component="/"
	class="component"
>
	<div class="editor">
		{#if defaultW}
			<Traverse
				object={Object.fromEntries(
					$defaultW.map((collection) => [
						collection.id,
						Object.fromEntries(
							Object.entries(collection).filter(
								([k]) => k !== 'id' && k !== 'ref',
							),
						),
					]),
				)}
				let:key
				let:value
				let:history
			>
				{@const update = generateUpdateDefaultDoc(history)}
				<div
					slot="before-enter"
					let:setShouldDoNextEnter
				>
					<div
						class="indent object"
						style="
						--indent: {history.length};
					"
						in:dropIn
						out:dropOut={{ easing: quintOut, duration: 100 }}
					>
						<KeyValueEdit
							{key}
							{value}
							isDeleteable={history.length <= 0}
							on:delete={({ detail: { key } }) => {
								void deleteDoc(
									doc(
										db,
										defaultRef,
										...history,
										String(key),
									),
								);
							}}
							on:collapse={() => {
								setShouldDoNextEnter(false);
							}}
							on:expand={() => {
								setShouldDoNextEnter(true);
							}}
						/>
					</div>
				</div>
				<div
					class="indent primitive"
					style="
					--indent: {history.length};
				"
					in:dropIn
					out:dropOut={{ easing: quintOut, duration: 100 }}
				>
					<KeyValueEdit
						{key}
						{value}
						isDeleteable={false}
						on:submit={({ detail: { key, value } }) => {
							update(key, value);
						}}
					/>
				</div>
				<div slot="after-enter">
					<Spacer height={2} />
				</div>
			</Traverse>
			<p
				class="new indent"
				style="--indent: 0"
				on:keydown={({ currentTarget, key }) =>
					void (key === 'Enter' && currentTarget.click())}
				on:click={() => {
					void setDoc(
						doc(db, defaultRef, String($defaultW.length)),
						{
							name: 'Untitled',
							transform: {
								position: { x: 0, y: 0, z: 0 },
								rotation: { x: 0, y: 0, z: 0 },
							},
						},
						{ merge: true },
					);
				}}
			>
				Add new item...
			</p>
		{:else}
			<LineLoader />
		{/if}
	</div>
	<BottomSheet bind:state={aboutState}>
		<BottomSheetFrame>
			<div
				slot="heading"
				class="heading"
			>
				<Svg
					colour="--colour-text-primary"
					height=".7em"
					width=".7em"
					svg={ic_info}
				/>
				<p>about</p>
			</div>
			<p>made with love from VorteXR</p>
		</BottomSheetFrame>
	</BottomSheet>
</div>

<style lang="postcss">
	.component {
		height: 100%;
		background: var(--colour-background-primary);

		padding: 0 var(--padding) var(--padding) var(--padding);
		box-sizing: border-box;

		& > .editor {
			& .indent {
				margin-left: calc(var(--indent) * 2em + 2em);
				position: relative;

				&::before {
					content: '';
					display: block;
					position: absolute;
					left: calc(var(--indent) * -2em - 2em);
					top: -1.5em;
					height: 2.2em;
					width: calc(var(--indent) * 2em + 1em);
					border-left: solid 1px var(--colour-text-tertiary);
					border-bottom: solid 1px var(--colour-text-tertiary);
				}
			}

			& .new {
				cursor: pointer;
				display: inline-block;
				margin: 0;
				margin-left: 2em;
				color: var(--colour-text-secondary);
				font-style: italic;

				&:hover {
					text-decoration: underline;
					text-underline-offset: 8px;
				}
			}
		}
	}
</style>
