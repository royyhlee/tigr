<script lang="ts">
    import { Git } from "$lib/git";
    import { open } from "@tauri-apps/plugin-dialog";
    import { onMount } from "svelte";

    let repoPath = $state('C:/Users/ylee/Projects/sandbox/apt-git-tool');
    let branches = $state<string[]>([]);
    let message = $state('');
    let git: Git | null = null;

    onMount(async () => {
        git = await Git.create(repoPath);
    });

    async function getBranches() {
        if (!git) {
            message = 'No repository selected';
            return;
        }

        let { result, error } = await git.getBranches(['--all']);
        if (error) {
            message = `Error: ${error}`;
        } else {
            branches = result;
            message = `Branches: ${result.join(', ')}`;
        }
    }

    async function openDirectory() {
        const file = await open({
            multiple: false,
            directory: true,
            title: 'Select Repository',
        });

        if (!file || typeof file !== 'string') return;

        const path = (file as string).replaceAll('\\', '\/');
        const isGitRepo = await Git.isGitRepository(path);

        if (isGitRepo) {
            repoPath = path;
            message = `Selected repository: ${path}`;
        } else {
            message = `Not a valid git repository: ${path}`;
        }
    }

</script>

<main class="container">
    <p>{ message }</p>
    <p>{repoPath}</p>

    {#each branches as branch}
        <p>{branch}</p>
    {/each}

    <button type="button" onclick={getBranches}>Branches</button>
    <button type="button" onclick={openDirectory}>Select Repository</button>
</main>

<style></style> 
