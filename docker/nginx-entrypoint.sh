#!/bin/sh

HOST=$(grep -m1 -Poe 'server_name \K[^;\s]+' /etc/nginx/nginx.conf)
PORT=$(grep -m1 -Poe 'listen \K[^;\s]+' /etc/nginx/nginx.conf)

if grep -q ssl /etc/nginx/nginx.conf; then
    PROTOCOL=https
else
    PROTOCOL=http
fi

echo "window.DOMAIN = \"$PROTOCOL://$HOST:$PORT/api\";" > app/config.js
exec nginx -g "daemon off;"