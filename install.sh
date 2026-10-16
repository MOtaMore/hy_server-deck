#!/usr/bin/env bash
# ==============================================================================
# Hy Server-Deck: Official Installer for Steam Deck (SteamOS / Arch Linux)
# Version: 1.0 (Rust + Tauri Native Engine with Rootless Podman)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}     Hy Server-Deck: Steam Deck Installer           ${NC}"
echo -e "${BLUE}   Hytale Dedicated Server with Rootless Podman     ${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

INSTALL_DIR="$HOME/.local/share/hy-server-deck"
mkdir -p "$INSTALL_DIR/assets"
mkdir -p "$HOME/hytale-server/data"
mkdir -p "$HOME/hytale-server/ssh-config"
mkdir -p "$HOME/Desktop"
mkdir -p "$HOME/.local/share/applications"

# 1. Check native SteamOS Podman
echo -e "${YELLOW}[1/5] Verifying Podman on SteamOS...${NC}"
if ! command -v podman &> /dev/null; then
    echo -e "${RED}Error: Podman is not installed or not found in PATH.${NC}"
    echo "SteamOS includes podman by default. Please verify your installation."
    exit 1
fi
PODMAN_VER=$(podman --version)
echo -e "${GREEN}✔ Podman detected:${NC} $PODMAN_VER"

# 2. Check system & compilation dependencies (GLib, WebKitGTK, pkg-config, etc.)
echo -e "${YELLOW}[2/5] Verifying system libraries and build dependencies...${NC}"
export PKG_CONFIG_PATH="/usr/lib/pkgconfig:/usr/share/pkgconfig:${PKG_CONFIG_PATH:-}"

MISSING_PKGS=()

# Check for pkg-config or pkgconf
if ! command -v pkg-config &> /dev/null && ! command -v pkgconf &> /dev/null; then
    MISSING_PKGS+=("pkgconf")
fi

# Check for C compiler
if ! command -v cc &> /dev/null && ! command -v gcc &> /dev/null; then
    MISSING_PKGS+=("base-devel")
fi

# Check for glib-2.0 development files (glib-2.0.pc)
if ! pkg-config --exists glib-2.0 2>/dev/null && [ ! -f "/usr/lib/pkgconfig/glib-2.0.pc" ] && [ ! -f "/usr/share/pkgconfig/glib-2.0.pc" ]; then
    MISSING_PKGS+=("glib2")
fi

# Check for WebKitGTK 4.1
if ! ldconfig -p 2>/dev/null | grep -q "libwebkit2gtk-4.1.so.0" && [ ! -f "/usr/lib/libwebkit2gtk-4.1.so.0" ]; then
    MISSING_PKGS+=("webkit2gtk-4.1")
fi

if [ ${#MISSING_PKGS[@]} -gt 0 ]; then
    echo -e "${YELLOW}SteamOS is missing development packages required to compile Tauri apps:${NC}"
    for pkg in "${MISSING_PKGS[@]}"; do
        echo -e "  - ${CYAN}${pkg}${NC}"
    done
    echo ""
    echo -e "SteamOS uses an immutable filesystem. We need to temporarily unlock it to install them via pacman."
    read -p "Do you want to install missing packages now (${MISSING_PKGS[*]})? (Y/n): " ans
    if [[ "$ans" =~ ^([yYsS]|)$ ]]; then
        echo -e "${CYAN}Unlocking filesystem and installing packages...${NC}"
        sudo steamos-readonly disable
        sudo pacman-key --init
        sudo pacman-key --populate archlinux holo
        sudo pacman -Sy --noconfirm "${MISSING_PKGS[@]}"
        sudo steamos-readonly enable
        echo -e "${GREEN}✔ Missing packages installed successfully.${NC}"
    else
        echo -e "${RED}Warning: Compilation will likely fail without ${MISSING_PKGS[*]}.${NC}"
    fi
else
    echo -e "${GREEN}✔ All compilation and GUI dependencies detected on system.${NC}"
fi

# 3. Check Application Binary
echo -e "${YELLOW}[3/5] Verifying executable binary...${NC}"

INSTALLED=false

# Case A: Pre-compiled binary in the repository (Recommended for Steam Deck)
if [ -f "bin/hy-server-deck" ]; then
    echo -e "${GREEN}✔ Pre-compiled Linux binary detected in 'bin/hy-server-deck'.${NC}"
    echo -e "${CYAN}Installing optimized binary without requiring compilers on the console...${NC}"
    cp "bin/hy-server-deck" "$INSTALL_DIR/hy-server-deck"
    INSTALLED=true
elif [ -f "src-tauri/target/release/hy-server-deck" ]; then
    echo -e "${GREEN}✔ Previously compiled binary found in target/release.${NC}"
    cp "src-tauri/target/release/hy-server-deck" "$INSTALL_DIR/hy-server-deck"
    INSTALLED=true
fi

# Case B: If pre-compiled binary is not present, compile from source code
if [ "$INSTALLED" = false ]; then
    echo -e "${YELLOW}Binary not found. Proceeding to compile from source code...${NC}"

    # Check Frontend
    if [ ! -f "dist/index.html" ]; then
        if ! command -v npm &> /dev/null; then
            echo -e "${YELLOW}Downloading portable user-space Node.js to build frontend...${NC}"
            NODE_DIR="$HOME/.local/share/hy-server-deck/tools"
            mkdir -p "$NODE_DIR"
            NODE_VER="v20.18.0"
            NODE_TAR="node-${NODE_VER}-linux-x64.tar.xz"
            curl -fsSL "https://nodejs.org/dist/${NODE_VER}/${NODE_TAR}" -o "/tmp/${NODE_TAR}"
            tar -xf "/tmp/${NODE_TAR}" -C "$NODE_DIR"
            rm -f "/tmp/${NODE_TAR}"
            export PATH="$NODE_DIR/node-${NODE_VER}-linux-x64/bin:$PATH"
        fi
        npm install
        npm run build
    fi

    # Check Rust / Cargo
    if ! command -v cargo &> /dev/null; then
        echo -e "${YELLOW}Installing Rust and Cargo in user space...${NC}"
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env" || export PATH="$HOME/.cargo/bin:$PATH"
    fi

    export PKG_CONFIG_PATH="/usr/lib/pkgconfig:/usr/share/pkgconfig:${PKG_CONFIG_PATH:-}"
    echo -e "${YELLOW}Compiling with Cargo in Release mode...${NC}"
    cd src-tauri
    cargo build --release
    cd ..
    mkdir -p bin
    cp "src-tauri/target/release/hy-server-deck" "$INSTALL_DIR/hy-server-deck"
    cp "src-tauri/target/release/hy-server-deck" "bin/hy-server-deck"
fi

# 4. Permissions and assets
echo -e "${YELLOW}[4/5] Setting up files and permissions...${NC}"
chmod +x "$INSTALL_DIR/hy-server-deck"
cp assets/icon.png "$INSTALL_DIR/assets/icon.png"

# 5. Create SteamOS shortcuts
echo -e "${YELLOW}[5/5] Creating SteamOS shortcuts...${NC}"
DESKTOP_ENTRY="[Desktop Entry]
Name=Hy Server-Deck
Comment=Native Podman Hytale Dedicated Server for Steam Deck
Exec=$INSTALL_DIR/hy-server-deck
Icon=$INSTALL_DIR/assets/icon.png
Terminal=false
Type=Application
Categories=Game;Utility;
StartupNotify=true"

echo "$DESKTOP_ENTRY" > "$HOME/Desktop/Hy-Server-Deck.desktop"
echo "$DESKTOP_ENTRY" > "$HOME/.local/share/applications/Hy-Server-Deck.desktop"
chmod +x "$HOME/Desktop/Hy-Server-Deck.desktop"
chmod +x "$HOME/.local/share/applications/Hy-Server-Deck.desktop"

echo ""
echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}    ✔ Hy Server-Deck Installation Complete!        ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo ""
echo -e "You can launch the application from the shortcut on your ${YELLOW}Desktop${NC}."
echo ""
echo -e "${BLUE}To add it to Gaming Mode:${NC}"
echo "1. Open Steam in Desktop Mode."
echo "2. Click 'Games' -> 'Add a Non-Steam Game to My Library...'."
echo "3. Select 'Hy Server-Deck' from the list (or browse to $INSTALL_DIR/hy-server-deck)."
echo "4. Done! Return to Gaming Mode and enjoy at 1280x800 with touch and controller support."
echo ""
