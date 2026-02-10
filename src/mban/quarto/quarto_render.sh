#!/bin/bash

## Simplified Quarto rendering script
## Dependencies (R, Python, Quarto) are set up in GitHub Actions workflow
## Note: Python packages are installed here (not in workflow) because they need
##       to be installed in the virtual environment created by this script

set -e  # Exit on error

# Get absolute path to Python
PYTHON_PATH=$(which python3)

# Prefer existing uv environment if present
UV_PATH=$(command -v uv || true)
VENV_DIR="venv"
if [ -n "$UV_PATH" ] && [ -d ".venv" ]; then
   VENV_DIR=".venv"
fi

## Python Setup ======================================================

# Create and activate virtual environment if needed
if [ ! -d "$VENV_DIR" ]; then
   if ! "$PYTHON_PATH" -m venv "$VENV_DIR"; then
       echo "Failed to create virtual environment"
       exit 1
   fi
fi

# Activate virtual environment
if ! . "$VENV_DIR"/bin/activate; then
   echo "Failed to activate virtual environment"
   exit 1
fi

# Verify virtual environment is active
if [ -z "$VIRTUAL_ENV" ]; then
   echo "Virtual environment not activated correctly"
   exit 1
fi

# Upgrade pip first
python -m pip install --upgrade pip

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
   if ! python -m pip install -r requirements.txt; then
       echo "Failed to install requirements"
       exit 1
   fi
fi

# Ensure jupyter-cache is installed (critical for Quarto freeze)
python -m pip install jupyter-cache pyyaml

## Render Quarto documents ======================================================

# Render all documents at project level (uses parallel rendering and freeze)
# This is much faster than rendering individual files
echo "Rendering Quarto project..."
quarto render

echo "All Quarto documents have been rendered successfully"