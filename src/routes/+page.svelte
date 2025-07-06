<script lang="ts">
	import { Git } from "$lib/git";
	import { config } from "$lib/store";
	import type { GitToolConfig } from "$lib/repository-store";
	import { open } from "@tauri-apps/plugin-dialog";
	import { load, Store } from "@tauri-apps/plugin-store";
	import { onMount } from "svelte";
	import RepositorySelector from "$lib/components/RepositorySelector.svelte";
	import BranchList from "$lib/components/BranchList.svelte";

	let branches = $state<string[]>([]);
	let message = $state("");
	let git: Git | null = null;
	let store: Store | undefined = undefined;

	async function initialize() {
		store = await load("store.json", { autoSave: true });
		const storedConfig = await store?.get<GitToolConfig>("git-tool-store");
		if (storedConfig) {
			$config = storedConfig;
		}

		if (!$config.selected && $config.repositories && $config.repositories.length > 0) {
			$config.selected = $config.repositories[0];
			await store?.set("git-tool-store", $config);
		}

		if ($config.selected) {
			git = await Git.create($config.selected);
			await getBranches();
		}
	}

	onMount(async () => {
		await initialize();
	});

	async function getBranches() {
		if (!git) {
			message = "No repository selected";
			return;
		}

		let { result, error } = await git.getBranches(["--all"]);
        console.log(result);
		if (error) {
			message = `Error: ${error}`;
		} else {
			branches = result.all;
			message = `Retrieved branches`;
		}
	}

	async function addRepository() {
		const file = await open({
			multiple: false,
			directory: true,
			title: "Add Repository"
		});

		if (typeof file !== "string") return;

		const path = file.replaceAll("\\", "/");
		const isGitRepo = await Git.isGitRepository(path);

		if (!isGitRepo) {
			message = `Not a valid git repository: ${path}`;
			return;
		}

		$config.selected = path;
		if (!$config.repositories?.includes(path)) {
			$config.repositories = [...($config.repositories ?? []), path];
		}
		await store?.set("git-tool-store", $config);
		git = await Git.create(path);
		message = `Added repository: ${path}`;
		await getBranches();
	}

	async function handleRepoSelection(detail: { repo: string }) {
		const { repo } = detail;
		$config.selected = repo;
		git = await Git.create(repo);
		await store?.set("git-tool-store", $config);
		message = `Selected repository: ${repo}`;
		await getBranches();
	}

	function handleCheckout(detail: { branch: string }) {
		const { branch } = detail;
		message = `Checked out branch: ${branch}`;
		getBranches();
	}

	function handleError(detail: { message: string }) {
		message = detail.message;
	}
</script>

<main class="container">
	<RepositorySelector onSelect={handleRepoSelection} />
	<div class="layout">
		<BranchList {git} {branches} onCheckout={handleCheckout} onError={handleError} />
	</div>

	<button type="button" onclick={getBranches}>Branches</button>
	<button type="button" onclick={addRepository}>Add Repository</button>

	<p>{message}</p>
</main>

<style>
	.layout {
		display: flex;
		flex-direction: row;
		gap: 8px;
		height: 320px;
	}

	.scroll-region {
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 10px;

		div {
			padding: 0.5rem 0.25rem;
		}

		.selected {
			background-color: rgba(0, 123, 255, 0.1);
		}
	}
</style>
