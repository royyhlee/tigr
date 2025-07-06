<script lang="ts">
	import type { Git } from "$lib/git";

	export let git: Git | null;
	export let branches: string[];
	export let onCheckout: (detail: { branch: string }) => void;
	export let onError: (detail: { message: string }) => void;

	async function checkout(e: MouseEvent) {
		const target = e.target as HTMLButtonElement;
		const branch = target.textContent?.trim();

		if (!branch || !git) return;

		const { error } = await git.checkout(branch);
		if (error) {
			onError({ message: `Error checking out branch ${branch}: ${error}` });
		} else {
			onCheckout({ branch });
		}
	}
</script>

<div class="scroll-region">
	{#each branches as branch}
		<button type="button" onclick={checkout}>{branch}</button>
	{/each}
</div>
