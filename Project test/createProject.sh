
# Take project name as argument
PROJECT_NAME=$1

# Create Main directorie
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Initialize Project
npm init
# npm install

# Create directories
mkdir -p src/config
mkdir -p src/controllers
mkdir -p src/loaders
mkdir -p src/middlewares
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/test

# Create files
touch index.js
touch src/config/index.js
touch src/config/.env
touch src/config/sample.env
touch src/controllers/index.js
touch src/loaders/index.js
touch src/loaders/mongoDB.js
touch src/middlewares/index.js
touch src/models/index.js
touch src/routes/index.js
touch src/services/index.js
touch src/test/index.js

cat << EOF > src/loaders/MongoDB.js
import mongoose from "mongoose";
import { MONGODB_URI } from "../ENV.js";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("mongodb connected.");
  })
  .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
EOF


cat << EOF > Introduction.md
## Project Folder Structure
The below structure is what I use as a template in nearly all of my Node.js projects. This enables us to implement Separation of Concerns for our application.

src
│   index.js        # Entry point for application
└───config          # Application environment variables and secrets
└───controllers     # Express controllers for routes, respond to client requests, call services
└───loaders         # Handles all startup processes
└───middlewares     # Operations that check or maniuplate request prior to controller utilizing
└───models          # Database models
└───routes          # Express routes that define API structure
└───services        # Encapsulates all business logic
└───test            # Tests go here
EOF


cat << EOF > controllers/dummy/index.js
// controllers/Post/index.js

const PostService = require( "../services/PostService" );
const PostServiceInstance = new PostService();

module.exports = { createCord };

/**
 * @description Create a cord with the provided body
 * @param req {object} Express req object 
 * @param res {object} Express res object
 * @returns {Promise<*>}
 */
async function createCord ( req, res ) {
  try {
    // We only pass the body object, never the req object
    const createdCord = await PostServiceInstance.create( req.body );
    return res.send( createdCord );
  } catch ( err ) {
    res.status( 500 ).send( err );
  }
}
EOF