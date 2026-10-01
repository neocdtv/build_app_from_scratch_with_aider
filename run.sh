#!/bin/bash

# Check if running on macOS/Linux
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Check if python3 is available
    if command -v python3 &> /dev/null; then
        echo "Starting local server with Python 3..."
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Starting local server with Python..."
        python -m SimpleHTTPServer 8000
    elif command -v php &> /dev/null; then
        echo "Starting local server with PHP..."
        php -S localhost:8000
    else
        echo "No suitable web server found. Please install python3, php, or use npx http-server"
        exit 1
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    if command -v python3 &> /dev/null; then
        echo "Starting local server with Python 3..."
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Starting local server with Python..."
        python -m SimpleHTTPServer 8000
    elif command -v php &> /dev/null; then
        echo "Starting local server with PHP..."
        php -S localhost:8000
    else
        echo "No suitable web server found. Try: npx http-server -p 8000"
        exit 1
    fi
fi
