// Internationalization (i18n) Module for Hy Server-Deck
// Primary / Default language: English (en)
// Fallback / Supported languages: Spanish (es), French (fr), Portuguese (pt)

export const translations = {
  en: {
    // Nav & Header
    "nav.dashboard": "Dashboard",
    "nav.config": "Configuration",
    "nav.network": "Network & Access",
    "nav.tools": "Tools & Steam",
    "header.title": "Hy Server-Deck",
    "header.subtitle": "Hytale Dedicated Server • Podman Native • SteamOS",
    "header.screensaver_title": "OLED Screensaver Mode (Anti-Burn-In)",

    // Status Badges & Labels
    "status.checking": "Checking...",
    "status.running": "Server Active",
    "status.degraded": "Desynchronized",
    "status.stopped": "Stopped",
    "status.not_created": "Not Created",
    "status.not_found": "Not Found",
    "status.attention_required": "Attention required",
    "status.server_stopped": "Server Stopped",
    "status.server_not_created": "Server Not Created",
    "status.synchronized": "Synchronized",
    "status.optimal": "Optimal",
    "status.active": "Active",
    "status.public_ip": "Public IP",
    "status.not_available": "Not available",
    "status.no_public_ip": "No Public IP detected",

    // Anti-Desync Banner
    "alert.desync_title": "Desynchronization detected in Pod:",
    "alert.desync_default_reason": "The Hytale container is not responding within the pod.",
    "alert.reconcile_repair": "Reconcile & Repair Pod",

    // Dashboard Cards
    "card.pod_title": "Podman Pod (`hy-pod`)",
    "card.pod_ports": "Mapped ports:",
    "card.pod_sync": "Synchronization:",
    "card.server_title": "Hytale Server (`hy-server`)",
    "card.server_version": "Build / Channel:",
    "card.server_ram": "Allocated RAM:",
    "card.conn_title": "Connection Mode",
    "card.conn_local_ip": "Local IP (WiFi):",
    "card.conn_public_ip": "Public IP:",
    "card.conn_detecting": "Detecting...",
    "card.ssh_title": "SFTP Access (`hy-ssh`)",
    "card.ssh_port": "SFTP Port:",
    "card.ssh_user": "User:",

    // Controls & Macros
    "controls.start": "Start Server",
    "controls.stop": "Stop Server",
    "controls.restart": "Restart",
    "controls.repair": "Repair Pod",
    "controls.repair_tooltip": "Reconcile container and reset Podman desyncs",
    "macros.label": "Quick Commands:",
    "macros.backup": "💾 Backup World",
    "macros.players": "👥 View Players",
    "macros.op": "⭐ Make OP",
    "macros.whitelist": "📋 Whitelist",
    "macros.weather": "☀️ Clear Weather",
    "macros.auth": "🔐 Auth Status",

    // Terminal / Console
    "terminal.title": "Server Console (Live Logs & Commands)",
    "terminal.autoscroll": "Auto-Scroll",
    "terminal.clear": "Clear",
    "terminal.initial_ready": "[Hy Server-Deck] Ready. Click 'Start Server' to begin.",
    "terminal.cleared_locally": "[Console cleared locally]",
    "terminal.input_placeholder": "Type a Hytale command (e.g. /help, /op add Player, /time set day)...",
    "terminal.send": "Send",

    // Config Tab - Banner
    "config.header_title": "Hytale Server Configuration Wizard",
    "config.header_desc": "Configure Hytale server channel, container engine, RAM and parameters. Your universe in ~/hytale-server/data will remain 100% safe.",

    // Config Tab - Section 1
    "config.section1_title": "1. Build Channel & Engine",
    "config.channel_label": "Server Build Channel:",
    "config.refresh_btn": "🔄 Refresh",
    "config.refresh_tooltip": "Query available container builds",
    "config.channel_helper": "Official or community dedicated server container distribution.",
    "config.image_label": "Container Image:",
    "config.server_name_label": "Server Display Name:",
    "config.motd_label": "Message of the Day (MOTD):",

    // Config Tab - Section 2
    "config.section2_title": "2. Performance & Simulation Parameters",
    "config.ram_label": "Allocated RAM:",
    "config.ram_recommended": "4G - 6G (Recommended for Steam Deck)",
    "config.view_radius_label": "Chunk View Radius:",
    "config.max_players_label": "Max Players:",
    "config.aot_cache_title": "Ahead-Of-Time (AOT) Cache",
    "config.aot_cache_desc": "Pre-compiles engine bytecode for smoother tick rates and eliminates APU stutter.",
    "config.prod_title": "Production Mode",
    "config.prod_desc": "Optimizes network packet aggregation and suppresses debug spam.",
    "config.save_deploy": "Save & Deploy Server in Pod",

    // Network Tab
    "network.tab_public_ip": "Option 1: Direct Connection via Public IP",
    "network.tab_playit": "Option 2: Playit.gg Tunnels (Zero Router Setup)",
    "network.addresses_title": "Server Connection Addresses",
    "network.local_friends": "For friends in your home (Local WiFi Network):",
    "network.internet_friends": "For friends on the Internet (Public IP):",
    "network.copy": "Copy",
    "network.copied": "Copied!",
    "network.fetching_public_ip": "Querying Public IP...",
    "network.ports_title": "Ports Used on your Steam Deck:",
    "network.port_game": "Hytale Game Traffic (QUIC / UDP)",
    "network.port_query": "Hytale Status & Query (UDP)",
    "network.port_sftp": "SFTP / SSH Access (Mods, Worlds & Configs)",
    "network.upnp_title": "Port Forwarding (WiFi Router)",
    "network.upnp_btn": "⚡ Try Automatic UPnP",
    "network.upnp_default": "You can test if your router allows automatic port forwarding via UPnP or configure it manually in the router web interface.",
    "network.router_guide_title": "How to forward ports on your Router (Step by Step):",
    "network.router_step1": "Open a browser on your PC or phone and access your router (usually <code>http://192.168.1.1</code> or <code>http://192.168.0.1</code>).",
    "network.router_step2": "Look for the section named <strong>Port Forwarding</strong>, <strong>Virtual Server</strong> or <strong>NAT</strong>.",
    "network.router_step3": "Add a rule for your Steam Deck's Local IP (<strong id='guide-local-ip'>192.168.x.x</strong>):<br>External & Internal Port: <strong>5520</strong> &bull; Protocol: <strong>UDP</strong>.",
    "network.router_step4": "(Optional): Add a rule for port <strong>5521</strong> with protocol <strong>UDP</strong> for server queries.",
    "network.router_step5": "Save changes on the router. Your friends can now connect using your Public IP on port 5520!",
    "network.playit_title": "Secure Playit.gg Tunnel (Zero Router Setup)",
    "network.playit_desc": "With Playit.gg you don't need to forward router ports or expose your public IP. The agent creates a secure tunnel directly to Playit servers.",
    "network.playit_key_label": "Playit.gg Secret Key:",
    "network.playit_placeholder": "Paste your Playit.gg secret key here",
    "network.playit_helper_pre": "Don't have an account or tunnel? Sign up for free at",
    "network.playit_helper_post": "and create a tunnel for Hytale (UDP 5520).",
    "network.save_playit_btn": "Save & Activate Playit.gg Tunnel",
    "network.ssh_title": "Remote SFTP / SSH Access (FileZilla / WinSCP)",
    "network.ssh_desc": "Wirelessly transfer worlds, mods, universe data and plugins from your main PC to the <code>/servidor-hy</code> directory on your Steam Deck.",
    "network.ssh_user_label": "SFTP User:",
    "network.ssh_pass_label": "SFTP Password:",
    "network.ssh_port_label": "SFTP Port:",
    "network.sftp_url_label": "URL for FileZilla / WinSCP (Local Network):",

    // Tools Tab
    "tools.repair_title": "Anti-Desync Management & Reconciliation",
    "tools.repair_desc": "If Podman reports corrupted states, storage locks, crashed containers or socket errors, this tool resets orphan states and restores clean pod synchronization.",
    "tools.repair_btn": "Run Deep Reconciliation",
    "tools.perms_title": "Fix File Permissions",
    "tools.perms_desc": "Runs the rootless routine <code>podman unshare chown -R 0:0</code> and fixes read/write permissions on the universe and data folder to avoid lockouts.",
    "tools.perms_btn": "Fix Data Permissions",
    "tools.shortcuts_title": "Steam Integration (Gaming Mode)",
    "tools.shortcuts_desc": "Installs shortcuts on your Desktop and SteamOS applications list so you can easily launch the app in Gaming Mode with controller support.",
    "tools.shortcuts_btn": "Install Shortcuts",
    "tools.paths_title": "File Paths on Steam Deck",
    "tools.path_data": "Hytale Data & Worlds:",
    "tools.path_ssh": "SSH Config:",
    "tools.path_app": "App Config:",

    // Touch Dialog
    "dialog.cancel": "Cancel",
    "dialog.ok": "Accept",

    // OLED Screensaver
    "screensaver.status_active": "Server Active",
    "screensaver.hint": "Tap any button or touch the screen to return to the panel"
  },

  es: {
    // Nav & Header
    "nav.dashboard": "Panel de Control",
    "nav.config": "Configuración",
    "nav.network": "Red y Conectividad",
    "nav.tools": "Herramientas y Steam",
    "header.title": "Hy Server-Deck",
    "header.subtitle": "Servidor Dedicado Hytale • Podman Nativo • SteamOS",
    "header.screensaver_title": "Modo Salvapantallas OLED (Anti-Quemado)",

    // Status Badges & Labels
    "status.checking": "Comprobando...",
    "status.running": "Servidor Activo",
    "status.degraded": "Desincronizado",
    "status.stopped": "Detenido",
    "status.not_created": "No Creado",
    "status.not_found": "No Encontrado",
    "status.attention_required": "Atención requerida",
    "status.server_stopped": "Servidor Detenido",
    "status.server_not_created": "Servidor No Creado",
    "status.synchronized": "Sincronizado",
    "status.optimal": "Óptimo",
    "status.active": "Activo",
    "status.public_ip": "IP Pública",
    "status.not_available": "No disponible",
    "status.no_public_ip": "Sin IP Pública detectada",

    // Anti-Desync Banner
    "alert.desync_title": "Desincronización detectada en el Pod:",
    "alert.desync_default_reason": "El contenedor de Hytale no responde dentro del pod.",
    "alert.reconcile_repair": "Reconciliar y Reparar Pod",

    // Dashboard Cards
    "card.pod_title": "Pod de Podman (`hy-pod`)",
    "card.pod_ports": "Puertos mapeados:",
    "card.pod_sync": "Sincronización:",
    "card.server_title": "Servidor Hytale (`hy-server`)",
    "card.server_version": "Build / Canal:",
    "card.server_ram": "RAM Asignada:",
    "card.conn_title": "Modo de Conexión",
    "card.conn_local_ip": "IP Local (WiFi):",
    "card.conn_public_ip": "IP Pública:",
    "card.conn_detecting": "Detectando...",
    "card.ssh_title": "Acceso SFTP (`hy-ssh`)",
    "card.ssh_port": "Puerto SFTP:",
    "card.ssh_user": "Usuario:",

    // Controls & Macros
    "controls.start": "Iniciar Servidor",
    "controls.stop": "Detener Servidor",
    "controls.restart": "Reiniciar",
    "controls.repair": "Reparar Pod",
    "controls.repair_tooltip": "Reconciliar contenedor y resetear desincronizaciones de Podman",
    "macros.label": "Comandos Rápidos:",
    "macros.backup": "💾 Guardar / Backup",
    "macros.players": "👥 Ver Jugadores",
    "macros.op": "⭐ Hacer Admin (OP)",
    "macros.whitelist": "📋 Whitelist",
    "macros.weather": "☀️ Tiempo Despejado",
    "macros.auth": "🔐 Estado Auth",

    // Terminal / Console
    "terminal.title": "Consola del Servidor (Logs en Vivo y Comandos)",
    "terminal.autoscroll": "Auto-Desplazamiento",
    "terminal.clear": "Limpiar",
    "terminal.initial_ready": "[Hy Server-Deck] Listo. Haz clic en 'Iniciar Servidor' para comenzar.",
    "terminal.cleared_locally": "[Consola limpiada localmente]",
    "terminal.input_placeholder": "Escribe un comando de Hytale (ej. /help, /op add Jugador, /time set day)...",
    "terminal.send": "Enviar",

    // Config Tab - Banner
    "config.header_title": "Asistente de Configuración de Hytale",
    "config.header_desc": "Configura canal de build, motor de contenedor, RAM y parámetros. Tus mundos en ~/hytale-server/data permanecerán 100% seguros.",

    // Config Tab - Section 1
    "config.section1_title": "1. Canal de Build y Motor",
    "config.channel_label": "Canal de Build del Servidor:",
    "config.refresh_btn": "🔄 Actualizar",
    "config.refresh_tooltip": "Consultar builds de contenedores disponibles",
    "config.channel_helper": "Distribución oficial o comunitaria del contenedor dedicado.",
    "config.image_label": "Imagen del Contenedor:",
    "config.server_name_label": "Nombre del Servidor:",
    "config.motd_label": "Mensaje del Servidor (MOTD):",

    // Config Tab - Section 2
    "config.section2_title": "2. Rendimiento y Simulación",
    "config.ram_label": "RAM Asignada:",
    "config.ram_recommended": "4G - 6G (Recomendado para Steam Deck)",
    "config.view_radius_label": "Radio de Visión de Chunks:",
    "config.max_players_label": "Jugadores Máximos:",
    "config.aot_cache_title": "Caché AOT (Ahead-Of-Time)",
    "config.aot_cache_desc": "Precompila el bytecode del motor para ticks estables y evita tirones en la APU de la Steam Deck.",
    "config.prod_title": "Modo Producción",
    "config.prod_desc": "Optimiza la agregación de paquetes de red y reduce el spam de depuración.",
    "config.save_deploy": "Guardar y Desplegar Servidor en Pod",

    // Network Tab
    "network.tab_public_ip": "Opción 1: Conexión Directa por IP Pública",
    "network.tab_playit": "Opción 2: Túneles Playit.gg (Sin tocar el router)",
    "network.addresses_title": "Direcciones de Conexión al Servidor",
    "network.local_friends": "Para amigos en tu hogar (Red WiFi Local):",
    "network.internet_friends": "Para amigos en Internet (IP Pública):",
    "network.copy": "Copiar",
    "network.copied": "¡Copiado!",
    "network.fetching_public_ip": "Consultando IP Pública...",
    "network.ports_title": "Puertos Utilizados en tu Steam Deck:",
    "network.port_game": "Tráfico de Juego Hytale (QUIC / UDP)",
    "network.port_query": "Consulta y Estado Hytale (UDP)",
    "network.port_sftp": "Acceso SFTP / SSH (Mods, Mundos y Configuración)",
    "network.upnp_title": "Apertura de Puertos (Router WiFi)",
    "network.upnp_btn": "⚡ Probar UPnP Automático",
    "network.upnp_default": "Puedes comprobar si tu router admite apertura automática mediante UPnP o configurarlo manualmente en el panel del router.",
    "network.router_guide_title": "Cómo abrir puertos en tu Router (Paso a Paso):",
    "network.router_step1": "Abre el navegador en tu PC o móvil y entra a tu router (usualmente <code>http://192.168.1.1</code> o <code>http://192.168.0.1</code>).",
    "network.router_step2": "Busca el menú <strong>Port Forwarding</strong>, <strong>Servidor Virtual</strong> o <strong>NAT</strong>.",
    "network.router_step3": "Añade una regla para la IP Local de tu Steam Deck (<strong id='guide-local-ip'>192.168.x.x</strong>):<br>Puerto Externo e Interno: <strong>5520</strong> &bull; Protocolo: <strong>UDP</strong>.",
    "network.router_step4": "(Opcional): Añade una regla para el puerto <strong>5521</strong> con protocolo <strong>UDP</strong> para consultas de estado.",
    "network.router_step5": "Guarda los cambios en el router. ¡Tus amigos ya pueden conectarse directamente con tu IP Pública en el puerto 5520!",
    "network.playit_title": "Túnel Seguro Playit.gg (Cero Configuración de Router)",
    "network.playit_desc": "Con Playit.gg no necesitas abrir puertos ni exponer tu IP pública residencial. El agente crea un túnel seguro directamente hacia la red de Playit.",
    "network.playit_key_label": "Clave Secreta de Playit.gg:",
    "network.playit_placeholder": "Pega aquí tu clave secreta de Playit.gg",
    "network.playit_helper_pre": "¿No tienes cuenta o túnel? Regístrate gratis en",
    "network.playit_helper_post": "y crea un túnel para Hytale (UDP 5520).",
    "network.save_playit_btn": "Guardar y Activar Túnel Playit.gg",
    "network.ssh_title": "Acceso Remoto SFTP / SSH (FileZilla / WinSCP)",
    "network.ssh_desc": "Transfiere de forma inalámbrica mundos, mods, datos de universos y scripts desde tu PC principal a la carpeta <code>/servidor-hy</code> de tu Steam Deck.",
    "network.ssh_user_label": "Usuario SFTP:",
    "network.ssh_pass_label": "Contraseña SFTP:",
    "network.ssh_port_label": "Puerto SFTP:",
    "network.sftp_url_label": "URL para FileZilla / WinSCP (Red Local):",

    // Tools Tab
    "tools.repair_title": "Gestión y Reconciliación Anti-Desincronización",
    "tools.repair_desc": "Si Podman reporta estados corruptos, locks de almacenamiento, contenedores caídos o errores de socket, esta herramienta limpia estados huérfanos y restaura la sincronía del pod.",
    "tools.repair_btn": "Ejecutar Reconciliación Profunda",
    "tools.perms_title": "Reparar Permisos de Archivos",
    "tools.perms_desc": "Ejecuta la rutina rootless <code>podman unshare chown -R 0:0</code> y corrige permisos de lectura/escritura en la carpeta de datos para evitar bloqueos.",
    "tools.perms_btn": "Reparar Permisos de Datos",
    "tools.shortcuts_title": "Integración con Steam (Modo Juego)",
    "tools.shortcuts_desc": "Instala accesos directos en el Escritorio y menú de SteamOS para ejecutar la aplicación directamente en Modo Juego con soporte para mando y pantalla táctil.",
    "tools.shortcuts_btn": "Instalar Accesos Directos",
    "tools.paths_title": "Rutas de Archivos en Steam Deck",
    "tools.path_data": "Datos y Mundos Hytale:",
    "tools.path_ssh": "Configuración SSH:",
    "tools.path_app": "Configuración de la App:",

    // Touch Dialog
    "dialog.cancel": "Cancelar",
    "dialog.ok": "Aceptar",

    // OLED Screensaver
    "screensaver.status_active": "Servidor Activo",
    "screensaver.hint": "Pulsa cualquier botón o toca la pantalla para volver al panel"
  },

  fr: {
    // Nav & Header
    "nav.dashboard": "Tableau de Bord",
    "nav.config": "Configuration",
    "nav.network": "Réseau et Accès",
    "nav.tools": "Outils et Steam",
    "header.title": "Hy Server-Deck",
    "header.subtitle": "Serveur Dédié Hytale • Podman Natif • SteamOS",
    "header.screensaver_title": "Mode Écran de Veille OLED (Anti-Brûlure)",

    // Status Badges & Labels
    "status.checking": "Vérification...",
    "status.running": "Serveur Actif",
    "status.degraded": "Désynchronisé",
    "status.stopped": "Arrêté",
    "status.not_created": "Non Créé",
    "status.not_found": "Introuvable",
    "status.attention_required": "Attention requise",
    "status.server_stopped": "Serveur Arrêté",
    "status.server_not_created": "Serveur Non Créé",
    "status.synchronized": "Synchronisé",
    "status.optimal": "Optimal",
    "status.active": "Actif",
    "status.public_ip": "IP Publique",
    "status.not_available": "Non disponible",
    "status.no_public_ip": "Aucune IP Publique détectée",

    // Anti-Desync Banner
    "alert.desync_title": "Désynchronisation détectée dans le Pod :",
    "alert.desync_default_reason": "Le conteneur Hytale ne répond pas dans le pod.",
    "alert.reconcile_repair": "Réconcilier et Réparer le Pod",

    // Dashboard Cards
    "card.pod_title": "Pod Podman (`hy-pod`)",
    "card.pod_ports": "Ports mappés :",
    "card.pod_sync": "Synchronisation :",
    "card.server_title": "Serveur Hytale (`hy-server`)",
    "card.server_version": "Build / Canal :",
    "card.server_ram": "RAM Allouée :",
    "card.conn_title": "Mode de Connexion",
    "card.conn_local_ip": "IP Locale (WiFi) :",
    "card.conn_public_ip": "IP Publique :",
    "card.conn_detecting": "Détection...",
    "card.ssh_title": "Accès SFTP (`hy-ssh`)",
    "card.ssh_port": "Port SFTP :",
    "card.ssh_user": "Utilisateur :",

    // Controls & Macros
    "controls.start": "Démarrer le Serveur",
    "controls.stop": "Arrêter le Serveur",
    "controls.restart": "Redémarrer",
    "controls.repair": "Réparer le Pod",
    "controls.repair_tooltip": "Réconcilier le conteneur et réinitialiser les désynchronisations",
    "macros.label": "Commandes Rapides :",
    "macros.backup": "💾 Sauvegarder / Backup",
    "macros.players": "👥 Voir Joueurs",
    "macros.op": "⭐ Rendre OP",
    "macros.whitelist": "📋 Liste Blanche",
    "macros.weather": "☀️ Ciel Dégagé",
    "macros.auth": "🔐 Statut Auth",

    // Terminal / Console
    "terminal.title": "Console du Serveur (Journaux en Direct & Commandes)",
    "terminal.autoscroll": "Défilement Auto",
    "terminal.clear": "Effacer",
    "terminal.initial_ready": "[Hy Server-Deck] Prêt. Cliquez sur 'Démarrer le Serveur' pour commencer.",
    "terminal.cleared_locally": "[Console effacée localement]",
    "terminal.input_placeholder": "Tapez une commande Hytale (ex. /help, /op add Joueur, /time set day)...",
    "terminal.send": "Envoyer",

    // Config Tab - Banner
    "config.header_title": "Assistant de Configuration Hytale",
    "config.header_desc": "Configurez le canal de build, l'image du conteneur, la RAM et les paramètres. Vos mondes dans ~/hytale-server/data restent 100% sécurisés.",

    // Config Tab - Section 1
    "config.section1_title": "1. Canal de Build & Moteur",
    "config.channel_label": "Canal de Build du Serveur :",
    "config.refresh_btn": "🔄 Rafraîchir",
    "config.refresh_tooltip": "Interroger les builds de conteneurs disponibles",
    "config.channel_helper": "Distribution officielle ou communautaire du conteneur dédié.",
    "config.image_label": "Image de Conteneur :",
    "config.server_name_label": "Nom du Serveur :",
    "config.motd_label": "Message du Serveur (MOTD) :",

    // Config Tab - Section 2
    "config.section2_title": "2. Paramètres de Performance et Simulation",
    "config.ram_label": "RAM Allouée :",
    "config.ram_recommended": "4G - 6G (Recommandé pour Steam Deck)",
    "config.view_radius_label": "Rayon de Vue des Chunks :",
    "config.max_players_label": "Joueurs Max :",
    "config.aot_cache_title": "Cache AOT (Ahead-Of-Time)",
    "config.aot_cache_desc": "Précompile le bytecode pour des taux de rafraîchissement stables sur l'APU.",
    "config.prod_title": "Mode Production",
    "config.prod_desc": "Optimise l'agrégation de paquets réseau et réduit les logs.",
    "config.save_deploy": "Enregistrer et Déployer le Serveur dans le Pod",

    // Network Tab
    "network.tab_public_ip": "Option 1 : Connexion Directe via IP Publique",
    "network.tab_playit": "Option 2 : Tunnels Playit.gg (Zéro Configuration Routeur)",
    "network.addresses_title": "Adresses de Connexion au Serveur",
    "network.local_friends": "Pour les amis à votre domicile (WiFi Local) :",
    "network.internet_friends": "Pour les amis sur Internet (IP Publique) :",
    "network.copy": "Copier",
    "network.copied": "Copié !",
    "network.fetching_public_ip": "Recherche de l'IP Publique...",
    "network.ports_title": "Ports Utilisés sur votre Steam Deck :",
    "network.port_game": "Trafic de Jeu Hytale (QUIC / UDP)",
    "network.port_query": "Requête & Statut Hytale (UDP)",
    "network.port_sftp": "Accès SFTP / SSH (Mods, Mondes et Fichiers)",
    "network.upnp_title": "Redirection de Ports (Routeur WiFi)",
    "network.upnp_btn": "⚡ Tester UPnP Automatique",
    "network.upnp_default": "Vérifiez si votre routeur autorise l'UPnP automatique ou configurez-le manuellement.",
    "network.router_guide_title": "Comment rediriger les ports sur votre Routeur :",
    "network.router_step1": "Ouvrez un navigateur sur PC ou mobile et accédez au routeur (ex. <code>http://192.168.1.1</code>).",
    "network.router_step2": "Cherchez la section <strong>Redirection de Ports</strong>, <strong>Serveur Virtuel</strong> ou <strong>NAT</strong>.",
    "network.router_step3": "Ajoutez une règle pour l'IP Locale de votre Steam Deck (<strong id='guide-local-ip'>192.168.x.x</strong>) :<br>Port Externe et Interne : <strong>5520</strong> &bull; Protocole : <strong>UDP</strong>.",
    "network.router_step4": "(Optionnel) : Ajoutez une règle pour le port <strong>5521</strong> avec le protocole <strong>UDP</strong>.",
    "network.router_step5": "Enregistrez. Vos amis peuvent maintenant se connecter avec votre IP Publique sur le port 5520 !",
    "network.playit_title": "Tunnel Sécurisé Playit.gg (Zéro Configuration Routeur)",
    "network.playit_desc": "Avec Playit.gg, vous n'avez pas besoin d'ouvrir de ports ou d'exposer votre IP.",
    "network.playit_key_label": "Clé Secrète Playit.gg :",
    "network.playit_placeholder": "Collez votre clé secrète Playit.gg ici",
    "network.playit_helper_pre": "Pas de compte ou de tunnel ? Inscrivez-vous gratuitement sur",
    "network.playit_helper_post": "et créez un tunnel pour Hytale (UDP 5520).",
    "network.save_playit_btn": "Enregistrer et Activer le Tunnel Playit.gg",
    "network.ssh_title": "Accès Distant SFTP / SSH (FileZilla / WinSCP)",
    "network.ssh_desc": "Transférez des mondes, mods, données et scripts sans fil depuis votre PC vers le dossier <code>/servidor-hy</code>.",
    "network.ssh_user_label": "Utilisateur SFTP :",
    "network.ssh_pass_label": "Mot de Passe SFTP :",
    "network.ssh_port_label": "Port SFTP :",
    "network.sftp_url_label": "URL pour FileZilla / WinSCP (Réseau Local) :",

    // Tools Tab
    "tools.repair_title": "Gestion Anti-Désynchronisation & Réconciliation",
    "tools.repair_desc": "Si Podman signale des états corrompus ou des conteneurs bloqués, cet outil réinitialise les états orphelins.",
    "tools.repair_btn": "Exécuter la Réconciliation Profonde",
    "tools.perms_title": "Réparer les Permissions de Fichiers",
    "tools.perms_desc": "Exécute <code>podman unshare chown -R 0:0</code> pour réparer les droits sur les données.",
    "tools.perms_btn": "Réparer les Permissions",
    "tools.shortcuts_title": "Intégration Steam (Mode Jeu)",
    "tools.shortcuts_desc": "Installe des raccourcis sur votre bureau pour lancer l'application en Mode Jeu.",
    "tools.shortcuts_btn": "Installer les Raccourcis",
    "tools.paths_title": "Chemins de Fichiers sur Steam Deck",
    "tools.path_data": "Données et Mondes Hytale :",
    "tools.path_ssh": "Configuration SSH :",
    "tools.path_app": "Configuration de l'App :",

    // Touch Dialog
    "dialog.cancel": "Annuler",
    "dialog.ok": "Accepter",

    // OLED Screensaver
    "screensaver.status_active": "Serveur Actif",
    "screensaver.hint": "Appuyez sur un bouton ou touchez l'écran pour revenir au panneau"
  },

  pt: {
    // Nav & Header
    "nav.dashboard": "Painel de Controle",
    "nav.config": "Configuração",
    "nav.network": "Rede e Acesso",
    "nav.tools": "Ferramentas e Steam",
    "header.title": "Hy Server-Deck",
    "header.subtitle": "Servidor Dedicado Hytale • Podman Nativo • SteamOS",
    "header.screensaver_title": "Modo Protetor de Tela OLED (Anti-Burn-In)",

    // Status Badges & Labels
    "status.checking": "Verificando...",
    "status.running": "Servidor Ativo",
    "status.degraded": "Dessincronizado",
    "status.stopped": "Parado",
    "status.not_created": "Não Criado",
    "status.not_found": "Não Encontrado",
    "status.attention_required": "Atenção necessária",
    "status.server_stopped": "Servidor Parado",
    "status.server_not_created": "Servidor Não Criado",
    "status.synchronized": "Sincronizado",
    "status.optimal": "Ótimo",
    "status.active": "Ativo",
    "status.public_ip": "IP Público",
    "status.not_available": "Não disponível",
    "status.no_public_ip": "Nenhum IP Público detectado",

    // Anti-Desync Banner
    "alert.desync_title": "Dessincronização detectada no Pod:",
    "alert.desync_default_reason": "O contêiner do Hytale não está respondendo no pod.",
    "alert.reconcile_repair": "Reconciliar e Reparar Pod",

    // Dashboard Cards
    "card.pod_title": "Pod do Podman (`hy-pod`)",
    "card.pod_ports": "Portas mapeadas:",
    "card.pod_sync": "Sincronização:",
    "card.server_title": "Servidor Hytale (`hy-server`)",
    "card.server_version": "Build / Canal:",
    "card.server_ram": "RAM Alocada:",
    "card.conn_title": "Modo de Conexão",
    "card.conn_local_ip": "IP Local (WiFi):",
    "card.conn_public_ip": "IP Público:",
    "card.conn_detecting": "Detectando...",
    "card.ssh_title": "Acesso SFTP (`hy-ssh`)",
    "card.ssh_port": "Porta SFTP:",
    "card.ssh_user": "Usuário:",

    // Controls & Macros
    "controls.start": "Iniciar Servidor",
    "controls.stop": "Parar Servidor",
    "controls.restart": "Reiniciar",
    "controls.repair": "Reparar Pod",
    "controls.repair_tooltip": "Reconciliar contêiner e resetar dessincronizações",
    "macros.label": "Comandos Rápidos:",
    "macros.backup": "💾 Salvar / Backup",
    "macros.players": "👥 Ver Jogadores",
    "macros.op": "⭐ Tornar Admin (OP)",
    "macros.whitelist": "📋 Whitelist",
    "macros.weather": "☀️ Tempo Limpo",
    "macros.auth": "🔐 Status Auth",

    // Terminal / Console
    "terminal.title": "Console do Servidor (Logs ao Vivo e Comandos)",
    "terminal.autoscroll": "Rolagem Automática",
    "terminal.clear": "Limpar",
    "terminal.initial_ready": "[Hy Server-Deck] Pronto. Clique em 'Iniciar Servidor' para começar.",
    "terminal.cleared_locally": "[Console limpo localmente]",
    "terminal.input_placeholder": "Digite um comando do Hytale (ex: /help, /op add Jogador, /time set day)...",
    "terminal.send": "Enviar",

    // Config Tab - Banner
    "config.header_title": "Assistente de Configuração do Hytale",
    "config.header_desc": "Configure canal de build, imagem do contêiner, RAM e opções. Seus mundos em ~/hytale-server/data permanecerão 100% seguros.",

    // Config Tab - Section 1
    "config.section1_title": "1. Canal de Build & Motor",
    "config.channel_label": "Canal de Build do Servidor:",
    "config.refresh_btn": "🔄 Atualizar",
    "config.refresh_tooltip": "Consultar builds disponíveis",
    "config.channel_helper": "Distribuição oficial ou comunitária do contêiner dedicado.",
    "config.image_label": "Imagem do Contêiner:",
    "config.server_name_label": "Nome do Servidor:",
    "config.motd_label": "Mensagem do Servidor (MOTD):",

    // Config Tab - Section 2
    "config.section2_title": "2. Desempenho e Simulação",
    "config.ram_label": "RAM Alocada:",
    "config.ram_recommended": "4G - 6G (Recomendado para Steam Deck)",
    "config.view_radius_label": "Raio de Visão de Chunks:",
    "config.max_players_label": "Máximo de Jogadores:",
    "config.aot_cache_title": "Cache AOT (Ahead-Of-Time)",
    "config.aot_cache_desc": "Pré-compila o bytecode do motor para estabilidade de ticks na APU.",
    "config.prod_title": "Modo Produção",
    "config.prod_desc": "Otimiza agregação de pacotes de rede e suprime logs de depuração.",
    "config.save_deploy": "Salvar e Implantar Servidor no Pod",

    // Network Tab
    "network.tab_public_ip": "Opção 1: Conexão Direta via IP Público",
    "network.tab_playit": "Opção 2: Túneis Playit.gg (Sem mexer no roteador)",
    "network.addresses_title": "Endereços de Conexão do Servidor",
    "network.local_friends": "Para amigos em sua casa (Rede WiFi Local):",
    "network.internet_friends": "Para amigos na Internet (IP Público):",
    "network.copy": "Copiar",
    "network.copied": "Copiado!",
    "network.fetching_public_ip": "Consultando IP Público...",
    "network.ports_title": "Portas Utilizadas no seu Steam Deck:",
    "network.port_game": "Tráfego de Jogo Hytale (QUIC / UDP)",
    "network.port_query": "Consulta e Status Hytale (UDP)",
    "network.port_sftp": "Acesso SFTP / SSH (Mods, Mundos e Arquivos)",
    "network.upnp_title": "Redirecionamento de Portas (Roteador WiFi)",
    "network.upnp_btn": "⚡ Testar UPnP Automático",
    "network.upnp_default": "Teste se seu roteador permite abertura automática via UPnP ou configure manualmente.",
    "network.router_guide_title": "Como abrir portas no seu Roteador (Passo a Passo):",
    "network.router_step1": "Abra um navegador no PC ou celular e acesse seu roteador (geralmente <code>http://192.168.1.1</code>).",
    "network.router_step2": "Procure a seção <strong>Port Forwarding</strong>, <strong>Servidor Virtual</strong> ou <strong>NAT</strong>.",
    "network.router_step3": "Adicione uma regra para o IP Local do seu Steam Deck (<strong id='guide-local-ip'>192.168.x.x</strong>):<br>Porta Externa e Interna: <strong>5520</strong> &bull; Protocolo: <strong>UDP</strong>.",
    "network.router_step4": "(Opcional): Adicione uma regra para a porta <strong>5521</strong> com protocolo <strong>UDP</strong>.",
    "network.router_step5": "Salve as alterações. Seus amigos agora podem conectar usando seu IP Público na porta 5520!",
    "network.playit_title": "Túnel Seguro Playit.gg (Zero Configuração de Roteador)",
    "network.playit_desc": "Com o Playit.gg você não precisa abrir portas nem expor seu IP residencial.",
    "network.playit_key_label": "Chave Secreta do Playit.gg:",
    "network.playit_placeholder": "Cole aqui sua chave secreta do Playit.gg",
    "network.playit_helper_pre": "Não tem uma conta ou túnel? Cadastre-se grátis em",
    "network.playit_helper_post": "e crie um túnel para Hytale (UDP 5520).",
    "network.save_playit_btn": "Salvar e Ativar Túnel Playit.gg",
    "network.ssh_title": "Acesso Remoto SFTP / SSH (FileZilla / WinSCP)",
    "network.ssh_desc": "Transfira sem fio mundos, mods, universos e scripts do seu PC principal para a pasta <code>/servidor-hy</code>.",
    "network.ssh_user_label": "Usuário SFTP:",
    "network.ssh_pass_label": "Senha SFTP:",
    "network.ssh_port_label": "Porta SFTP:",
    "network.sftp_url_label": "URL para FileZilla / WinSCP (Rede Local):",

    // Tools Tab
    "tools.repair_title": "Gerenciamento e Reconciliação Anti-Dessincronização",
    "tools.repair_desc": "Se o Podman reportar estados corrompidos ou bloqueios, esta ferramenta restaura a sincronia do pod.",
    "tools.repair_btn": "Executar Reconciliação Profunda",
    "tools.perms_title": "Reparar Permissões de Arquivos",
    "tools.perms_desc": "Executa <code>podman unshare chown -R 0:0</code> para corrigir permissões na pasta de dados.",
    "tools.perms_btn": "Reparar Permissões de Dados",
    "tools.shortcuts_title": "Integração Steam (Modo Jogo)",
    "tools.shortcuts_desc": "Instala atalhos no Desktop e lançador de aplicativos do SteamOS para Modo Jogo.",
    "tools.shortcuts_btn": "Instalar Atalhos",
    "tools.paths_title": "Caminhos de Arquivos no Steam Deck",
    "tools.path_data": "Dados e Mundos Hytale:",
    "tools.path_ssh": "Configuração SSH:",
    "tools.path_app": "Configuração do App:",

    // Touch Dialog
    "dialog.cancel": "Cancelar",
    "dialog.ok": "Aceitar",

    // OLED Screensaver
    "screensaver.status_active": "Servidor Ativo",
    "screensaver.hint": "Toque em qualquer botão ou na tela para retornar ao painel"
  }
};

let currentLang = "en";

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("hy_server_deck_lang", lang);
    applyTranslations();
  }
}

export function initLanguage() {
  const saved = localStorage.getItem("hy_server_deck_lang");
  if (saved && translations[saved]) {
    currentLang = saved;
  } else {
    const navLang = (navigator.language || navigator.userLanguage || "en").substring(0, 2).toLowerCase();
    if (translations[navLang]) {
      currentLang = navLang;
    } else {
      currentLang = "en";
    }
  }
  applyTranslations();
  return currentLang;
}

export function t(key, fallback = "") {
  const langDict = translations[currentLang] || translations["en"];
  if (langDict && langDict[key] !== undefined) {
    return langDict[key];
  }
  const fallbackDict = translations["en"];
  if (fallbackDict && fallbackDict[key] !== undefined) {
    return fallbackDict[key];
  }
  return fallback || key;
}

export function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated) {
      el.textContent = translated;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    const translated = t(key);
    if (translated) {
      el.innerHTML = translated;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const translated = t(key);
    if (translated) {
      el.setAttribute("placeholder", translated);
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    const translated = t(key);
    if (translated) {
      el.setAttribute("title", translated);
    }
  });

  const langSelect = document.getElementById("lang-select");
  if (langSelect && langSelect.value !== currentLang) {
    langSelect.value = currentLang;
  }
}
