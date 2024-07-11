import OpenAI from "openai";
import { functionDescription } from "./description/functions.mjs";
// import email from "../email/email.js";
import { CONTENT, MODEL, OPENAI_API_KEY, USER_ROLE } from "../../ENV.js";
import { Emergency } from "../models/EmergecyModel.js";
import mongoose from "mongoose";
import { User } from "../models/UserModel.js";
import email from "./email.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const funcDes = functionDescription;

const runOpenAIRequest = async (Input, ambulanceId, userId, location) => {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  let messages = [
    {
      role: "system",
      content: CONTENT,
    },
    {
      role: "user",
      content: Input,
    },
  ];

  try {
    let response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      functions: funcDes,
    });

    let executedFunctions = {};
    while (
      response.choices[0].message.function_call &&
      response.choices[0].finish_reason !== "stop"
    ) {
      let message = response.choices[0].message;
      let function_name = message.function_call.name;
      if (executedFunctions[function_name]) {
        console.log(
          `Function ${function_name} has already been executed. Skipping...`
        );
        break;
      }
      let function_response = "";
      switch (function_name) {
        case "writeFile":
          // let writeFileArgs = JSON.parse(message.function_call.arguments);
          // function_response = await writeFile(writeFileArgs.content);
          //   console.log("called write function");
          break;

        case "emergency":
          // Create emergency description
          let description = message.function_call.arguments;
          // Create emergency in the database
          const createEmergencyResponce = await createEmergency({
            ambulanceId,
            userId,
            location: {
              lat: location.latitude,
              long: location.longitude,
              accuracy: location.accuracy,
            },
            description,
          });
          const user = await getUserByIdFunc(createEmergencyResponce.userId);
          console.log(user);

          function_response = JSON.stringify(createEmergencyResponce);
          break;
        case "getUserById":
          // Make API call to retrieve vacancies
          try {
            function_response = await getUserByIdFunc(userId);
            console.log(function_response);
          } catch (error) {
            console.error("Error fetching vacancies:", error);
          }
          break;
        case "email":
          let emailArgs = JSON.parse(message.function_call.arguments);
          function_response = email(
            emailArgs.subject,
            emailArgs.emailAddress,
            emailArgs.Body
          );
          await delay(500);
          break;
        default:
          throw new Error(`Unsupported function: ${function_name}`);
      }
      executedFunctions[function_name] = true;
      messages.push({
        role: "function",
        name: function_name,
        content: function_response,
      });
      //   console.log(`Sending request to LLM with ${function_name} response...`);
      //   console.log("Messages before API call:", messages);
      response = await openai.chat.completions.create({
        model: MODEL,
        messages: messages,
        functions: funcDes,
      });
    }

    response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      functions: funcDes,
    });
    console.log(response);
    return JSON.stringify(response.choices[0].message);
  } catch (error) {
    console.error("Error:", error);
  }
};

const createEmergency = async ({
  ambulanceId,
  userId,
  description,
  location,
}) => {
  try {
    // Check if required parameters are provided
    if (!ambulanceId || !userId || !description) {
      throw new Error("Ambulance ID, User ID, and Description are required.");
    }

    // Create a new emergency instance
    const newEmergency = new Emergency({
      _id: new mongoose.Types.ObjectId(),
      ambulanceId,
      userId,
      description,
      location,
    });

    // Save the new emergency instance to the database
    const savedEmergency = await newEmergency.save();

    return savedEmergency;
  } catch (error) {
    console.error("Error creating emergency:", error);
    return { error: "Internal Server Error" };
  }
};

const getUserByIdFunc = async (userId) => {
  try {
    // Find the user by ID in the database
    const user = await User.findById(userId).populate("familyIds");

    // Omit password from user object
    const { password, ...userData } = user.toObject();

    // Return the user details along with populated family details
    return { message: "found", user: userData };
  } catch (error) {
    // Return error response
    return { message: "Internal server error" };
  }
};

export default runOpenAIRequest;
