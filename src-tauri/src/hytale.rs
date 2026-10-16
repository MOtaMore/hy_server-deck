use crate::models::{HytaleVersionItem, HytaleVersionsResponse};

pub async fn fetch_hytale_versions() -> HytaleVersionsResponse {
    // Presets for Hytale Dedicated Server builds and channels
    let versions = vec![
        HytaleVersionItem {
            id: "release-latest".to_string(),
            name: "Hytale Official (Latest Release)".to_string(),
            channel: "release".to_string(),
            description: "Official production build with stable multiplayer networking".to_string(),
            image_tag: "ghcr.io/terkea/hytale-server:latest".to_string(),
        },
        HytaleVersionItem {
            id: "deinfreu-server".to_string(),
            name: "Hytale Community Server (Deinfreu)".to_string(),
            channel: "release".to_string(),
            description: "Popular community image with automated config.json injection".to_string(),
            image_tag: "docker.io/deinfreu/hytale-server:latest".to_string(),
        },
        HytaleVersionItem {
            id: "preview-channel".to_string(),
            name: "Hytale Preview / Snapshot Channel".to_string(),
            channel: "preview".to_string(),
            description: "Testing channel for upcoming features and experimental world gen".to_string(),
            image_tag: "ghcr.io/terkea/hytale-server:preview".to_string(),
        },
        HytaleVersionItem {
            id: "custom-image".to_string(),
            name: "Custom / Local Container Image".to_string(),
            channel: "custom".to_string(),
            description: "Use any custom OCI / Docker container image tag".to_string(),
            image_tag: "custom".to_string(),
        },
    ];

    HytaleVersionsResponse {
        latest_release: "release-latest".to_string(),
        latest_preview: "preview-channel".to_string(),
        versions,
    }
}
