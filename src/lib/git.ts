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

export type GitArgs = {
  [K in GitCommand]?: string[];
};

export function invokeGit(params: {
  repoPath: string;
  cmd: GitCommand;
  args?: string[];
}) {
  const { repoPath, cmd, args } = params;

  return invoke<string>("git", {
    repoPath,
    args: [cmd, ...(args ?? [])],
  });
}

export class Git {
  constructor(private repoPath: string) {}

  async getBranches(args?: string[]) {
    try {
      const result = await invokeGit({
        repoPath: this.repoPath,
        cmd: "branch",
        args: [...(args ?? [])],
      });

      const branches = result
        .split("\n")
        .map(branch => branch.trim())
        .filter(branch => branch);

      return { result: branches };
    } catch (error) {
      return { error, result: [] };
    }
  }

  static async create(repoPath: string) {
    const isGitRepo = await Git.isGitRepository(repoPath);
    return isGitRepo ? new Git(repoPath) : null;

  }

  static async isGitRepository(repoPath: string) {
    const result = await invokeGit({
      repoPath,
      cmd: "rev-parse",
      args: ["--is-inside-work-tree"],
    });

    return result.trim() === "true";
  }
}
