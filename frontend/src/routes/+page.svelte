<script lang="ts">
	import { GetLocalBranches, CheckoutBranch, FetchAllPrune, Suspend, ResetHead, Log, Status, Pull } from "$lib/wailsjs/go/main/App";
	import { onMount } from "svelte";

	let path = $state('C:\\Users\\ylee\\Workspace\\apartments-web');
	let branches: string[] = $state([]);
	let commits: string[] = $state([]);
	let stage: string[] = $state([]);
	let message: string = $state('');

	onMount(async () => {
		await Promise.all([
			getBranches(),
			getCommits(),
			getStatus()
		]);
	});

	async function checkoutBranch(branch: string) {
		const result = await CheckoutBranch(branch, path);
		message = result;
		await Promise.all([
			getBranches(),
			getCommits(),
			getStatus()
		]);
	}

	async function getBranches() {
		const result = await GetLocalBranches(path);
		branches = result.split('\n').map(b => b.trim());
	}

	async function fetchAllPrune() {
		const result = await FetchAllPrune(path);
		message = result;
	}

	async function suspend() {
		const result = await Suspend(path);
		message = result;
		Promise.all([getCommits(), getStatus()]);
	}

	async function resume() {
		const result = await ResetHead(path);
		message = result;
		Promise.all([getCommits(), getStatus()]);
	}

	async function getCommits() {
		const result = await Log(path);
		commits = result.split('\n').map(c => c.trim());
	}

	async function getStatus() {
		const result = await Status(path);
		stage = result.split('\n').map(s => s.trim());
	}

	async function pull() {
		const result = await Pull(path);
		message = result;
	}
</script>

<div class="tigr-container">
	<div class="left-container">
		<div class="repo-container">
			<div class="repo-list">
				
			</div>
			<div class="input-container">
				<label>
					Repository:
					<input id="input-repo" type="text" bind:value={path}/>
				</label>
			</div>
		</div>
	</div>

	<div class="bottom-container">
		<div class="vertical-container">
			<div id="branches" class="list">
				{#each branches as b}
					{#if b.indexOf('*') > -1 }
						<div class="branch current">{b}</div>
					{:else}
						<div class="branch" onclick={() => checkoutBranch(b)}>{b}</div>
					{/if}
				{/each}
			</div>
			<div id="commits" class="list">
				{#each commits as c}
					<div class="commit">{c}</div>
				{/each}
			</div>
		</div>
		<div class="vertical-container">
			<div id="stage" class="list">
				{#each stage as s}
					<div class="stage">{s}</div>
				{/each}
			</div>
			<div id="actions" class="list">
				<button onclick={() => fetchAllPrune()}>Fetch</button>
				<button onclick={() => pull()}>Pull</button>
				<button>Commit</button>
				<button>Push</button>
				<button onclick={() => suspend()}>Suspend</button>
				<button onclick={() => resume()}>Resume</button>
			</div>
		</div>
	</div>

	<div class="message-container">{message}</div>
</div>

<style lang="css">
	.list {
		height: 230px;
		overflow-y: auto;
	}

	.message-container {
		max-height: 150px;
	}

	.branch:hover, .branch.current {
		background: rgba(0, 0, 0, 0.11);
		cursor: pointer;
	}

	.tigr-container {
		font-family: Consolas;
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin: 24px;
	}

	.bottom-container {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}

	.bottom-container .vertical-container {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 24px;
	}

	#branches, #commits, #stage {
		border: 1px solid black;
		overflow-y: auto;
	}
	
	#actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.input-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
	}

	#input-repo {
		width: 300px;
	}

	#actions button {
		padding: 16px;
		font-size: 120%;
	}
</style>
