<script lang="ts">
    import git from "../lib/git";

    let repoPath = $state('C:/Users/ylee/Projects/sandbox/apt-git-tool');
    let branches = $state<string[]>([]);

    async function getBranches() {
        try {
            const result = await git({ repoPath, cmd: 'branch', args: ['--all'] });
            branches = result.split('\n').map(branch => branch.trim()).filter(branch => branch);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }

</script>

<main class="container">
    <p>{repoPath}</p>
    {#each branches as branch}
        <p>{branch}</p>
    {/each}
    <button type="button" onclick={getBranches}>Branches</button>
</main>

<style></style> 
