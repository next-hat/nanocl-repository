#!/bin/sh

# TEST IF DIRECTORY ENV EXISTS

if [ -z "$DIRECTORY" ]; then
  echo "DIRECTORY environment variable is not set. Exiting."
  exit 1
fi

# TEST IF COMMAND ENV EXISTS

if [ -z "$COMMAND" ]; then
  echo "COMMAND environment variable is not set. Exiting."
  exit 1
fi

inotifywait -e close_write,moved_to,create -m $DIRECTORY |
while read -r directory events filename; do
  sh -c "$COMMAND"
done
