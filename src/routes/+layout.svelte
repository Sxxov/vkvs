<script lang="ts">
	import '../global.pcss';
	import Toaster from '../components/composable/Toaster.svelte';
	import favicon32 from '../assets/favi/favicon-32x32.png?png';
	import favicon16 from '../assets/favi/favicon-16x16.png?png';
	import Nav from '../components/composed/Nav.svelte';

	const enum Particulars {
		NAME = 'vkvs',
		DESCRIPTION = '',
		KEYWORDS = '',
		AUTHOR = '',
	}

	if (typeof window !== 'undefined') {
		(async () => {
			(await import('smoothscroll-for-websites')).default({
				animationTime: 500,
				touchpadSupport: false,
				pulseScale: 6,
			});
		})();
	}
</script>

<svelte:head>
	<title>{Particulars.NAME}</title>
	<meta charset="utf-8" />

	<!-- Icon Tags -->
	<link
		rel="icon"
		type="image/png"
		sizes="32x32"
		href={favicon32}
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="16x16"
		href={favicon16}
	/>

	<!-- Viewport Tag to prevent jank -->
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	/>

	<!-- Primary Meta Tags -->
	<meta
		name="title"
		content={Particulars.NAME}
	/>
	<meta
		name="description"
		content={Particulars.DESCRIPTION}
	/>
	<meta
		name="keywords"
		content={Particulars.KEYWORDS}
	/>
	<meta
		name="author"
		content="@{Particulars.AUTHOR}"
	/>

	<!-- Open Graph / Facebook -->
	<meta
		property="og:type"
		content="website"
	/>
	<meta
		property="og:url"
		content="https://metatags.io/"
	/>
	<meta
		property="og:title"
		content={Particulars.NAME}
	/>
	<meta
		property="og:description"
		content={Particulars.DESCRIPTION}
	/>
	<meta
		property="og:image"
		content="/screenshot.png"
	/>

	<!-- Twitter -->
	<meta
		property="twitter:card"
		content="summary_large_image"
	/>
	<meta
		property="twitter:url"
		content="https://metatags.io/"
	/>
	<meta
		property="twitter:title"
		content={Particulars.NAME}
	/>
	<meta
		property="twitter:description"
		content={Particulars.DESCRIPTION}
	/>
	<meta
		property="twitter:image"
		content="/screenshot.png"
	/>
</svelte:head>

<main>
	<Nav />
	<slot />
	<Toaster />
	<!-- <Frame /> -->
</main>

<style lang="postcss">
	:global(body) {
		margin: 0;
		/* overscroll-behavior-y: contain; */
		min-height: 100%;
		background: var(--colour-background-primary);
	}

	main {
		min-height: 100%;
		margin-bottom: 68px;
	}
</style>
