#!/bin/bash

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