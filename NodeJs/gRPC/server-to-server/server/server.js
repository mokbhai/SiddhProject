const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load the protobuf
const PROTO_PATH = path.join(__dirname, "../proto/calculator.proto");
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
  const a = call.request.a;
  const b = call.request.b;
  const result = a + b;
  callback(null, { result });
}

function subtract(call, callback) {
  const a = call.request.a;
  const b = call.request.b;
  const result = a - b;
  callback(null, { result });
}

// Create gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(calculatorProto.Calculator.service, { add, subtract });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to bind server:", err);
        return;
      }
      server.start();
      console.log(`Server running at http://0.0.0.0:${port}`);
    }
  );
}

main();
