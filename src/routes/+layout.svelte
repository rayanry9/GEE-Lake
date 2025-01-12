<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			GEE Water
		</span>
	</NavBrand>
</Navbar>
{@render children()}
