use crate::hytale::fetch_hytale_versions;
use crate::models::{HytaleVersionsResponse, PodStatus, ServerConfig, SystemNetworkInfo};
use crate::network::{get_system_network_info, try_upnp_forwarding};
use crate::podman::SharedPodmanEngine;
use crate::steamos::SteamOSHelper;
use tauri::State;

#[tauri::command]
pub async fn get_status(state: State<'_, SharedPodmanEngine>) -> Result<PodStatus, String> {
    Ok(state.get_pod_status_detailed().await)
}

#[tauri::command]
pub async fn deploy_server(
    config: ServerConfig,
    state: State<'_, SharedPodmanEngine>,
) -> Result<String, String> {
    state.deploy_server(config).await
}

#[tauri::command]
pub async fn start_server(state: State<'_, SharedPodmanEngine>) -> Result<String, String> {
    state.start_pod().await
}

#[tauri::command]
pub async fn stop_server(state: State<'_, SharedPodmanEngine>) -> Result<String, String> {
    state.stop_pod().await
}

#[tauri::command]
pub async fn restart_server(state: State<'_, SharedPodmanEngine>) -> Result<String, String> {
    state.restart_pod().await
}

#[tauri::command]
pub async fn repair_pod(state: State<'_, SharedPodmanEngine>) -> Result<String, String> {
    state.repair_and_reconcile().await
}

#[tauri::command]
pub async fn send_command(
    command: String,
    state: State<'_, SharedPodmanEngine>,
) -> Result<String, String> {
    state.send_command(&command).await
}

#[tauri::command]
pub async fn get_logs(
    tail: usize,
    state: State<'_, SharedPodmanEngine>,
) -> Result<String, String> {
    state.get_server_logs(tail).await
}

#[tauri::command]
pub async fn get_hytale_versions() -> Result<HytaleVersionsResponse, String> {
    Ok(fetch_hytale_versions().await)
}

#[tauri::command]
pub async fn get_network_info() -> Result<SystemNetworkInfo, String> {
    Ok(get_system_network_info().await)
}

#[tauri::command]
pub async fn test_upnp() -> Result<(bool, String), String> {
    Ok(try_upnp_forwarding().await)
}

#[tauri::command]
pub async fn load_config(state: State<'_, SharedPodmanEngine>) -> Result<ServerConfig, String> {
    Ok(state.load_config())
}

#[tauri::command]
pub async fn save_config(
    config: ServerConfig,
    state: State<'_, SharedPodmanEngine>,
) -> Result<(), String> {
    state.save_config(&config);
    Ok(())
}

#[tauri::command]
pub async fn install_shortcuts() -> Result<String, String> {
    SteamOSHelper::install_desktop_shortcuts(None)
}

#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        tokio::process::Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| format!("Error xdg-open: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        tokio::process::Command::new("cmd")
            .args(&["/C", "start", "", &url])
            .spawn()
            .map_err(|e| format!("Error opening browser: {}", e))?;
    }
    Ok(())
}
