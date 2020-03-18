#!/bin/sh
echo 'window.DOMAIN = "https://'$DOMAIN'/api";' > ./static/config.js
PORT=$PORT node dist/main.js