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

// Create gRPC client
const client = new calculatorProto.Calculator(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Make the RPC call
function addNumbers(a, b) {
  client.Add({ a, b }, (err, response) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    console.log(`${a} + ${b} = ${response.result}`);
  });
}

function subtractNumbers(a, b) {
  client.Subtract({ a, b }, (err, response) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    console.log(`${a} - ${b} = ${response.result}`);
  });
}

// Test the calculator service
addNumbers(5, 3);
addNumbers(10, 20);
subtractNumbers(10, 20);
subtractNumbers(40, 20);