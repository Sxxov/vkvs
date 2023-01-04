declare module '*?png' {
	export default '';
}

declare module '*?webp' {
	export default '';
}

declare module '*?jpg' {
	export default '';
}

declare module '*.gltf' {
	export default '';
}

declare module '*.glb' {
	export default '';
}

declare namespace svelteHTML {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface HTMLAttributes<T> {
		/** Annotation of component-level elements */
		component?: `/${string}` | `<${string}>`;
	}
}
