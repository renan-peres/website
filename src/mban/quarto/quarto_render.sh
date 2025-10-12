#!/bin/bash

## Set variables ======================================================

QUARTO_VERSION="1.6.39"
QUARTO_ARCH="linux-amd64"

# Update PATH for this session
export PATH="$PATH:$HOME/.local/bin"

# Get absolute path to Python
PYTHON_PATH=$(which python3)

# Check if Quarto is installed in the system PATH
CURRENT_QUARTO=$(which quarto 2>/dev/null)

## R Setup ======================================================

# Check if R is installed
which R || echo "R not found"

# If not found, install R
if [ ! -x "$(command -v R)" ]; then
    sudo apt-get update && sudo apt-get install -y && sudo apt install r-base-core r-base r-base-dev \
    libudunits2-dev \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    pandoc
    which R
fi

# Ensure that the renv package is available; install if needed.
Rscript -e "if (!requireNamespace('renv', quietly = TRUE)) install.packages('renv', repos='https://cran.rstudio.com')"

if [ ! -f "renv.lock" ]; then
  echo "renv.lock not found. Installing packages from r_packages.txt..."

  # Check if r_packages.txt exists
  if [ ! -f "r_packages.txt" ]; then
    echo "Error: r_packages.txt file not found."
    exit 1
  fi

  # Read each package name from r_packages.txt and install it via renv.
  while IFS= read -r pkg || [ -n "$pkg" ]; do
    # Skip empty lines and lines starting with #
    if [[ -z "$pkg" ]] || [[ "$pkg" =~ ^# ]]; then
      continue
    fi

    echo "Installing package: $pkg"
    Rscript -e "if (!requireNamespace('$pkg', quietly = TRUE)) renv::install('$pkg')"
  done < r_packages.txt

  # Snapshot the current state to create renv.lock
  echo "Creating renv.lock file with renv::snapshot()..."
  Rscript -e "renv::snapshot(confirm = FALSE)"
else
  echo "renv.lock found. Restoring renv environment..."
  Rscript -e "renv::restore(confirm = FALSE)"
fi

## Python Setup ======================================================

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
cd src/dev/quarto
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

## Quarto Setup ======================================================

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