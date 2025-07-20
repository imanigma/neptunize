#!/bin/bash
# Create health.json file for Railway health checks
echo '{"status":"healthy","service":"neptunize-frontend","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > dist/health.json
echo "Health check file created at dist/health.json"
