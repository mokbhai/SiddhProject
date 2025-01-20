const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.resolve(__dirname, "../proto/calculator.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const calculatorProto =
  grpc.loadPackageDefinition(packageDefinition).calculator;

// Implement the Add RPC method
function add(call, callback) {
  const { a, b } = call.request;
  const result = a + b;
  callback(null, { result });
}

function multiply(call, callback) {
  const { a, b } = call.request;
  const result = a * b;
  callback(null, { result });
}

// Create gRPC server
function startServer() {
  const server = new grpc.Server();
  server.addService(calculatorProto.Calculator.service, { add, multiply });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Server running at http://0.0.0.0:${port}`);
    }
  );
}

startServer();
