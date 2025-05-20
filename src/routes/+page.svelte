<script lang="ts">
    import git from "../lib/git";

    const repoPath = 'C:/Users/ylee/Projects/sandbox/apt-git-tool';

    async function getBranches() {
        try {
            const branches = await git({ repoPath, cmd: 'branch', args: ['--all'] });
            console.log(branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }
</script>

<main class="container">
    <button type="button" onclick={getBranches}>Branches</button>
</main>

<style></style>
