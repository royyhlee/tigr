import { invoke } from "@tauri-apps/api/core";
import { type GitCommand } from "./git-commands";

export default function git(params: {repoPath: string, cmd: GitCommand, args?: string[]}) {
  const { repoPath, cmd,args } = params;

  return invoke<string>("git", {
    repoPath,
    args: [cmd, ...(args ?? [])],
  });
}
