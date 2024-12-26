#!/bin/bash

# Set variables
QUARTO_VERSION="1.6.39"
QUARTO_ARCH="linux-amd64"

# Check if R is installed
if command -v R &> /dev/null; then
    echo "R is already installed: $(R --version | head -n 1)"
else
    echo "R not found. Installing R..."
    # Update package list
    apt-get update
    
    # Install R and R development packages
    apt-get install -y r-base r-base-dev
fi

# Check if Quarto is installed in the system PATH
CURRENT_QUARTO=$(which quarto 2>/dev/null)

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
    # Create installation directories
    mkdir -p "$HOME/opt" "$HOME/.local/bin"

    # Download Quarto
    echo "Downloading Quarto v${QUARTO_VERSION}..."
    curl -LO "https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz"

    # Extract Quarto
    tar -xvzf "quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz" -C "$HOME/opt"

    # Create symlink
    ln -s "$HOME/opt/quarto-${QUARTO_VERSION}/bin/quarto" "$HOME/.local/bin/quarto"

    # Update PATH permanently
    if ! grep -q "$HOME/.local/bin" "$HOME/.bashrc"; then
        echo 'export PATH="$PATH:$HOME/.local/bin"' >> "$HOME/.bashrc"
    fi
    source "$HOME/.bashrc"

    # Verify installation
    quarto check

    # Clean up downloaded archive
    rm "quarto-${QUARTO_VERSION}-${QUARTO_ARCH}.tar.gz"

    echo "Quarto installation complete."
fi

# Install R packages for Quarto
R -e "install.packages(c('knitr', 'rmarkdown'), repos='http://cran.rstudio.com/')"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    /usr/bin/python3 -m venv venv
    . venv/bin/activate
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
else
    . venv/bin/activate
fi

# Find all .qmd files recursively and render them
find . -type f -name "*.qmd" -exec quarto render {} \;

echo "All Quarto documents have been rendered"