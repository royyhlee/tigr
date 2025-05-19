<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { watch } from "@tauri-apps/plugin-fs";

    const repoPath = "/Users/royyhlee/Projects/yumz";

    let status = $state("");
    async function gitStatus() {
        status = await invoke("git_status", { repoPath });

        console.log({ status });
    }

    let branches = $state<string[]>([]);
    async function gitBranches() {
        const result: string = await invoke("git_branches", { repoPath });

        branches = result.split("\n").filter((branch) => branch.length > 0);

        console.log({ branches });
    }

    watch(
        repoPath,
        (event) => {
            console.log("File changed:", event);
        },
        {
            delayMs: 1000,
            recursive: true,
        },
    );
</script>

<main class="container">
    <button type="button" onclick={gitStatus}>Status</button>
    <button type="button" onclick={gitBranches}>Branches</button>

    <p>{status}</p>
    <ul>
        {#each branches as branch}
            <li>{branch}</li>
        {/each}
    </ul>
</main>

<style></style>
