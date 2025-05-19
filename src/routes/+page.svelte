<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";

    let status = $state("");
    async function gitStatus(event: Event) {
        status = await invoke("git_status", {
            repoPath: "/Users/royyhlee/Projects/yumz",
        });

        console.log({ status });
    }

    let branches = $state<string[]>([]);
    async function gitBranches() {
        const result: string = await invoke("git_branches", {
            repoPath: "/Users/royyhlee/Projects/yumz",
        });

        branches = result.split("\n").filter((branch) => branch.length > 0);

        console.log({ branches });
    }
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
