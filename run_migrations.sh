#!/bin/sh -x

echo "Starting migrations:"

db-migrate -e pg --m migrations --config database.json reset
db-migrate -e pg --m migrations --config database.json up
