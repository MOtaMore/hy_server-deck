use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    #[serde(default = "default_server_name")]
    pub server_name: String,
    #[serde(default = "default_version_channel")]
    pub version_channel: String, // "release", "preview", "experimental"
    #[serde(default = "default_server_image")]
    pub server_image: String,
    #[serde(default = "default_memory")]
    pub memory: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_query_port")]
    pub query_port: u16,
    #[serde(default = "default_max_players")]
    pub max_players: u32,
    #[serde(default = "default_view_radius")]
    pub max_view_radius: u32,
    #[serde(default = "default_true")]
    pub use_aot_cache: bool,
    #[serde(default = "default_true")]
    pub prod_mode: bool,
    #[serde(default = "default_motd")]
    pub motd: String,
    #[serde(default = "default_connection_mode")]
    pub connection_mode: String, // "public_ip" or "playit"
    #[serde(default)]
    pub playit_key: String,
    #[serde(default = "default_true")]
    pub enable_ssh: bool,
    #[serde(default = "default_ssh_user")]
    pub ssh_user: String,
    #[serde(default = "default_ssh_pass")]
    pub ssh_pass: String,
    #[serde(default = "default_ssh_port")]
    pub ssh_port: u16,
    #[serde(default)]
    pub custom_env: HashMap<String, String>,
}

fn default_server_name() -> String { "Hytale Server on Steam Deck".to_string() }
fn default_version_channel() -> String { "release".to_string() }
fn default_server_image() -> String { "ghcr.io/terkea/hytale-server:latest".to_string() }
fn default_memory() -> String { "4G".to_string() }
fn default_port() -> u16 { 5520 }
fn default_query_port() -> u16 { 5521 }
fn default_max_players() -> u32 { 20 }
fn default_view_radius() -> u32 { 8 }
fn default_true() -> bool { true }
fn default_connection_mode() -> String { "public_ip".to_string() }
fn default_ssh_user() -> String { "adminhy".to_string() }
fn default_ssh_pass() -> String { "hydeck123".to_string() }
fn default_ssh_port() -> u16 { 2223 }
fn default_motd() -> String { "Servidor Hytale en Steam Deck (Podman)".to_string() }

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            server_name: default_server_name(),
            version_channel: default_version_channel(),
            server_image: default_server_image(),
            memory: default_memory(),
            port: default_port(),
            query_port: default_query_port(),
            max_players: default_max_players(),
            max_view_radius: default_view_radius(),
            use_aot_cache: true,
            prod_mode: true,
            motd: default_motd(),
            connection_mode: default_connection_mode(),
            playit_key: String::new(),
            enable_ssh: true,
            ssh_user: default_ssh_user(),
            ssh_pass: default_ssh_pass(),
            ssh_port: default_ssh_port(),
            custom_env: HashMap::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerState {
    pub name: String,
    pub status: String, // "running", "exited", "created", "dead", "not found"
    pub exit_code: Option<i64>,
    pub uptime: Option<String>,
    pub id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PodStatus {
    pub status: String, // "Running", "Degraded", "Stopped", "Exited", "Not Created", "No Podman"
    pub containers: HashMap<String, ContainerState>,
    pub is_healthy: bool,
    pub desync_detected: bool,
    pub desync_reason: Option<String>,
    pub last_checked: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemNetworkInfo {
    pub local_ip: String,
    pub public_ip: Option<String>,
    pub hy_game_port: u16,   // Default 5520 UDP
    pub hy_query_port: u16,  // Default 5521 UDP
    pub ssh_port: u16,       // Default 2223 TCP
    pub upnp_status: String,
    pub upnp_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HytaleVersionItem {
    pub id: String,
    pub name: String,
    pub channel: String, // "release", "preview", "custom"
    pub description: String,
    pub image_tag: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HytaleVersionsResponse {
    pub latest_release: String,
    pub latest_preview: String,
    pub versions: Vec<HytaleVersionItem>,
}
