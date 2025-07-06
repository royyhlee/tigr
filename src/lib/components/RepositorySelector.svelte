<script lang="ts">
	import { config } from '$lib/store';

	export let onSelect: (detail: { repo: string }) => void;

	function selectRepository(e: Event) {
		const target = e.target as HTMLSelectElement;
		const repo = target.value;
		if (repo) {
			onSelect({ repo });
		}
	}
</script>

<select onchange={selectRepository} value={$config.selected ?? ''}>
	{#if !$config.selected}
		<option value="" disabled selected>Select a repository</option>
	{/if}
	{#each $config.repositories ?? [] as repo}
		<option value={repo}>{repo}</option>
	{/each}
</select>
