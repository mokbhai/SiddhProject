# Learn How to Use gRPC with Node.js and React.js

This document demonstrates a basic gRPC service that:

- Defines a Calculator service with an Add RPC method in the protocol buffer.
- Implements a server that handles the Add operation.
- Implements a client that calls the Add method.

## Overview

If you're feeling overwhelmed, you're not alone! It took me two days to understand how to use gRPC with Node.js and React.js. After multiple attempts, I finally got it working.

## How to Run the Project

1. Run the following command to build and start the services:
   - `docker-compose up --build`
   - or
   - `./run-container.sh`

2. Once the services are running, navigate to [http://localhost:3000/](http://localhost:3000/) for the frontend. It will call the gRPC proxy server running on [http://localhost:8080/](http://localhost:8080/) and display the result.

## Implementation Notes

### Examples Referenced

I tried multiple examples from [gRPC-Web GitHub Repository](https://github.com/grpc/grpc-web). Specifically, I followed the [Echo Example](https://github.com/grpc/grpc-web/blob/master/net/grpc/gateway/examples/echo). I created Dockerfiles for the server, client, and Envoy proxy.

For more details, check the [Dockerfiles](./docker/).

## Important

Don't forget to run the `proto-gen.sh` script to generate the proto files for the client. Otherwise, you will encounter errors.