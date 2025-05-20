export type  GitCommand = 'status' | 'log' | 'branch' | 'checkout' | 'pull' | 'push' | 'fetch' | 'merge' | 'rebase' | 'reset' | 'diff' | 'add' | 'commit' | 'cherry-pick' | 'revert';

export type GitArgs = {
  [K in GitCommand]?: string[];
};
