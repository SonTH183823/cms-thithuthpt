#!/bin/bash

DOMAIN="$1"
echo $DOMAIN
DATA="{ \"files\": [\"$DOMAIN/*\"] }"
echo $DATA
# Reference: https://api.cloudflare.com/#zone-purge-files-by-url
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE/purge_cache" \
     -H "X-Auth-Email: $CF_EMAIL" \
     -H "X-Auth-Key: $CF_API_KEY" \
     -H "Content-Type: application/json" \
     --data "$DATA"
