<script lang="ts">
	import { page } from '$app/stores';
	import {
		ic_add,
		ic_home,
		ic_texture,
		ic_question_mark,
	} from 'maic/two_tone';
	import Spacer from '../composable/Spacer.svelte';
	import BottomNav from './nav/BottomNav.svelte';
	import TopNav from './nav/TopNav.svelte';

	/* eslint-disable @typescript-eslint/naming-convention */
	const RouteToData: Record<string, { name: string; icon: string }> = {
		'/': {
			name: 'data modifier',
			icon: ic_home,
		},
		'/new': {
			name: 'new',
			icon: ic_add,
		},
		'/browse': {
			name: 'browse',
			icon: ic_texture,
		},
	};
	/* eslint-enable */

	$: ({ url } = $page);
	$: ({ name } = RouteToData[url.pathname] ?? {
		name: 'unknown',
		icon: ic_question_mark,
	});
</script>

<div
	component="<Nav>"
	class="component"
>
	<div class="nav">
		<div class="top">
			<TopNav {name} />
		</div>
		<div />
		<div class="bottom">
			<!-- <BottomNav
				navs={Object.entries(RouteToData).map(([route, { icon }]) => ({
					icon,
					route,
				}))}
				selectedNavIndex={Object.keys(RouteToData).indexOf(
					url.pathname,
				)}
			/> -->
		</div>
	</div>
	<Spacer height={168} />
</div>

<style lang="postcss">
	.component {
		& > .nav {
			height: 100%;
			width: 100%;

			position: fixed;
			top: 0;
			left: 0;

			display: grid;
			grid-template-rows: auto 1fr auto;

			pointer-events: none;

			z-index: 10;

			& > .top,
			& > .bottom {
				pointer-events: auto;
			}
		}
	}
</style>
