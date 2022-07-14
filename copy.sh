#!/bin/bash

frontend_build_dir="$(pwd)/build"
old_backend_build_dir="$(dirname "$(pwd)")/backend/client"
new_build_dir="$(dirname "$(pwd)")/backend/client"
rm -rf "$old_backend_build_dir"
cp -r "$frontend_build_dir" "$new_build_dir"
