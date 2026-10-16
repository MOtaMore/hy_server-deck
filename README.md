# 🎮 HY Server-Deck (Rust Edition)

**English** • [Español](README.es.md)

High-performance native application written in **Rust** (with Tauri v2 frontend) built specifically for the **Steam Deck** (SteamOS / Arch Linux). Easily deploy, manage, and orchestrate **Hytale dedicated servers** using native **rootless Podman** on SteamOS, with zero external Python dependencies and an advanced anti-desynchronization engine.

---

## 🌟 Key Features

- **Built 100% in Rust + Tauri v2:**
  - Instant startup speed, minimal RAM overhead, and native compiled execution.
  - Completely eliminates Python virtual environment (`venv`) issues, GUI thread lockups, and heavy memory usage.
- **Multi-Language Support (i18n):**
  - Seamless real-time language switcher supporting **English (default)**, **Spanish**, **French**, and **Portuguese**, with automatic fallback.
- **Podman Anti-Desynchronization Engine:**
  - **Mutex Serialization:** All state-mutating operations (`deploy`, `start`, `stop`, `restart`, `repair`) are sequentially queued through an asynchronous Rust actor (`tokio::sync::Mutex`), preventing Podman database and storage locks (`storage.db`).
  - **Structured JSON Inspection:** Queries Podman container states directly using `--format json` with deep inspection of the infra-container, `hy-server`, `hy-playit`, and `hy-ssh`.
  - **Automatic Reconciliation & Healing:** Detects when the primary Hytale container has failed or when the pod enters a `Degraded` state, providing an automated 1-click healing routine to remove orphaned containers, fix rootless permissions with `podman unshare chown -R 0:0`, and cleanly resync the pod.
  - **Steam Gaming Mode Overlay Immunity:** Automatically strips `LD_PRELOAD` and cleans `gameoverlayrenderer.so` warnings to ensure uninterrupted execution when running directly from Steam Gaming Mode.
- **Hytale Server Channel & Engine Control:**
  - Support for official release channels and community-tested container images (`ghcr.io/terkea/hytale-server:latest`, `docker.io/deinfreu/hytale-server:latest`, preview/snapshots, or custom images).
  - Ahead-Of-Time (AOT) cache optimization toggle for smoother tick rates and lower APU overhead on the Steam Deck.
- **Flexible Connectivity (Public IP vs Playit.gg):**
  - **Public IP:** Automatic detection of Local LAN and Public Internet IP. Step-by-step router guide for forwarding **UDP 5520** (QUIC Game Traffic), **UDP 5521** (Query), and **TCP 2223** (SFTP).
  - **Playit.gg Tunnels:** Integrated `hy-playit` agent container with `SECRET_KEY` support, allowing you to play with friends over the Internet without port forwarding or exposing your home IP.
- **Remote SFTP / SSH Access:**
  - Dedicated `hy-ssh` container mapped to `/servidor-hy` (`~/hytale-server/data`) on port `2223` (isolated to prevent collisions with Minecraft Server Deck on port 2222) for uploading worlds, universe data, mods, and plugins wirelessly from your main PC using FileZilla or WinSCP.
- **Interactive Live Console & Log Streaming:**
  - Send live Hytale console commands (`/op add`, `/backup`, `/player list`, `/weather set clear`, `/auth status`, `/help`, etc.) with convenient touch-friendly quick action macros.
- **OLED Anti-Burn-In Screensaver:**
  - Built-in screensaver with pure black background (`#000000` to turn off OLED pixels on the Steam Deck OLED panel) and a DVD bouncing logo to keep your server running continuously without panel wear.

---

## 🏗 Container Architecture in Podman

The application manages a single rootless user-space Pod named `hy-pod` mapping:
- `5520:5520/udp` (Hytale Dedicated Server QUIC / UDP Traffic)
- `5521:5521/udp` (Hytale Query and Status Protocol)
- `2223:2222` (SFTP / SSH Access TCP)

### Containers inside `hy-pod`:
1. **`hy-server` (`ghcr.io/terkea/hytale-server:latest` / `deinfreu/hytale-server:latest`):**
   - Runs the Hytale dedicated server with interactive stdin/TTY and persistent data volume at `~/hytale-server/data:/home/container:Z` and `/data:Z`.
2. **`hy-playit` (`ghcr.io/playit-cloud/playit-agent:latest`):**
   - Official Playit.gg tunnel agent container activated when a secret key is provided or tunnel mode is selected.
3. **`hy-ssh` (`lscr.io/linuxserver/openssh-server:latest`):**
   - SFTP server on port 2223 for remote wireless file and world management.

---

## 🚀 Installation on Steam Deck

### Step 1: Switch to Desktop Mode
1. Press the physical **STEAM** button on your Steam Deck.
2. Go to **Power** -> **Switch to Desktop**.

### Step 2: Clone and Run Installer
Open **Konsole** (SteamOS terminal) and run:

```bash
git clone https://github.com/MOtaMore/hy_server-deck.git
cd hy_server-deck
chmod +x install.sh
./install.sh
```

The script will configure directories, build the frontend and binary (or use the pre-compiled binary if present), and create desktop shortcuts in both `~/Desktop/HY-Server-Deck.desktop` and your SteamOS application launcher.

---

## 🎮 Add to Steam (Gaming Mode)

1. In Desktop Mode, open the **Steam** desktop client.
2. In the top menu, click **Games** -> **Add a Non-Steam Game to My Library...**.
3. Select **HY Server-Deck** (or browse to `~/.local/share/hy-server-deck/hy-server-deck`).
4. Click **Add Selected Programs**.
5. Switch back to **Gaming Mode**. The application is ready to launch with full 1280x800 touch screen and controller support!

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
