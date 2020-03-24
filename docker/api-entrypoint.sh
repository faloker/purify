#!/bin/sh
migrate-mongo status
migrate-mongo up
migrate-mongo status

PORT=$PORT node dist/main.js