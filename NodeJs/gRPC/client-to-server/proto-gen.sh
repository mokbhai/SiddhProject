#!/bin/bash

# Install protoc if not already installed
# For macOS: brew install protobuf
# For Linux: apt-get install -y protobuf-compiler

# Create directories if they don't exist
mkdir -p client/src/grpc

# Get the paths to plugins installed via npm
JS_PLUGIN_PATH=$(npm root -g)/protoc-gen-js/bin/protoc-gen-js
GRPC_WEB_PLUGIN_PATH=$(npm root -g)/protoc-gen-grpc-web/bin/protoc-gen-grpc-web

# Generate JavaScript code
protoc -I=./proto \
  --js_out=import_style=commonjs:./client/src/grpc \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./client/src/grpc \
  ./proto/calculator.proto

echo "Protocol buffer files generated successfully!" 