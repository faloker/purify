#!/bin/sh

HOST=$(awk '$1=="server_name"{sub(/;/,""); print $2; exit}' /etc/nginx/nginx.conf)
PORT=$(awk '$1=="listen"{sub(/;/,""); print $2; exit}' /etc/nginx/nginx.conf)

if grep -q ssl /etc/nginx/nginx.conf; then
    PROTOCOL=https
else
    PROTOCOL=http
fi

echo "window.DOMAIN = \"$PROTOCOL://$HOST:$PORT/api\";" > app/config.js
exec nginx -g "daemon off;"