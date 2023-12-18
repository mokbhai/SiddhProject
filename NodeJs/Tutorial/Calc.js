const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculator() {
  rl.question('Enter the first number: ', (num1) => {
    rl.question('Enter the operator (+, -, *, /): ', (operator) => {
      rl.question('Enter the second number: ', (num2) => {
        const result = performOperation(parseFloat(num1), operator, parseFloat(num2));
        console.log(`Result: ${result}`);
        rl.close();
      });
    });
  });
  rl.on('close', () => {
    process.exit(0);
  });
}

function performOperation(num1, operator, num2) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
    default:
      return 'Invalid operator';
  }
}

calculator();
