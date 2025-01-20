# Learn how to use gRPC with nodejs and react js

This should demonstrate a basic gRPC service that:

- Defines a Calculator service with an Add RPC method in the protocol buffer
- Implements a server that handles the Add operation
- Implements a client that calls the Add method

## for this I dont know what i have done!!.

It is too complicated to explain. it has take me whole 2 days to understand how to use gRPC with nodejs and react js. Multipe attemps finnaly i got it.

## How to run the project

1. `docker-compose up --build`
   or
   `./run-container.sh`

- that's it. now
  got to http://localhost:3000/ for frontend.
  it will call the gRPC proxy server running on http://localhost:8080/
  and then display the result.

## some basic notes how i have done this.

### tried multiple exaples of https://github.com/grpc/grpc-web

According to [echo example](https://github.com/grpc/grpc-web/blob/master/net/grpc/gateway/examples/echo) i have done this. i have create docker file for server and client and envoy proxy.

check [dockerfiles](./docker/) for more details.

## Also dont forget to run the `proto-gen.sh` to generate the proto files for client. Otherwise you will get error.
