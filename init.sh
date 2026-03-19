#!/bin/bash
echo "Initializing Axiom Core Skills via Node.js / Python..."
if command -v node >/dev/null 2>&1; then
    node init.js
elif command -v python3 >/dev/null 2>&1; then
    python3 init.py
elif command -v python >/dev/null 2>&1; then
    python init.py
else
    echo "❌ Error: Neither Node.js nor Python is installed. Please install one to initialize the environment."
    exit 1
fi
