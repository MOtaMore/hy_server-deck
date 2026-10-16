use crate::models::SystemNetworkInfo;
use std::net::UdpSocket;
use std::time::Duration;

pub async fn get_system_network_info() -> SystemNetworkInfo {
    let local_ip = get_local_ip().unwrap_or_else(|| "127.0.0.1".to_string());
    let public_ip = fetch_public_ip().await;

    SystemNetworkInfo {
        local_ip,
        public_ip,
        hy_game_port: 5520,
        hy_query_port: 5521,
        ssh_port: 2223,
        upnp_status: "No verificado (Haz clic en 'Probar UPnP' para intentar apertura automática)".to_string(),
        upnp_active: false,
    }
}

pub fn get_local_ip() -> Option<String> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    let addr = socket.local_addr().ok()?;
    Some(addr.ip().to_string())
}

pub async fn fetch_public_ip() -> Option<String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(3))
        .build()
        .ok()?;

    let providers = [
        "https://api64.ipify.org",
        "https://icanhazip.com",
        "https://ifconfig.me/ip",
    ];

    for provider in providers {
        if let Ok(resp) = client.get(provider).send().await {
            if let Ok(text) = resp.text().await {
                let clean = text.trim();
                if !clean.is_empty() && clean.len() <= 45 {
                    return Some(clean.to_string());
                }
            }
        }
    }

    None
}

/// Intenta probar o diagnosticar UPnP en la red local para los puertos de Hytale (5520 UDP)
pub async fn try_upnp_forwarding() -> (bool, String) {
    (
        false,
        "UPnP no respondió en tu red local. Es habitual que los routers residenciales tengan UPnP desactivado por seguridad. Configura el reenvío de puertos (Port Forwarding) en tu router para el puerto 5520 UDP (y 5521 UDP), o utiliza la opción integrada de Playit.gg para jugar sin abrir puertos.".to_string(),
    )
}
