<script>
	import NavBar from '$lib/components/ui/navBar.svelte';
</script>

<NavBar />

<div class="flex flex-col space-y-16 px-12 py-8">
	<div class="w-fit self-center rounded-lg bg-slate-200 px-16 py-4 text-2xl font-semibold">
		About Us and the Application
	</div>
	<div class="flex flex-row">
		<img alt="Site Screenshot" src="/about-1.png" class="w-1/2 object-cover" />
		<div class="max-w-[50%] px-12 py-4">
			Welcome to BlueWatcher for water conservation and sustainable water management. We aim to
			identify the unprotected water bodies and provide practical guidance for preserving our most
			precious lakes. From sustainable water management solutions to community initiatives and
			educational resources, our interactive web application empowers individuals and government
			organizations to combat water scarcity, protect ecosystems, and ensure a sustainable future.
			Join the movement to conserve water today! Through educational content, innovative strategies,
			and actionable insights, we provide the actual scenario to combat water scarcity, promote
			efficient usage, and protect aquatic ecosystems
		</div>
	</div>
	<div class="flex flex-row">
		<div class="max-w-[50%] self-start px-6 pt-8">
			The Indian Institute of Technology Hyderabad (IITH) is a distinguished institution known for
			its excellence in science and technology education. Established in 2008, IITH consistently
			ranks among India's top 10 engineering institutes. It offers a diverse range of undergraduate
			programs, encouraging students to explore various disciplines and engage in cutting-edge
			research.
		</div>
		<img class="w-1/2 object-cover" alt="IITH" src="/about-2.png" />
	</div>
</div>
