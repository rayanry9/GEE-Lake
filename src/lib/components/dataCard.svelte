<script lang="ts">
	let { title, value, isFrom }: { title: string; value: number; isFrom: boolean } = $props();
</script>

<div
	class="flex w-full flex-col items-center space-y-4 rounded-lg bg-white py-4 outline outline-[1px] outline-black"
>
	<p class="font-bold text-stone-600">{title}</p>
	<p class=" font-bold {isFrom ? 'text-red-500' : 'text-green-400'}">{value}</p>
</div>
