<script lang="ts">
	import { computingImages } from '$lib/mapState';

	let { minValue = $bindable(), maxValue = $bindable() } = $props();

	let compute = $state(true);
	computingImages.subscribe((val) => {
		compute = val;
	});
</script>

<div class="mt-8 flex flex-col gap-2">
	<div class="flex flex-row">
		<p class="mr-4">Min</p>
		<div class="flex flex-col items-center">
			<div class="flex flex-row">
				<p>0</p>
				<input
					disabled={compute}
					bind:value={minValue}
					class="mx-2"
					step="0.01"
					type="range"
					min="0"
					max="1"
				/>
				<p>1</p>
			</div>
			<p class="font-semibold">{minValue}</p>
		</div>
	</div>
	<div class="flex flex-row">
		<p class="mr-4">Max</p>
		<div class="flex flex-col items-center">
			<div class="flex flex-row">
				<p>0</p>
				<input
					disabled={compute}
					class="mx-2"
					bind:value={maxValue}
					step="0.01"
					type="range"
					min="0"
					max="1"
				/>
				<p>1</p>
			</div>
			<p class="font-semibold">{maxValue}</p>
		</div>
	</div>
</div>
