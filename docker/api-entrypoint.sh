#!/bin/sh

# migrate-mongo status
# migrate-mongo up
# migrate-mongo status

migrate-mongo up && PORT=$PORT node dist/main.js