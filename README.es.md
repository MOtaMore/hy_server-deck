# 🎮 Hy Server-Deck (Edición en Rust)

[English](README.md) • **Español**

Aplicación nativa de alto rendimiento escrita en **Rust** (con frontend en Tauri v2) diseñada específicamente para la **Steam Deck** (SteamOS / Arch Linux). Despliega, administra y orquesta servidores dedicados de **Hytale** utilizando **Podman rootless** nativo en SteamOS, sin dependencias externas de Python y con un motor avanzado anti-desincronización.

---

## 🌟 Características Principales

- **Construido 100% en Rust + Tauri v2:**
  - Arranque instantáneo, consumo mínimo de memoria RAM y ejecución nativa compilada.
  - Elimina por completo problemas con entornos virtuales de Python (`venv`), congelamientos de la interfaz gráfica y sobrecarga en el sistema.
- **Soporte Multi-Idioma (i18n):**
  - Selector de idioma en tiempo real con soporte para **Inglés (predeterminado)**, **Español**, **Francés** y **Portugués**, con respaldo automático.
- **Motor Anti-Desincronización en Podman:**
  - **Serialización por Mutex:** Todas las operaciones que alteran el estado (`deploy`, `start`, `stop`, `restart`, `repair`) se encolan secuencialmente a través de un actor asíncrono en Rust (`tokio::sync::Mutex`), previniendo bloqueos de base de datos y almacenamiento (`storage.db`).
  - **Inspección JSON Estructurada:** Consulta el estado de los contenedores directamente con `--format json`, inspeccionando a fondo el contenedor infra, `hy-server`, `hy-playit` y `hy-ssh`.
  - **Reconciliación y Autocuración Automática:** Detecta si el contenedor principal de Hytale ha fallado o si el pod entra en estado `Degraded`, proporcionando una rutina de curación en 1 clic para remover contenedores huérfanos, corregir permisos rootless con `podman unshare chown -R 0:0` y volver a sincronizar el pod limpiamente.
  - **Inmunidad al Overlay de Steam en Modo Juego:** Remueve automáticamente la variable `LD_PRELOAD` y filtra avisos de `gameoverlayrenderer.so` para garantizar que la aplicación funcione a la perfección directamente desde el Modo Juego (Gaming Mode).
- **Control de Canales y Motor de Hytale:**
  - Soporte para versiones oficiales y contenedores comunitarios probados (`ghcr.io/terkea/hytale-server:latest`, `docker.io/deinfreu/hytale-server:latest`, canal de vista previa/snapshots o imágenes personalizadas).
  - Selector para optimización de caché Ahead-Of-Time (AOT), logrando tasas de tick más estables y menor fatiga para la APU de la consola.
- **Conectividad Flexible (IP Pública vs Playit.gg):**
  - **IP Pública:** Detección automática de la IP local WiFi y la IP pública de Internet. Incluye guía paso a paso de apertura de puertos en el router para **UDP 5520** (tráfico QUIC del juego), **UDP 5521** (consultas de estado) y **TCP 2223** (SFTP).
  - **Túneles Playit.gg:** Contenedor agente integrado `hy-playit` con soporte para `SECRET_KEY`, permitiéndote jugar con amigos por Internet sin necesidad de abrir puertos ni exponer tu IP residencial.
- **Acceso Remoto SFTP / SSH:**
  - Contenedor dedicado `hy-ssh` mapeado a `/servidor-hy` (`~/hytale-server/data`) en el puerto `2223` (aislado para no colisionar si tienes MC Server Deck en el puerto 2222), permitiendo subir mundos, datos de universos, mods y scripts de forma inalámbrica desde tu PC principal mediante FileZilla o WinSCP.
- **Consola en Vivo y Transmisión de Logs:**
  - Envía comandos de consola en directo (`/op add`, `/backup`, `/player list`, `/weather set clear`, `/auth status`, `/help`, etc.) con macros táctiles optimizados para la pantalla táctil de la consola.
- **Salvapantallas OLED Anti-Quemado:**
  - Modo salvapantallas integrado con fondo negro absoluto (`#000000` para apagar por completo los píxeles en el panel OLED de la Steam Deck) y logo rebotando estilo DVD/CRT para mantener el servidor activo indefinidamente sin desgaste de pantalla.

---

## 🏗 Arquitectura de Contenedores en Podman

La aplicación gestiona un único Pod en espacio de usuario rootless denominado `hy-pod` con los mapeos:
- `5520:5520/udp` (Tráfico del Servidor Dedicado de Hytale QUIC / UDP)
- `5521:5521/udp` (Protocolo de Consulta y Estado de Hytale)
- `2223:2222` (Acceso SFTP / SSH TCP)

### Contenedores dentro de `hy-pod`:
1. **`hy-server` (`ghcr.io/terkea/hytale-server:latest` / `deinfreu/hytale-server:latest`):**
   - Ejecuta el servidor dedicado de Hytale con stdin/TTY interactivo y volumen persistente en `~/hytale-server/data:/home/container:Z` y `/data:Z`.
2. **`hy-playit` (`ghcr.io/playit-cloud/playit-agent:latest`):**
   - Agente de túneles Playit.gg activado automáticamente cuando se especifica una clave secreta o se elige el modo túnel.
3. **`hy-ssh` (`lscr.io/linuxserver/openssh-server:latest`):**
   - Servidor SFTP en el puerto 2223 para gestión inalámbrica de archivos, mundos y configuraciones.

---

## 🚀 Instalación en Steam Deck

### Paso 1: Cambiar a Modo Escritorio
1. Pulsa el botón físico **STEAM** en tu Steam Deck.
2. Ve a **Encendido (Power)** -> **Cambiar a Escritorio (Switch to Desktop)**.

### Paso 2: Clonar y Ejecutar el Instalador
Abre **Konsole** (terminal de SteamOS) y ejecuta:

```bash
git clone https://github.com/MOtaMore/hy_server-deck.git
cd hy_server-deck
chmod +x install.sh
./install.sh
```

El script configurará las rutas, compilará el frontend y el binario (o usará el binario precompilado si está disponible) y creará accesos directos en el **Escritorio** (`~/Desktop/Hy-Server-Deck.desktop`) y en el menú de aplicaciones de SteamOS.

---

## 🎮 Añadir a Steam (Modo Juego)

1. En Modo Escritorio, abre el cliente de **Steam**.
2. En el menú superior, haz clic en **Productos (Games)** -> **Añadir un juego que no es de Steam a mi biblioteca...**.
3. Selecciona **Hy Server-Deck** (o navega hasta `~/.local/share/hy-server-deck/hy-server-deck`).
4. Haz clic en **Añadir los programas seleccionados**.
5. Regresa al **Modo Juego (Gaming Mode)**. ¡La aplicación está lista para lanzarse a 1280x800 con soporte total táctil y para mandos!

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
