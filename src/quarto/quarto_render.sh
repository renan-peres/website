#!/bin/bash

# Set variables
QUARTO_VERSION="1.6.39"
QUARTO_ARCH="linux-amd64"

# Update PATH for this session
export PATH="$PATH:$HOME/.local/bin"

# Get absolute path to Python
PYTHON_PATH=$(which python3)

# Check if Quarto is installed in the system PATH
CURRENT_QUARTO=$(which quarto 2>/dev/null)

# Check if R is installed
which R || echo "R not found"

# If not found, install R
if [ ! -x "$(command -v R)" ]; then
    sudo apt update
    sudo apt install r-base-core r-base r-base-dev
    which R
fi

# Create and activate virtual environment
if [ ! -d "venv" ]; then
   if ! "$PYTHON_PATH" -m venv venv; then
       echo "Failed to create virtual environment"
       exit 1
   fi
fi

# Verify we're using the virtual environment
if ! . venv/bin/activate; then
   echo "Failed to activate virtual environment"
   exit 1
fi

ACTIVE_PYTHON=$(which python3)
if [[ "$ACTIVE_PYTHON" != *"venv"* ]]; then
   echo "Virtual environment not activated correctly"
   exit 1
fi

if [ -f "requirements.txt" ]; then
   if ! pip install -r requirements.txt; then
       echo "Failed to install requirements"
       exit 1
   fi
fi

# Install required packages for Quarto
pip install jupyter pyyaml

# Function to check Quarto version
check_quarto_version() {
   if [ -n "$CURRENT_QUARTO" ]; then
       INSTALLED_VERSION=$("$CURRENT_QUARTO" --version 2>/dev/null)
       if [ "$INSTALLED_VERSION" = "$QUARTO_VERSION" ]; then
           echo "Quarto $QUARTO_VERSION is already installed."
           return 0
       fi
   fi
   return 1
}

# If Quarto is not installed or version doesn't match, proceed with installation
if ! check_quarto_version; then
   mkdir -p "$HOME/opt" "$HOME/.local/bin"
   curl -LO "https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz"
   tar -xzf "quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz" -C "$HOME/opt"
   ln -sf "$HOME/opt/quarto-${QUARTO_VERSION}/bin/quarto" "$HOME/.local/bin/quarto"
   
   if ! grep -q "$HOME/.local/bin" "$HOME/.bashrc"; then
       echo 'export PATH="$PATH:$HOME/.local/bin"' >> "$HOME/.bashrc"
   fi

   if ! quarto check; then
       echo "Quarto installation failed"
       exit 1
   fi

   rm "quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz"
fi

# Render Quarto documents
find . -type f -name "*.qmd" -exec quarto render {} \;

echo "All Quarto documents have been rendered"