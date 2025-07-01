<script lang="ts">
    import { Git } from "$lib/git";
    import type { GitToolConfig } from "$lib/repository-store";
    import { open } from "@tauri-apps/plugin-dialog";
    import { load, Store } from "@tauri-apps/plugin-store";
    import { onMount } from "svelte";

    let repoPath = $state("");
    let branches = $state<string[]>([]);
    let message = $state("");
    let git: Git | null = null;
    let selectedRepo: string;
    let repositories: string[] = $state([]);
    let store: Store | undefined = undefined;
    let config: GitToolConfig | undefined = undefined;

    onMount(async () => {
        store = await load("store.json", { autoSave: true });
        console.log(store);
        config = await store?.get<GitToolConfig>("git-tool-store");
        console.log(config);
        repoPath = config?.selected || "";
        repositories = config?.repositories || [];
        git = await Git.create(config?.selected || "");
        await getBranches();
    });

    async function getBranches() {
        if (!git) {
            message = "No repository selected";
            return;
        }

        let { result, error } = await git.getBranches(["--all"]);
        if (error) {
            message = `Error: ${error}`;
        } else {
            branches = result;
            message = `Retrieved branches`;
        }
    }

    async function addRepository() {
        const file = await open({
            multiple: false,
            directory: true,
            title: "Add Repository",
        });

        if (!file || typeof file !== "string") return;

        const path = (file as string).replaceAll("\\", "/");
        const isGitRepo = await Git.isGitRepository(path);

        if (isGitRepo) {
            repoPath = path;

            if (!repositories.includes(path)) {
                repositories = [repositories || [], path].flat();
            }
            await store?.set("git-tool-store", {
                selected: path,
                repositories,
            });
            message = `Added repository: ${path}`;
            await getBranches();
        } else {
            message = `Not a valid git repository: ${path}`;
        }
    }

    async function selectRepository(e: Event) {
        const target = e.target as HTMLSelectElement;
        const repo = target.value;

        if (repo === null) return;
        repoPath = repo;
        git = await Git.create(repo);
        await store?.set("git-tool-store", {
            selected: repo,
            repositories,
        });
        message = `Selected repository: ${repo}`;
        await getBranches();
    }

    async function checkout(e: MouseEvent) {
        const target = e.target as HTMLButtonElement;
        const branch = target.textContent?.trim();

        if (!branch) return;

        if (!git) {
            message = "No repository selected";
            return;
        }

        const { result, error } = await git.checkout(branch);
        if (error) {
            message = `Error checking out branch ${branch}: ${error}`;
        } else {
            message = `Checked out branch: ${branch}`;
            await getBranches();
        }
    }

</script>

<main class="container">
    <select onchange={(e) => selectRepository(e)} bind:value={repoPath}>
        {#each repositories as repo}
            <option class={repoPath === repo ? "selected" : ""} value={repo}>{repo}</option>
        {/each}
    </select>
    <div class="layout">
        <div class="scroll-region">
            {#each branches as branch}
                <button type="button" on:click={() => checkout(e)}>{branch}</button>
            {/each}
        </div>
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
