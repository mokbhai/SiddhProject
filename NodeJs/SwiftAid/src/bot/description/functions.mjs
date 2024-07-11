//write the discription of functions here
//example description

const functionDescription = [
  {
    name: "emergency",
    description:
      "Creates an emergency instance in the database with provided details such as ambulance ID, user ID, and description and provide them details for first-aid treatment. Be more descriptive about first-aid treatment.",
    parameters: {
      type: "object",
      properties: {
        ambulanceId: {
          type: "string",
          description: "ID of the ambulance involved in the emergency.",
        },
        userId: {
          type: "string",
          description: "ID of the user involved in the emergency.",
        },
        description: {
          type: "string",
          description: "Description of the emergency situation.",
        },
      },
    },
    required: ["ambulanceId", "userId", "description"],
  },

  // {
  //   name: "email",
  //   description: "sends the email to the user's family ",
  //   parameters: {
  //     type: "object",
  //     properties: {
  //       subject: {
  //         type: "string",
  //         description: "subject of the email",
  //       },
  //       emailAddress: {
  //         type: "string",
  //         description: "get email from getUserById function",
  //       },

  //       Body: {
  //         type: "string",
  //         description:
  //           "body of the email that user wants to write and enhace the body, add your content too.",
  //       },
  //     },
  //   },
  //   required: ["Body", "email", "subject"],
  // },
];

export { functionDescription };
