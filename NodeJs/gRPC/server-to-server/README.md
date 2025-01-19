## Learn how to use gRPC with nodejs

### This example demonstrates a basic gRPC service that:

- Defines a Calculator service with an Add RPC method in the protocol buffer
- Implements a server that handles the Add operation
- Implements a client that calls the Add method

### 1. Setup project

```bash
mkdir grpc-nodejs-example
cd grpc-nodejs-example
npm init -y
```

### 2. Install required dependencies

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

### 3. Create proto definition

Create a new directory `proto` and add the calculator service definition:

```bash
mkdir proto
touch proto/calculator.proto
```

### 4. Create server

```bash
mkdir server
touch server/server.js
```

### 5. Create client

```bash
mkdir client
touch client/client.js
```

### 6. Run the example

Start the server:

```bash
node server/server.js
```

In another terminal, run the client:

```bash
node client/client.js
```
