import { writable } from "svelte/store";
import type { GitToolConfig } from "./repository-store";

export const config = writable<GitToolConfig>({});