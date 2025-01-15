<script lang="ts">
	import { Button, Card, Input, Label } from 'flowbite-svelte';
</script>

<div class="flex w-full grow flex-row">
	<Card class="mx-auto h-fit self-center">
		<form class="flex flex-col space-y-6 pb-6" method="POST" action="/login">
			<h3>Sign in to the Platform</h3>
			<Label class="space-y-2">
				<span>Email</span>
				<Input type="email" name="email" placeholder="name@company.com" required />
			</Label>
			<Label class="space-y-2">
				<span>Your Password</span>
				<Input type="password" name="password" placeholder="*****" required />
			</Label>
			<Button type="submit" class="w-full">Login to your Account</Button>
		</form>
	</Card>
</div>
