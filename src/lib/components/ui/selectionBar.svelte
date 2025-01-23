<script lang="ts">
	import DataSelect from './selections/dataSelect.svelte';
	import SelectImageType from './selections/selectImageType.svelte';
	import SelectLake from './selections/selectLake.svelte';
</script>

<div class="flex flex-row">
	<SelectLake />
	<DataSelect isInitial={true} />
	<DataSelect isInitial={false} />
	<SelectImageType />
</div>
