<script lang="ts">
	import { IndicesData } from '$lib/mapData';

	let dropdownState = $state(false);
	let indiceState = $state<Array<boolean>>([]);
</script>

<div
	class="relative w-full bg-white text-sm outline outline-[1px] outline-black focus-within:outline-2 focus-within:outline-indigo-500"
	role="menu"
	tabindex={0}
	onfocusin={() => {
		dropdownState = true;
	}}
	onfocusout={() => {
		dropdownState = false;
	}}
>
	<div class="px-4 py-2">Select Indices</div>
	<div
		class="absolute left-0 w-full origin-top bg-white {dropdownState
			? 'pointer-events-auto opacity-100'
			: 'pointer-events-none opacity-0'} duration-250 outline outline-[1px] outline-gray-900 transition-opacity ease-in"
	>
		{#each IndicesData as indice, idx}
			<div class="flex w-full flex-row px-3 py-2 hover:bg-indigo-500 hover:text-white">
				<span
					role="checkbox"
					tabindex={0}
					aria-checked={indiceState[idx]}
					onkeydown={(ev) => {
						if (ev.key.match('Enter')) {
							indiceState[idx] = !indiceState[idx];
						}
					}}
					onclick={() => {
						indiceState[idx] = !indiceState[idx];
					}}
					class="grow">{indice}</span
				>
				<input tabindex={1} type="checkbox" bind:checked={indiceState[idx]} defaultChecked={true} />
			</div>
		{/each}
	</div>
</div>
