<script lang="ts">
	import DataTable from '$lib/components/ui/dataTable.svelte';
	import Footer from '$lib/components/ui/footer.svelte';
	import Map from '$lib/components/ui/map.svelte';
	import NavBar from '$lib/components/ui/navBar.svelte';
	import SelectionBar from '$lib/components/ui/selectionBar.svelte';
</script>

<NavBar />
<SelectionBar />
<div class="my-6 flex h-full w-full flex-row space-x-1 px-6">
	<Map isInitialMap={true} />
	<Map isInitialMap={false} />
</div>
<DataTable />
<Footer />

<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
