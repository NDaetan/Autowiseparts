#!/usr/bin/env bash

cleanup() {
    echo "Shutting down services..."
    echo "Killing all node processes..."
    pkill -15 npm
    echo "Services stopped."
}

trap cleanup EXIT

start_service() {
    local dir=$1
    echo "Starting $dir..."
    (
        cd "$dir"
        npm start --loglevel verbose > npm.log 2>&1
    ) &
}

start_service server
start_service client

echo "Services are starting up. Press Ctrl+C to stop all services."

wait

