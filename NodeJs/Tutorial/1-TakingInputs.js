const readline = require('readline');

// Create an interface to read input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and wait for user input
rl.question('What is your name? ', (name) => {
  console.log(`Hello, ${name}!`);
  
  // Close the interface when done
  rl.close();
});

// Listen for the close event and exit the program
rl.on('close', () => {
  process.exit(0);
});
