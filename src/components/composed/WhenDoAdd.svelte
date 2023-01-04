<script lang="ts">
	import { ic_search } from 'maic/two_tone';
	import { createEventDispatcher } from 'svelte';
	import { escapeRegex } from '../../resources/utilities/escape/escapeRegex';
	import BottomSheet, {
		BottomSheetStates,
	} from '../composable/BottomSheet.svelte';
	import Button from '../composable/Button.svelte';
	import Input from '../composable/Input.svelte';
	import Svg from '../composable/Svg.svelte';
	import BottomSheetFrame from './BottomSheetFrame.svelte';
	import ExpandableResponsive from './ExpandableResponsive.svelte';
	import type { IWhenDoGroup } from './when-do/IWhenDoGroup';
	import { WhenDoDatumKinds } from './when-do/WhenDoDatumKinds';

	const dispatch = createEventDispatcher();

	export let isActive = false;
	export let groups: IWhenDoGroup[];

	let bottomSheetState: BottomSheetStates = isActive
		? BottomSheetStates.PEEK
		: BottomSheetStates.IDLE;
	let searchQuery = '';

	$: isActive, onActivationStateChange();

	$: isActive = Boolean(
		bottomSheetState & (BottomSheetStates.PEEK | BottomSheetStates.FULL),
	);

	$: searchedGroups = resolveSearch(groups, searchQuery);

	function onActivationStateChange() {
		bottomSheetState = isActive
			? BottomSheetStates.PEEK
			: BottomSheetStates.IDLE;
	}

	function resolveSearch(groups: IWhenDoGroup[], query: string) {
		const isEmptyQuery = query.length <= 0;
		const result = groups.map((group) => ({
			...group,
			subgroups: group.subgroups.map((subgroup) => ({
				...subgroup,
				children: subgroup.children.map((child) => ({
					...child,
					searchChunks: [child.name],
					isSearchResult: isEmptyQuery,
				})),
				searchChunks: [subgroup.name],
				isSearchResult: isEmptyQuery,
				hasSearchResultInChildren: isEmptyQuery,
			})),
			searchChunks: [group.name],
			isSearchResult: isEmptyQuery,
			hasSearchResultInSubgroups: isEmptyQuery,
		}));

		if (isEmptyQuery) return result;

		for (const group of result) {
			group.searchChunks = resolveSearchChunks(group.name, query);

			if (group.searchChunks.length > 1) group.isSearchResult = true;

			for (const subgroup of group.subgroups) {
				subgroup.searchChunks = resolveSearchChunks(
					subgroup.name,
					query,
				);

				if (subgroup.searchChunks.length > 1) {
					subgroup.isSearchResult = true;
					group.hasSearchResultInSubgroups = true;
				}

				for (const child of subgroup.children) {
					child.searchChunks = resolveSearchChunks(child.name, query);

					if (child.searchChunks.length > 1) {
						child.isSearchResult = true;
						subgroup.hasSearchResultInChildren = true;
						group.hasSearchResultInSubgroups = true;
					}
				}
			}
		}

		return result;
	}

	function resolveSearchChunks(text: string, query: string) {
		const regex = new RegExp(escapeRegex(query), 'g');
		const result: string[] = [];
		let curr: RegExpExecArray | null = null;
		let prevEnd = 0;

		while ((curr = regex.exec(text))) {
			const { index, 0: match } = curr;
			const prev = text.slice(prevEnd, index);

			result.push(prev, match);

			prevEnd = index + match.length;
		}

		result.push(text.slice(prevEnd));

		return result;
	}
</script>

<div
	component="<WhenDoAdd>"
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
					svg={ic_search}
				/>
				<Input
					bind:value={searchQuery}
					width="100%"
					hasFloatingLabel={false}
					label="search"
					labelColour="--colour-text-secondary"
					indent={0}
					placeholder="search"
					shadow="--shadow-none"
					focusShadow="--shadow-none"
					focusBackgroundColour="--colour-background-secondary"
					><span
						slot="label"
						let:label
						let:isFocused
						class:underline={!isFocused}>{label}</span
					></Input
				>
			</div>
			<div class="content">
				{#each searchedGroups as { icon, subgroups, hasSearchResultInSubgroups, isSearchResult, searchChunks }}
					<ExpandableResponsive
						expanderColour="--colour-background-primary"
						expandedColour="--colour-background-secondary"
						hoverExpanderColour="--colour-background-secondary"
						isExpanded={hasSearchResultInSubgroups ||
							isSearchResult}
					>
						<p
							class="name"
							slot="name"
						>
							<Svg
								colour="--colour-text-primary"
								height=".7em"
								width=".7em"
								svg={icon}
							/>&nbsp;&nbsp;
							<span
								>{#each searchChunks as chunk, i}<span
										class:underline={i % 2 !== 0}
										>{chunk}</span
									>{/each}</span
							>
						</p>
						<div class="frame">
							{#each subgroups as { icon, children, hasSearchResultInChildren, isSearchResult, searchChunks }}
								<ExpandableResponsive
									width="100%"
									isExpanded={hasSearchResultInChildren ||
										isSearchResult}
								>
									<span slot="name">
										<Svg
											colour="--colour-text-primary"
											height=".7em"
											width=".7em"
											svg={icon}
										/>&nbsp;&nbsp;<span
											>{#each searchChunks as chunk, i}<span
													class:underline={i % 2 !==
														0}>{chunk}</span
												>{/each}</span
										>
									</span>
									<div class="frame">
										{#each children as { name, icon, action, searchChunks }}
											<Button
												width="100%"
												justify="left"
												backgroundColour="--colour-background-tertiary"
												hoverBackgroundColour="--colour-background-secondary"
												on:click={() => {
													dispatch('add', {
														name,
														icon,
														action,
													});
												}}
												on:click={action}
											>
												<p>
													<Svg
														svg={icon}
														height=".7em"
														width=".7em"
														colour="--colour-text-primary"
													/>&nbsp;&nbsp;<span
														>{#each searchChunks as chunk, i}<span
																class:underline={i %
																	2 !==
																	0}
																>{chunk}</span
															>{/each}</span
													>
												</p>
											</Button>
										{/each}
									</div>
								</ExpandableResponsive>
							{/each}
						</div>
					</ExpandableResponsive>
				{/each}
			</div>
		</BottomSheetFrame>
	</BottomSheet>
</div>

<style lang="postcss">
	.component {
		display: contents;

		& .underline {
			text-decoration: underline;
		}

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
			gap: 12px;

			& .name {
				margin: 0;
			}

			& .frame {
				display: flex;
				flex-direction: column;
				gap: 12px;

				padding: 14px;
				box-sizing: border-box;
			}
		}
	}
</style>
