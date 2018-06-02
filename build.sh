#!/bin/bash
set -e

if [ -z "$BUILD_MODE" ]; then
  BUILD_MODE="browserify"
fi

mkdir -p vendor/fonts
cp node_modules/font-awesome/fonts/* vendor/fonts

npx "$BUILD_MODE" -v -g cssify public/main.js -o public/bundle.js
