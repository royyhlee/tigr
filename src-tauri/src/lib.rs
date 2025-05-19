mod git;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn git_status(repo_path: String) -> Result<String, String> {
    git::run_git_command(repo_path.into(), &["status", "--porcelain"])
}

#[tauri::command]
fn git_branches(repo_path: String) -> Result<String, String> {
    git::run_git_command(repo_path.into(), &["branch", "--all"])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![git_status, git_branches])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
