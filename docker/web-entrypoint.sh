#!/bin/sh
echo 'window.API_URL = "'$API_URL'";' > ./static/config.js
PORT=$PORT node lib/index.js