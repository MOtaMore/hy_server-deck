use crate::models::{ContainerState, PodStatus, ServerConfig};
use chrono::Local;
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Stdio;
use std::sync::Arc;
use tokio::process::Command;
use tokio::sync::Mutex;

pub struct PodmanEngine {
    pub base_dir: PathBuf,
    pub data_dir: PathBuf,
    pub ssh_config_dir: PathBuf,
    pub config_file: PathBuf,
    operation_lock: Mutex<()>,
}

pub type SharedPodmanEngine = Arc<PodmanEngine>;

impl PodmanEngine {
    pub fn new() -> Self {
        let base_dir = dirs::home_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("hytale-server");

        let data_dir = base_dir.join("data");
        let ssh_config_dir = base_dir.join("ssh-config");
        let config_file = base_dir.join("hy_server_config.json");

        let _ = fs::create_dir_all(&data_dir);
        let _ = fs::create_dir_all(&ssh_config_dir);

        Self {
            base_dir,
            data_dir,
            ssh_config_dir,
            config_file,
            operation_lock: Mutex::new(()),
        }
    }

    /// Comprueba si podman está disponible en PATH
    pub async fn is_podman_available(&self) -> bool {
        let output = Command::new("podman")
            .env_remove("LD_PRELOAD")
            .arg("--version")
            .output()
            .await;
        output.map(|o| o.status.success()).unwrap_or(false)
    }

    /// Ejecuta un comando podman capturando stdout y stderr de forma segura
    pub async fn run_podman(&self, args: &[&str]) -> (bool, String) {
        let mut cmd = Command::new("podman");
        cmd.env_remove("LD_PRELOAD");
        cmd.args(args);
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        match cmd.output().await {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

                // Filtrar avisos inofensivos de ld.so / Steam overlay en Modo Juego (Game Mode)
                let clean_stderr = stderr
                    .lines()
                    .filter(|l| !l.contains("gameoverlayrenderer.so") && !l.contains("wrong ELF class"))
                    .collect::<Vec<_>>()
                    .join("\n")
                    .trim()
                    .to_string();

                let combined = match (stdout.is_empty(), clean_stderr.is_empty()) {
                    (false, false) => format!("{}\n{}", stdout, clean_stderr),
                    (false, true) => stdout,
                    (true, false) => clean_stderr,
                    (true, true) => String::new(),
                };

                (output.status.success(), combined)
            }
            Err(e) => (false, format!("Error al ejecutar podman: {}", e)),
        }
    }

    /// Inspección profunda del pod y sus contenedores para detectar desincronizaciones
    pub async fn get_pod_status_detailed(&self) -> PodStatus {
        let now = Local::now().format("%H:%M:%S").to_string();

        if !self.is_podman_available().await {
            return PodStatus {
                status: "No Podman".to_string(),
                containers: HashMap::new(),
                is_healthy: false,
                desync_detected: true,
                desync_reason: Some("Podman no está instalado o no se encuentra en el PATH de SteamOS.".to_string()),
                last_checked: now,
            };
        }

        // Consultar estado de hy-pod vía JSON estructurado
        let (success, out) = self.run_podman(&["pod", "inspect", "hy-pod", "--format", "json"]).await;

        if !success {
            return PodStatus {
                status: "Not Created".to_string(),
                containers: HashMap::new(),
                is_healthy: false,
                desync_detected: false,
                desync_reason: None,
                last_checked: now,
            };
        }

        let mut containers_map = HashMap::new();
        let mut desync_detected = false;
        let mut desync_reason: Option<String> = None;
        let mut pod_status_str = "Unknown".to_string();

        if let Ok(json_val) = serde_json::from_str::<Value>(&out) {
            if let Some(status) = json_val.get("State").and_then(|s| s.as_str()) {
                pod_status_str = status.to_string();
            } else if let Some(status) = json_val.get("Status").and_then(|s| s.as_str()) {
                pod_status_str = status.to_string();
            }

            // Normalizar a Title Case estándar
            pod_status_str = match pod_status_str.to_lowercase().as_str() {
                "running" => "Running".to_string(),
                "degraded" => "Degraded".to_string(),
                "stopped" | "exited" => "Stopped".to_string(),
                "created" => "Created".to_string(),
                _ => pod_status_str,
            };

            // Inspeccionar contenedores dentro del pod
            if let Some(containers) = json_val.get("Containers").and_then(|c| c.as_array()) {
                for c in containers {
                    let name = c.get("Name").and_then(|n| n.as_str()).unwrap_or("").to_string();
                    let state = c.get("State").and_then(|s| s.as_str()).unwrap_or("").to_string();
                    let id = c.get("Id").and_then(|i| i.as_str()).map(|s| s.to_string());

                    if !name.is_empty() && !name.ends_with("-infra") {
                        containers_map.insert(
                            name.clone(),
                            ContainerState {
                                name: name.clone(),
                                status: state.clone(),
                                exit_code: None,
                                uptime: None,
                                id,
                            },
                        );

                        // Si el contenedor del servidor de Hytale está detenido o falló
                        if name == "hy-server" && state != "running" {
                            desync_detected = true;
                            desync_reason = Some(format!(
                                "El contenedor principal 'hy-server' se encuentra en estado '{}'. El pod no está sirviendo Hytale.",
                                state
                            ));
                        }
                    }
                }
            }
        }

        // Si el pod está en estado Degraded
        if pod_status_str.to_lowercase() == "degraded" && !desync_detected {
            desync_detected = true;
            desync_reason = Some("El pod 'hy-pod' está en estado 'Degraded': uno o más de sus contenedores fallaron o se detuvieron inesperadamente.".to_string());
        }

        let is_healthy = (pod_status_str.to_lowercase() == "running") && !desync_detected;

        PodStatus {
            status: pod_status_str,
            containers: containers_map,
            is_healthy,
            desync_detected,
            desync_reason,
            last_checked: now,
        }
    }

    /// Despliega o actualiza el servidor de Hytale de forma atómica y sincronizada
    pub async fn deploy_server(&self, config: ServerConfig) -> Result<String, String> {
        let _guard = self.operation_lock.lock().await;

        if !self.is_podman_available().await {
            return Err("Podman no está disponible en este sistema.".to_string());
        }

        let data_path = self.data_dir.to_string_lossy().to_string();
        let ssh_config_path = self.ssh_config_dir.to_string_lossy().to_string();

        let game_port_str = format!("{}:{}/udp", config.port, config.port);
        let query_port_str = format!("{}:{}/udp", config.query_port, config.query_port);
        let ssh_port_str = format!("{}:2222", config.ssh_port);

        // 1. Asegurar o crear el Pod hy-pod
        let pod_status = self.get_pod_status_detailed().await;
        let pod_missing = pod_status.status.to_lowercase() == "not created" || pod_status.status == "Unknown";
        if pod_missing || pod_status.desync_detected {
            // Limpiar si había residuo desincronizado
            let _ = self.run_podman(&["pod", "rm", "-f", "hy-pod"]).await;

            let (created, out) = self.run_podman(&[
                "pod", "create",
                "--name", "hy-pod",
                "-p", &game_port_str,
                "-p", &query_port_str,
                "-p", &ssh_port_str,
            ]).await;

            if !created {
                return Err(format!("Error al crear el pod 'hy-pod': {}", out));
            }
        } else {
            // Asegurar que el pod esté en marcha
            let _ = self.run_podman(&["pod", "start", "hy-pod"]).await;
        }

        // 2. Limpiar hy-server previo
        let _ = self.run_podman(&["stop", "-t", "10", "hy-server"]).await;
        let _ = self.run_podman(&["rm", "-f", "hy-server"]).await;

        // 3. Preparar variables para contenedor de servidor Hytale
        let memory_str = if config.memory.is_empty() { "4G" } else { &config.memory };
        let max_players_str = config.max_players.to_string();
        let max_view_radius_str = config.max_view_radius.to_string();
        let port_env = format!("SERVER_PORT={}", config.port);
        let name_env = format!("SERVER_NAME={}", config.server_name);
        let motd_env = format!("MOTD={}", config.motd);
        let mem_env = format!("MEMORY={}", memory_str);
        let maxp_env = format!("MAX_PLAYERS={}", max_players_str);
        let view_env = format!("MAX_VIEW_RADIUS={}", max_view_radius_str);
        let aot_env = format!("USE_AOT_CACHE={}", if config.use_aot_cache { "true" } else { "false" });
        let prod_env = format!("PROD={}", if config.prod_mode { "TRUE" } else { "FALSE" });

        let mut server_args = vec![
            "run", "-d",
            "--name", "hy-server",
            "--pod", "hy-pod",
            "--restart", "unless-stopped",
            "-i", "-t",
            "-v",
        ];

        let vol1 = format!("{}:/home/container:Z", data_path);
        let vol2 = format!("{}:/data:Z", data_path);
        server_args.push(&vol1);
        server_args.push("-v");
        server_args.push(&vol2);

        server_args.extend_from_slice(&[
            "-e", &name_env,
            "-e", &motd_env,
            "-e", &port_env,
            "-e", &mem_env,
            "-e", &maxp_env,
            "-e", &view_env,
            "-e", &aot_env,
            "-e", &prod_env,
        ]);

        // Añadir variables de entorno personalizadas si existen
        let custom_envs: Vec<String> = config.custom_env
            .iter()
            .map(|(k, v)| format!("{}={}", k, v))
            .collect();
        for ce in &custom_envs {
            server_args.extend_from_slice(&["-e", ce]);
        }

        let image_to_run = if config.server_image.is_empty() {
            "ghcr.io/terkea/hytale-server:latest"
        } else {
            &config.server_image
        };
        server_args.push(image_to_run);

        let (server_ok, server_out) = self.run_podman(&server_args).await;
        if !server_ok {
            return Err(format!("Error al iniciar hy-server: {}", server_out));
        }

        // Asegurar que hy-pod y hy-server estén activos inmediatamente
        let _ = self.run_podman(&["pod", "start", "hy-pod"]).await;
        let _ = self.run_podman(&["start", "hy-server"]).await;

        // 4. Configurar hy-playit (Túnel Playit.gg)
        let _ = self.run_podman(&["stop", "-t", "5", "hy-playit"]).await;
        let _ = self.run_podman(&["rm", "-f", "hy-playit"]).await;

        let playit_key_clean = config.playit_key.trim();
        if config.connection_mode == "playit" || !playit_key_clean.is_empty() {
            let secret_env = format!("SECRET_KEY={}", playit_key_clean);
            let playit_args = vec![
                "run", "-d",
                "--name", "hy-playit",
                "--pod", "hy-pod",
                "--restart", "unless-stopped",
                "-e", &secret_env,
                "ghcr.io/playit-cloud/playit-agent:latest",
            ];
            let _ = self.run_podman(&playit_args).await;
        }

        // 5. Configurar hy-ssh (Acceso SSH / SFTP inalámbrico)
        let _ = self.run_podman(&["stop", "-t", "5", "hy-ssh"]).await;
        let _ = self.run_podman(&["rm", "-f", "hy-ssh"]).await;

        if config.enable_ssh {
            let ssh_user = if config.ssh_user.is_empty() { "adminhy" } else { &config.ssh_user };
            let ssh_pass = if config.ssh_pass.is_empty() { "hydeck123" } else { &config.ssh_pass };

            let u_env = format!("USER_NAME={}", ssh_user);
            let p_env = format!("USER_PASSWORD={}", ssh_pass);
            let ssh_vol_data = format!("{}:/servidor-hy:Z", data_path);
            let ssh_vol_conf = format!("{}:/config:Z", ssh_config_path);

            let ssh_args = vec![
                "run", "-d",
                "--name", "hy-ssh",
                "--pod", "hy-pod",
                "--restart", "unless-stopped",
                "-e", "PASSWORD_ACCESS=true",
                "-e", "PUID=1000",
                "-e", "PGID=1000",
                "-e", &u_env,
                "-e", &p_env,
                "-v", &ssh_vol_data,
                "-v", &ssh_vol_conf,
                "lscr.io/linuxserver/openssh-server:latest",
            ];
            let _ = self.run_podman(&ssh_args).await;
        }

        // 6. Guardar configuración en JSON
        self.save_config(&config);

        Ok("Servidor de Hytale desplegado y sincronizado correctamente en hy-pod.".to_string())
    }

    /// Inicia el pod existente, o si el contenedor hy-server no ha sido desplegado, lo despliega automáticamente
    pub async fn start_pod(&self) -> Result<String, String> {
        let status = self.get_pod_status_detailed().await;
        let server_exists = status.containers.contains_key("hy-server");

        // Si el pod no existe o hy-server no ha sido desplegado aún:
        if status.status.to_lowercase() == "not created" || !server_exists {
            let config = self.load_config();
            return self.deploy_server(config).await;
        }

        let _guard = self.operation_lock.lock().await;
        let (ok, _out) = self.run_podman(&["pod", "start", "hy-pod"]).await;
        if ok {
            // Asegurar que hy-server también arranque si estaba detenido
            let _ = self.run_podman(&["start", "hy-server"]).await;
            Ok("Pod y servidor de Hytale iniciados correctamente.".to_string())
        } else {
            // Si falló iniciar hy-pod (por ejemplo estado inconsistente), re-desplegar de forma limpia
            drop(_guard);
            let config = self.load_config();
            self.deploy_server(config).await
        }
    }

    /// Detiene el pod de forma limpia y segura
    pub async fn stop_pod(&self) -> Result<String, String> {
        let _guard = self.operation_lock.lock().await;
        let (ok, out) = self.run_podman(&["pod", "stop", "-t", "15", "hy-pod"]).await;
        if ok {
            Ok("Pod de Hytale detenido de forma segura.".to_string())
        } else {
            Err(format!("Error al detener el pod: {}", out))
        }
    }

    /// Reinicia los contenedores del pod
    pub async fn restart_pod(&self) -> Result<String, String> {
        let _guard = self.operation_lock.lock().await;
        let _ = self.run_podman(&["pod", "stop", "-t", "10", "hy-pod"]).await;
        let (ok, out) = self.run_podman(&["pod", "start", "hy-pod"]).await;
        if ok {
            Ok("Pod de Hytale reiniciado exitosamente.".to_string())
        } else {
            Err(format!("Error al reiniciar el pod: {}", out))
        }
    }

    /// Motor de Reconciliación y Reparación Anti-Desincronización:
    /// Limpia contenedores bloqueados o corruptos, resetea locks y vuelve a sincronizar el pod
    pub async fn repair_and_reconcile(&self) -> Result<String, String> {
        let _guard = self.operation_lock.lock().await;

        // 1. Detener forzosamente contenedores
        let _ = self.run_podman(&["stop", "-t", "5", "hy-server", "hy-playit", "hy-ssh"]).await;
        let _ = self.run_podman(&["rm", "-f", "hy-server", "hy-playit", "hy-ssh"]).await;
        let _ = self.run_podman(&["pod", "rm", "-f", "hy-pod"]).await;

        // 2. Corregir permisos de datos con podman unshare
        let data_path = self.data_dir.to_string_lossy().to_string();
        let _ = self.run_podman(&["unshare", "chown", "-R", "0:0", &data_path]).await;

        // 3. Cargar configuración guardada
        let config = self.load_config();
        let game_port_str = format!("{}:{}/udp", config.port, config.port);
        let query_port_str = format!("{}:{}/udp", config.query_port, config.query_port);
        let ssh_port_str = format!("{}:2222", config.ssh_port);

        // 4. Recrear el pod con los puertos canónicos
        let (created, out) = self.run_podman(&[
            "pod", "create",
            "--name", "hy-pod",
            "-p", &game_port_str,
            "-p", &query_port_str,
            "-p", &ssh_port_str,
        ]).await;

        if !created {
            return Err(format!("Fallo al recrear el pod limpio: {}", out));
        }

        drop(_guard); // Soltar lock temporalmente para llamar a deploy_server
        self.deploy_server(config).await
    }

    /// Ejecuta un comando en la consola del servidor de Hytale
    pub async fn send_command(&self, command: &str) -> Result<String, String> {
        let clean_cmd = command.trim();
        if clean_cmd.is_empty() {
            return Ok(String::new());
        }

        // En Hytale los comandos en consola se ejecutan directamente en el proceso del contenedor
        let mut cmd = Command::new("podman");
        cmd.env_remove("LD_PRELOAD");
        cmd.args(&["exec", "-i", "hy-server", "sh", "-c", clean_cmd]);
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        match cmd.output().await {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
                if output.status.success() {
                    Ok(if stdout.is_empty() { "Comando enviado.".to_string() } else { stdout })
                } else {
                    let err = if !stderr.is_empty() { stderr } else { stdout };
                    // Si exec directo con sh -c falla, intentar pasar directamente el comando como arg
                    let (alt_ok, alt_out) = self.run_podman(&["exec", "-i", "hy-server", clean_cmd]).await;
                    if alt_ok {
                        Ok(alt_out)
                    } else {
                        Err(format!("Error consola: {}", err))
                    }
                }
            }
            Err(e) => Err(format!("Error al ejecutar comando: {}", e)),
        }
    }

    /// Obtiene las últimas líneas de logs de hy-server combinando stdout y stderr de forma íntegra
    pub async fn get_server_logs(&self, tail_lines: usize) -> Result<String, String> {
        let tail_str = tail_lines.to_string();
        let mut cmd = Command::new("podman");
        cmd.env_remove("LD_PRELOAD");
        cmd.args(&["logs", "--tail", &tail_str, "hy-server"]);
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        match cmd.output().await {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout);
                let stderr = String::from_utf8_lossy(&output.stderr);

                let clean_stderr = stderr
                    .lines()
                    .filter(|l| !l.contains("gameoverlayrenderer.so") && !l.contains("wrong ELF class"))
                    .collect::<Vec<_>>()
                    .join("\n");

                let mut combined = String::new();
                if !stdout.trim().is_empty() {
                    combined.push_str(stdout.trim());
                }
                if !clean_stderr.trim().is_empty() {
                    if !combined.is_empty() {
                        combined.push('\n');
                    }
                    combined.push_str(clean_stderr.trim());
                }

                if output.status.success() || !combined.is_empty() {
                    Ok(combined)
                } else {
                    Err("No se pudieron obtener registros de hy-server.".to_string())
                }
            }
            Err(e) => Err(format!("Error al ejecutar podman logs: {}", e)),
        }
    }

    /// Guarda la configuración en disco
    pub fn save_config(&self, config: &ServerConfig) {
        if let Ok(json) = serde_json::to_string_pretty(config) {
            let _ = fs::write(&self.config_file, json);
        }
    }

    /// Carga la configuración guardada o retorna los valores por defecto
    pub fn load_config(&self) -> ServerConfig {
        if let Ok(content) = fs::read_to_string(&self.config_file) {
            if let Ok(cfg) = serde_json::from_str::<ServerConfig>(&content) {
                return cfg;
            }
        }
        ServerConfig::default()
    }
}
