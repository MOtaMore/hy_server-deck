import { invoke } from "@tauri-apps/api/core";
import { initLanguage, setLanguage, getLanguage, t, applyTranslations } from "./i18n.js";

// State Management
let currentConfig = {
  server_name: "Hytale Server on Steam Deck",
  version_channel: "release-latest",
  server_image: "ghcr.io/terkea/hytale-server:latest",
  memory: "4G",
  port: 5520,
  query_port: 5521,
  max_players: 20,
  max_view_radius: 8,
  use_aot_cache: true,
  prod_mode: true,
  motd: "Welcome to our Hytale World!",
  connection_mode: "public_ip",
  playit_key: "",
  enable_ssh: true,
  ssh_user: "adminhy",
  ssh_pass: "hydeck123",
  ssh_port: 2223,
  custom_env: {}
};

let networkInfo = null;
let lastLogText = "";
let lastStatus = null;
let isScreensaverActive = false;
let screensaverAnimId = null;
let idleTimer = null;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 min idle timer for OLED

// DOM Elements
const elements = {
  // Language Selector
  langSelect: document.getElementById("lang-select"),

  // Tabs
  navTabs: document.querySelectorAll(".nav-tab"),
  tabContents: document.querySelectorAll(".tab-content"),
  
  // Header & Badges
  podGlobalBadge: document.getElementById("pod-global-badge"),
  podGlobalText: document.getElementById("pod-global-text"),
  btnScreensaver: document.getElementById("btn-screensaver"),
  
  // Desync Alert
  desyncAlert: document.getElementById("desync-alert"),
  desyncReasonText: document.getElementById("desync-reason-text"),
  btnAutoRepair: document.getElementById("btn-auto-repair"),
  
  // Dashboard Status Cards
  cardPodBadge: document.getElementById("card-pod-badge"),
  podSyncVal: document.getElementById("pod-sync-val"),
  cardServerBadge: document.getElementById("card-server-badge"),
  dashboardVersionVal: document.getElementById("dashboard-version-val"),
  dashboardRamVal: document.getElementById("dashboard-ram-val"),
  cardTunnelBadge: document.getElementById("card-tunnel-badge"),
  dashboardLocalIp: document.getElementById("dashboard-local-ip"),
  dashboardPublicIp: document.getElementById("dashboard-public-ip"),
  cardSshBadge: document.getElementById("card-ssh-badge"),
  dashboardSshUser: document.getElementById("dashboard-ssh-user"),
  
  // Controls
  btnStartServer: document.getElementById("btn-start-server"),
  btnStopServer: document.getElementById("btn-stop-server"),
  btnRestartServer: document.getElementById("btn-restart-server"),
  btnDashboardRepair: document.getElementById("btn-dashboard-repair"),
  
  // Terminal
  terminalBody: document.getElementById("terminal-body"),
  chkAutoscroll: document.getElementById("chk-autoscroll"),
  btnClearLogs: document.getElementById("btn-clear-logs"),
  cmdInput: document.getElementById("cmd-input"),
  btnSendCmd: document.getElementById("btn-send-cmd"),
  
  // Config Form
  configForm: document.getElementById("config-form"),
  cfgChannel: document.getElementById("cfg-channel"),
  btnRefreshVersions: document.getElementById("btn-refresh-versions"),
  cfgImage: document.getElementById("cfg-image"),
  cfgServerName: document.getElementById("cfg-server-name"),
  cfgMotd: document.getElementById("cfg-motd"),
  cfgRamSlider: document.getElementById("cfg-ram-slider"),
  ramSliderVal: document.getElementById("ram-slider-val"),
  cfgViewRadius: document.getElementById("cfg-view-radius"),
  cfgMaxPlayers: document.getElementById("cfg-max-players"),
  cfgAotCache: document.getElementById("cfg-aot-cache"),
  cfgProdMode: document.getElementById("cfg-prod-mode"),
  
  // Network
  connTabs: document.querySelectorAll(".conn-tab"),
  connPanePublic: document.getElementById("conn-pane-public"),
  connPanePlayit: document.getElementById("conn-pane-playit"),
  netLocalIpFull: document.getElementById("net-local-ip-full"),
  netPublicIpFull: document.getElementById("net-public-ip-full"),
  btnTestUpnp: document.getElementById("btn-test-upnp"),
  upnpResultBox: document.getElementById("upnp-result-box"),
  upnpResultText: document.getElementById("upnp-result-text"),
  guideLocalIp: document.getElementById("guide-local-ip"),
  cfgPlayitKey: document.getElementById("cfg-playit-key"),
  btnSavePlayit: document.getElementById("btn-save-playit"),
  cfgEnableSsh: document.getElementById("cfg-enable-ssh"),
  cfgSshUser: document.getElementById("cfg-ssh-user"),
  cfgSshPass: document.getElementById("cfg-ssh-pass"),
  sftpLocalUrl: document.getElementById("sftp-local-url"),
  
  // Tools
  btnDeepRepair: document.getElementById("btn-deep-repair"),
  btnFixPerms: document.getElementById("btn-fix-perms"),
  btnInstallShortcuts: document.getElementById("btn-install-shortcuts"),
  
  // Dialog Modal
  touchDialog: document.getElementById("touch-dialog"),
  dialogTitle: document.getElementById("dialog-title"),
  dialogMessage: document.getElementById("dialog-message"),
  dialogInput: document.getElementById("dialog-input"),
  dialogBtnCancel: document.getElementById("dialog-btn-cancel"),
  dialogBtnOk: document.getElementById("dialog-btn-ok"),
  
  // Screensaver
  oledScreensaver: document.getElementById("oled-screensaver"),
  bouncingLogo: document.getElementById("bouncing-logo"),
  screensaverStatusBadge: document.getElementById("screensaver-status-badge"),
  
  // Toast
  toastContainer: document.getElementById("toast-container")
};

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// TAB NAVIGATION
// ==========================================
elements.navTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    elements.navTabs.forEach(t => t.classList.remove("active"));
    elements.tabContents.forEach(tc => tc.classList.remove("active"));
    
    tab.classList.add("active");
    const activeSection = document.getElementById(`tab-${target}`);
    if (activeSection) activeSection.classList.add("active");
    
    resetIdleTimer();
  });
});

// ==========================================
// DIALOG MODAL (TOUCH-FRIENDLY PROMPT)
// ==========================================
let dialogResolve = null;

function showTouchDialog(title, message, defaultVal = "") {
  return new Promise(resolve => {
    dialogResolve = resolve;
    elements.dialogTitle.textContent = title;
    elements.dialogMessage.textContent = message;
    elements.dialogInput.value = defaultVal;
    elements.touchDialog.classList.remove("hidden");
    elements.dialogInput.focus();
  });
}

elements.dialogBtnCancel.addEventListener("click", () => {
  elements.touchDialog.classList.add("hidden");
  if (dialogResolve) dialogResolve(null);
});

elements.dialogBtnOk.addEventListener("click", () => {
  const val = elements.dialogInput.value.trim();
  elements.touchDialog.classList.add("hidden");
  if (dialogResolve) dialogResolve(val);
});

elements.dialogInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    elements.dialogBtnOk.click();
  } else if (e.key === "Escape") {
    elements.dialogBtnCancel.click();
  }
});

// ==========================================
// OLED SCREENSAVER & IDLE MANAGEMENT
// ==========================================
let posX = 100, posY = 100;
let velX = 2, velY = 1.5;

function startScreensaver() {
  if (isScreensaverActive) return;
  isScreensaverActive = true;
  elements.oledScreensaver.classList.remove("hidden");
  
  posX = Math.random() * (window.innerWidth - 300);
  posY = Math.random() * (window.innerHeight - 150);
  velX = (Math.random() > 0.5 ? 2 : -2);
  velY = (Math.random() > 0.5 ? 1.5 : -1.5);
  
  function bounceLoop() {
    if (!isScreensaverActive) return;
    
    const logoW = elements.bouncingLogo.offsetWidth || 240;
    const logoH = elements.bouncingLogo.offsetHeight || 60;
    const maxW = window.innerWidth - logoW;
    const maxH = window.innerHeight - logoH;
    
    posX += velX;
    posY += velY;
    
    if (posX <= 0 || posX >= maxW) velX = -velX;
    if (posY <= 0 || posY >= maxH) velY = -velY;
    
    elements.bouncingLogo.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    screensaverAnimId = requestAnimationFrame(bounceLoop);
  }
  
  screensaverAnimId = requestAnimationFrame(bounceLoop);
}

function stopScreensaver() {
  if (!isScreensaverActive) return;
  isScreensaverActive = false;
  elements.oledScreensaver.classList.add("hidden");
  if (screensaverAnimId) {
    cancelAnimationFrame(screensaverAnimId);
    screensaverAnimId = null;
  }
  resetIdleTimer();
}

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    // Only auto-start if server is running to prevent panel burn-in
    if (lastStatus && lastStatus.is_healthy) {
      startScreensaver();
    }
  }, IDLE_TIMEOUT_MS);
}

window.addEventListener("mousemove", () => { if (isScreensaverActive) stopScreensaver(); else resetIdleTimer(); });
window.addEventListener("mousedown", () => { if (isScreensaverActive) stopScreensaver(); else resetIdleTimer(); });
window.addEventListener("keydown", () => { if (isScreensaverActive) stopScreensaver(); else resetIdleTimer(); });
window.addEventListener("touchstart", () => { if (isScreensaverActive) stopScreensaver(); else resetIdleTimer(); });
elements.oledScreensaver.addEventListener("click", stopScreensaver);
elements.btnScreensaver.addEventListener("click", startScreensaver);

// ==========================================
// SERVER STATUS SYNC & ANTI-DESYNC ENGINE
// ==========================================
async function refreshStatus() {
  try {
    const status = await invoke("get_status");
    lastStatus = status;
    updateUIWithStatus(status);
  } catch (err) {
    console.error("Error checking status:", err);
  }
}

function updateUIWithStatus(status) {
  // 1. Global Badge
  elements.podGlobalBadge.className = "status-pill";
  if (status.status === "Running" && status.is_healthy) {
    elements.podGlobalBadge.classList.add("status-running");
    elements.podGlobalText.textContent = t("status.running");
    elements.screensaverStatusBadge.textContent = t("screensaver.status_active");
  } else if (status.desync_detected || status.status === "Degraded") {
    elements.podGlobalBadge.classList.add("status-degraded");
    elements.podGlobalText.textContent = t("status.degraded");
    elements.screensaverStatusBadge.textContent = t("status.attention_required");
  } else if (status.status === "Stopped") {
    elements.podGlobalBadge.classList.add("status-stopped");
    elements.podGlobalText.textContent = t("status.server_stopped");
    elements.screensaverStatusBadge.textContent = t("status.server_stopped");
  } else {
    elements.podGlobalBadge.classList.add("status-stopped");
    elements.podGlobalText.textContent = status.status;
    elements.screensaverStatusBadge.textContent = status.status;
  }

  // 2. Anti-Desync Alert Banner
  if (status.desync_detected) {
    elements.desyncAlert.classList.remove("hidden");
    elements.desyncReasonText.textContent = status.desync_reason || t("alert.desync_default_reason");
  } else {
    elements.desyncAlert.classList.add("hidden");
  }

  // 3. Card mc-pod / hy-pod
  elements.cardPodBadge.className = "badge";
  if (status.status === "Running") {
    elements.cardPodBadge.classList.add("badge-green");
    elements.cardPodBadge.textContent = t("status.running");
  } else if (status.status === "Degraded") {
    elements.cardPodBadge.classList.add("badge-yellow");
    elements.cardPodBadge.textContent = t("status.degraded");
  } else {
    elements.cardPodBadge.classList.add("badge-gray");
    elements.cardPodBadge.textContent = status.status;
  }

  if (status.desync_detected) {
    elements.podSyncVal.className = "val text-warning";
    elements.podSyncVal.textContent = t("status.degraded");
  } else {
    elements.podSyncVal.className = "val text-green";
    elements.podSyncVal.textContent = t("status.optimal");
  }

  // 4. Containers status (hy-server, hy-ssh)
  const containers = status.containers || {};
  const serverCont = containers["hy-server"];
  elements.cardServerBadge.className = "badge";
  if (serverCont && serverCont.status === "running") {
    elements.cardServerBadge.classList.add("badge-green");
    elements.cardServerBadge.textContent = t("status.active");
  } else if (serverCont) {
    elements.cardServerBadge.classList.add("badge-gray");
    elements.cardServerBadge.textContent = serverCont.status;
  } else {
    elements.cardServerBadge.classList.add("badge-gray");
    elements.cardServerBadge.textContent = t("status.not_found");
  }

  const sshCont = containers["hy-ssh"];
  elements.cardSshBadge.className = "badge";
  if (sshCont && sshCont.status === "running") {
    elements.cardSshBadge.classList.add("badge-green");
    elements.cardSshBadge.textContent = t("status.active");
  } else {
    elements.cardSshBadge.classList.add("badge-gray");
    elements.cardSshBadge.textContent = t("status.stopped");
  }
}

// ==========================================
// LIVE LOG STREAMING
// ==========================================
async function streamLogs() {
  if (!lastStatus || (lastStatus.status !== "Running" && lastStatus.status !== "Degraded")) {
    return;
  }
  
  try {
    const logs = await invoke("get_logs", { tail: 80 });
    if (logs && logs !== lastLogText) {
      lastLogText = logs;
      renderLogs(logs);
    }
  } catch (err) {
    // Ignore harmless polling errors when container is inactive
  }
}

function renderLogs(rawLogs) {
  const lines = rawLogs.split("\n");
  elements.terminalBody.innerHTML = "";
  
  lines.forEach(line => {
    if (!line.trim()) return;
    const div = document.createElement("div");
    div.className = "log-line";
    
    if (line.includes("ERROR") || line.includes("Exception") || line.includes("Error") || line.includes("FATAL")) {
      div.classList.add("error");
    } else if (line.includes("WARN") || line.includes("Warning")) {
      div.classList.add("warn");
    } else if (line.includes("SUCCESS") || line.includes("Done") || line.includes("started") || line.includes("listening")) {
      div.classList.add("success");
    } else if (line.includes("INFO") || line.includes("ready")) {
      div.classList.add("info");
    }
    
    div.textContent = line;
    elements.terminalBody.appendChild(div);
  });

  if (elements.chkAutoscroll.checked) {
    elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
  }
}

elements.btnClearLogs.addEventListener("click", () => {
  elements.terminalBody.innerHTML = `<div class="log-line text-muted">${t("terminal.cleared_locally")}</div>`;
});

// ==========================================
// COMMAND / CONSOLE EXECUTION
// ==========================================
async function sendCommand(cmd) {
  if (!cmd || !cmd.trim()) return;
  const commandToSend = cmd.trim();
  
  // Visual feedback in console
  const div = document.createElement("div");
  div.className = "log-line info";
  div.textContent = `> ${commandToSend}`;
  elements.terminalBody.appendChild(div);
  elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
  
  try {
    const res = await invoke("send_command", { command: commandToSend });
    if (res && res.trim()) {
      const resDiv = document.createElement("div");
      resDiv.className = "log-line text-muted";
      resDiv.textContent = res;
      elements.terminalBody.appendChild(resDiv);
    }
    showToast(t("terminal.send") + ": " + commandToSend, "success");
  } catch (err) {
    const errDiv = document.createElement("div");
    errDiv.className = "log-line error";
    errDiv.textContent = `Error: ${err}`;
    elements.terminalBody.appendChild(errDiv);
    showToast(err, "error");
  }
  
  elements.cmdInput.value = "";
}

elements.btnSendCmd.addEventListener("click", () => {
  sendCommand(elements.cmdInput.value);
});

elements.cmdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendCommand(elements.cmdInput.value);
  }
});

// Touch Macros
document.querySelectorAll(".btn-chip").forEach(btn => {
  btn.addEventListener("click", async () => {
    const cmd = btn.dataset.cmd;
    const macro = btn.dataset.macro;
    
    if (cmd) {
      sendCommand(cmd);
    } else if (macro === "op") {
      const user = await showTouchDialog("Make OP / Admin", "Enter the Hytale player name to give Operator rights:");
      if (user) {
        sendCommand(`/op add ${user}`);
      }
    } else if (macro === "whitelist") {
      const user = await showTouchDialog("Whitelist Player", "Enter the player name to add to whitelist:");
      if (user) {
        sendCommand(`/whitelist add ${user}`);
      }
    }
  });
});

// ==========================================
// SERVER CONTROLS (START, STOP, RESTART, REPAIR)
// ==========================================
elements.btnStartServer.addEventListener("click", async () => {
  showToast("Starting Hytale server...", "info");
  try {
    const res = await invoke("start_server");
    showToast(res, "success");
    setTimeout(refreshStatus, 1500);
  } catch (err) {
    showToast(err, "error");
  }
});

elements.btnStopServer.addEventListener("click", async () => {
  showToast("Stopping server gracefully...", "info");
  try {
    const res = await invoke("stop_server");
    showToast(res, "warning");
    setTimeout(refreshStatus, 1500);
  } catch (err) {
    showToast(err, "error");
  }
});

elements.btnRestartServer.addEventListener("click", async () => {
  showToast("Restarting Hytale server...", "info");
  try {
    const res = await invoke("restart_server");
    showToast(res, "success");
    setTimeout(refreshStatus, 1500);
  } catch (err) {
    showToast(err, "error");
  }
});

async function runPodRepair() {
  showToast("Executing anti-desynchronization reconciliation...", "warning");
  try {
    const res = await invoke("repair_pod");
    showToast(res, "success");
    setTimeout(refreshStatus, 2000);
  } catch (err) {
    showToast("Reconciliation failed: " + err, "error");
  }
}

elements.btnAutoRepair.addEventListener("click", runPodRepair);
elements.btnDashboardRepair.addEventListener("click", runPodRepair);
elements.btnDeepRepair.addEventListener("click", runPodRepair);

elements.btnFixPerms.addEventListener("click", async () => {
  showToast("Fixing file permissions with rootless Podman unshare...", "info");
  try {
    const res = await invoke("repair_pod");
    showToast("Data permissions restored.", "success");
  } catch (err) {
    showToast(err, "error");
  }
});

// ==========================================
// CONFIGURATION & DEPLOYMENT
// ==========================================
async function loadServerConfig() {
  try {
    const cfg = await invoke("load_config");
    currentConfig = cfg;
    populateConfigForm(cfg);
  } catch (err) {
    console.error("Error loading config:", err);
  }
}

function populateConfigForm(cfg) {
  elements.cfgServerName.value = cfg.server_name || "Hytale Server on Steam Deck";
  elements.cfgMotd.value = cfg.motd || "Welcome to our Hytale World!";
  elements.cfgImage.value = cfg.server_image || "ghcr.io/terkea/hytale-server:latest";
  
  // Channel select
  elements.cfgChannel.value = cfg.version_channel || "release-latest";
  
  // RAM Slider
  const ramNum = parseInt(cfg.memory) || 4;
  elements.cfgRamSlider.value = ramNum;
  elements.ramSliderVal.textContent = `${ramNum} GB`;
  elements.dashboardRamVal.textContent = `${ramNum}G`;
  
  // View distance & max players
  elements.cfgViewRadius.value = cfg.max_view_radius || 8;
  elements.cfgMaxPlayers.value = cfg.max_players || 20;
  
  // Toggles
  elements.cfgAotCache.checked = cfg.use_aot_cache !== false;
  elements.cfgProdMode.checked = cfg.prod_mode !== false;
  
  // SSH fields
  elements.cfgEnableSsh.checked = cfg.enable_ssh !== false;
  elements.cfgSshUser.value = cfg.ssh_user || "adminhy";
  elements.cfgSshPass.value = cfg.ssh_pass || "hydeck123";
  elements.dashboardSshUser.textContent = cfg.ssh_user || "adminhy";
  
  // Playit
  elements.cfgPlayitKey.value = cfg.playit_key || "";
  
  // Connection mode tab
  if (cfg.connection_mode === "playit") {
    switchConnectionMode("playit");
  } else {
    switchConnectionMode("public_ip");
  }

  // Dashboard values
  elements.dashboardVersionVal.textContent = `${cfg.server_name} (${cfg.version_channel})`;
}

elements.cfgRamSlider.addEventListener("input", (e) => {
  elements.ramSliderVal.textContent = `${e.target.value} GB`;
});

elements.cfgChannel.addEventListener("change", (e) => {
  const val = e.target.value;
  if (val === "release-latest") {
    elements.cfgImage.value = "ghcr.io/terkea/hytale-server:latest";
  } else if (val === "deinfreu-server") {
    elements.cfgImage.value = "docker.io/deinfreu/hytale-server:latest";
  } else if (val === "preview-channel") {
    elements.cfgImage.value = "ghcr.io/terkea/hytale-server:preview";
  }
});

elements.configForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const updated = {
    ...currentConfig,
    server_name: elements.cfgServerName.value.trim(),
    motd: elements.cfgMotd.value.trim(),
    version_channel: elements.cfgChannel.value,
    server_image: elements.cfgImage.value.trim(),
    memory: `${elements.cfgRamSlider.value}G`,
    max_view_radius: parseInt(elements.cfgViewRadius.value) || 8,
    max_players: parseInt(elements.cfgMaxPlayers.value) || 20,
    use_aot_cache: elements.cfgAotCache.checked,
    prod_mode: elements.cfgProdMode.checked,
    enable_ssh: elements.cfgEnableSsh.checked,
    ssh_user: elements.cfgSshUser.value.trim() || "adminhy",
    ssh_pass: elements.cfgSshPass.value.trim() || "hydeck123",
    playit_key: elements.cfgPlayitKey.value.trim()
  };

  showToast("Deploying Hytale server container in hy-pod...", "info");
  try {
    const res = await invoke("deploy_server", { config: updated });
    currentConfig = updated;
    showToast(res, "success");
    setTimeout(refreshStatus, 2000);
  } catch (err) {
    showToast(err, "error");
  }
});

// ==========================================
// NETWORK & ACCESS (PUBLIC IP / PLAYIT / SFTP)
// ==========================================
function switchConnectionMode(mode) {
  elements.connTabs.forEach(t => {
    t.classList.toggle("active", t.dataset.mode === mode);
  });
  
  if (mode === "playit") {
    elements.connPanePublic.classList.remove("active");
    elements.connPanePlayit.classList.add("active");
    elements.cardTunnelBadge.textContent = "Playit.gg";
    elements.cardTunnelBadge.className = "badge badge-yellow";
  } else {
    elements.connPanePlayit.classList.remove("active");
    elements.connPanePublic.classList.add("active");
    elements.cardTunnelBadge.textContent = t("status.public_ip");
    elements.cardTunnelBadge.className = "badge badge-blue";
  }
}

elements.connTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;
    switchConnectionMode(mode);
    currentConfig.connection_mode = mode;
    invoke("save_config", { config: currentConfig });
  });
});

async function loadNetworkInfo() {
  try {
    const info = await invoke("get_network_info");
    networkInfo = info;
    
    const localFull = `${info.local_ip}:${info.hy_game_port}`;
    elements.netLocalIpFull.textContent = localFull;
    elements.dashboardLocalIp.textContent = localFull;
    if (elements.guideLocalIp) elements.guideLocalIp.textContent = info.local_ip;
    
    if (info.public_ip) {
      const pubFull = `${info.public_ip}:${info.hy_game_port}`;
      elements.netPublicIpFull.textContent = pubFull;
      elements.dashboardPublicIp.textContent = pubFull;
    } else {
      elements.netPublicIpFull.textContent = t("status.no_public_ip");
      elements.dashboardPublicIp.textContent = t("status.not_available");
    }
    
    // SFTP URL
    const sftpUser = currentConfig.ssh_user || "adminhy";
    const sftpPort = currentConfig.ssh_port || 2223;
    elements.sftpLocalUrl.textContent = `sftp://${sftpUser}@${info.local_ip}:${sftpPort}`;
  } catch (err) {
    console.error("Error loading network info:", err);
  }
}

elements.btnTestUpnp.addEventListener("click", async () => {
  showToast("Testing local UPnP gateway...", "info");
  try {
    const [ok, msg] = await invoke("test_upnp");
    elements.upnpResultText.textContent = msg;
    if (ok) {
      elements.upnpResultBox.style.borderColor = "rgba(16, 185, 129, 0.5)";
      showToast("UPnP active!", "success");
    } else {
      elements.upnpResultBox.style.borderColor = "rgba(245, 158, 11, 0.5)";
      showToast("UPnP not responding on local network", "warning");
    }
  } catch (err) {
    showToast(err, "error");
  }
});

elements.btnSavePlayit.addEventListener("click", async () => {
  currentConfig.playit_key = elements.cfgPlayitKey.value.trim();
  currentConfig.connection_mode = "playit";
  showToast("Saving Playit configuration...", "info");
  try {
    await invoke("save_config", { config: currentConfig });
    await invoke("deploy_server", { config: currentConfig });
    showToast("Playit tunnel deployed!", "success");
  } catch (err) {
    showToast(err, "error");
  }
});

// Copy button handlers
document.querySelectorAll(".btn-copy").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.copy;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const text = targetEl.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = t("network.copied");
        setTimeout(() => { btn.textContent = originalText; }, 1500);
      });
    }
  });
});

// ==========================================
// STEAM INTEGRATION & TOOLS
// ==========================================
elements.btnInstallShortcuts.addEventListener("click", async () => {
  try {
    const res = await invoke("install_shortcuts");
    showToast(res, "success");
  } catch (err) {
    showToast(err, "error");
  }
});

// ==========================================
// LANGUAGE SELECTOR
// ==========================================
elements.langSelect.addEventListener("change", (e) => {
  setLanguage(e.target.value);
  if (lastStatus) updateUIWithStatus(lastStatus);
});

// ==========================================
// APP INITIALIZATION
// ==========================================
async function initApp() {
  initLanguage();
  await loadServerConfig();
  await loadNetworkInfo();
  await refreshStatus();
  
  // Set intervals for reactive monitoring
  setInterval(refreshStatus, 3000);
  setInterval(streamLogs, 2500);
  
  resetIdleTimer();
}

window.addEventListener("DOMContentLoaded", initApp);
