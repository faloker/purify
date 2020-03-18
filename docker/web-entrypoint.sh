#!/bin/sh
echo 'window.DOMAIN = "'$DOMAIN'/api";' > ./static/config.js
PORT=$PORT node dist/main.js