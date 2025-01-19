<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	let state = $state(false);

	if (page.form != null) {
		state = !page.form.success;
		setTimeout(() => {
			state = false;
		}, 2000);
	}
</script>

<div class="flex w-full grow flex-row">
	<div class="mx-auto h-fit self-center rounded-lg bg-slate-50 px-8 py-8">
		<form class="flex flex-col space-y-6 pb-2" method="POST" action="/login">
			<p class="lg mr-32 opacity-60">Sign in to the Platform</p>
			<div class="flex flex-col space-y-2 text-sm">
				<span>Email</span>
				<input
					type="email"
					name="email"
					placeholder="name@company.com"
					class="rounded-lg bg-slate-50 px-3 py-3 text-sm outline outline-gray-200 hover:bg-stone-100 focus:outline-indigo-500"
					required
				/>
			</div>
			<div class="flex flex-col space-y-2 text-sm">
				<span>Your Password</span>
				<input
					class="rounded-lg bg-slate-50 px-3 py-3 text-sm outline outline-gray-200 hover:bg-stone-100 focus:outline-indigo-500"
					type="password"
					name="password"
					placeholder="*****"
					required
				/>
			</div>
			<button
				type="submit"
				class="text-md w-full rounded-lg bg-indigo-500 py-3 text-white hover:bg-indigo-700"
				>Login to your Account</button
			>
		</form>
	</div>
</div>
{#if state}
	<div
		transition:fade
		class="absolute bottom-10 w-fit self-center rounded-lg bg-red-500 px-6 py-4 text-white"
	>
		Invalid User Credentials
	</div>
{/if}
