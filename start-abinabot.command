#!/bin/bash
cd "$(dirname "$0")"
echo "🤖 Starting Abinabot server on http://localhost:8085 ..."
(sleep 1 && open "http://localhost:8085") &
python3 -m http.server 8085
