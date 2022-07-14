#!/bin/bash

tms_dir="$(dirname "$(pwd)")"
frontend_build_dir="$(pwd)/build"
old_backend_build_dir="$(dirname "$(pwd)")/backend/client"
new_build_dir="$(dirname "$(pwd)")/backend/client"
rm -rf "$old_backend_build_dir"
cp -r "$frontend_build_dir" "$new_build_dir"
cd "$tms_dir" || { echo "No such directory: tms_dir"; exit 1; }
tar -czf tr-api.tar.gz backend --transform s/backend/tr-api/