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
    let repositories: string[] = [];
    let store: Store | undefined = undefined;
    let config: GitToolConfig | undefined = undefined;

    onMount(async () => {
        store = await load("store.json", { autoSave: true });
        console.log(store);
        config = await store?.get<GitToolConfig>("git-tool-store");
        console.log(config);
        repoPath = config?.selected || "";
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
            await store?.set("git-tool-store", { selected: path });
            message = `Added repository: ${path}`;

            await getBranches();
        } else {
            message = `Not a valid git repository: ${path}`;
        }
    }
</script>

<main class="container">
    <p>{message}</p>
    <p>{repoPath}</p>

    <div class="branches">
        {#each branches as branch}
            <p>{branch}</p>
        {/each}
    </div>

    <button type="button" onclick={getBranches}>Branches</button>
    <button type="button" onclick={addRepository}>Add Repository</button>
</main>

<style>
    .branches {
        overflow-y: auto;
        height: 200px;
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>
