#!/bin/sh
echo 'window.DOMAIN = "https://'$DOMAIN'/api";' > ./static/config.js

# migrate-mongo status
# migrate-mongo up
# migrate-mongo status

migrate-mongo up && PORT=$PORT node dist/main.js