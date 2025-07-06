import { invoke } from "@tauri-apps/api/core";

export type GitCommand =
  | "status"
  | "log"
  | "branch"
  | "checkout"
  | "pull"
  | "push"
  | "fetch"
  | "merge"
  | "rebase"
  | "reset"
  | "diff"
  | "add"
  | "commit"
  | "cherry-pick"
  | "revert"
  | "rev-parse";

export class Git {
  constructor(private repoPath: string) { }

  private static invokeGitCommand(params: {
    repoPath: string;
    cmd: GitCommand;
    args?: string[];
  }) {
    const { repoPath, cmd, args } = params;
    return invoke<string>("git", {
      repoPath,
      args: [cmd, ...(args ?? [])]
    });
  }

  async getBranches(args?: string[]) {
    try {
      const result = await Git.invokeGitCommand({
        repoPath: this.repoPath,
        cmd: "branch",
        args: [...(args ?? [])]
      });

      const lines = result
        .split("\n")
        .map((branch) => branch.trim())
        .filter((branch) => branch);

      const currentBranch = lines.find((b) => b.startsWith("*"))?.substring(2);
      const allBranches = lines.map((b) => (b.startsWith("*") ? b.substring(2) : b));

      return { result: { all: allBranches, current: currentBranch } };
    } catch (error) {
      return { error, result: { all: [], current: undefined } };
    }
  }

  async checkout(branch: string) {
    try {
      const result = await Git.invokeGitCommand({
        repoPath: this.repoPath,
        cmd: "checkout",
        args: [branch]
      });
      return { result };
    } catch (error) {
      return { error };
    }
  }

  static async create(repoPath: string) {
    const isGitRepo = await Git.isGitRepository(repoPath);
    return isGitRepo ? new Git(repoPath) : null;
  }

  static async isGitRepository(repoPath: string) {
    try {
      const result = await this.invokeGitCommand({
        repoPath,
        cmd: "rev-parse",
        args: ["--is-inside-work-tree"]
      });
      return result.trim() === "true";
    } catch (error) {
      return false;
    }
  }
}
