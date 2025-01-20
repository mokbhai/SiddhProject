const { CalculatorClient } = require("./calculator_grpc_web_pb");
const { AddRequest, MultiplyRequest } = require("./calculator_pb");

const client = new CalculatorClient("http://localhost:8080", null, null);

export const CalculatorService = {
  add: (a, b) => {
    return new Promise((resolve, reject) => {
      const request = new AddRequest();
      request.setA(a);
      request.setB(b);

      client.add(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
  multiply: (a, b) => {
    return new Promise((resolve, reject) => {
      const request = new MultiplyRequest();
      request.setA(a);
      request.setB(b);

      client.multiply(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    }); 
  },
};
