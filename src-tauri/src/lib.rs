mod git;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn git(repo_path: String, args: Vec<String>) -> String {
    let arg_refs: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
    match git::run_git_command(repo_path.into(), &arg_refs) {
        Ok(output) => output,
        Err(err) => format!("Error: {}", err),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![git])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
