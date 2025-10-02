import { AzureOpenAI, ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  HumanMessage,
  AIMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import { config, getLLMApiKey } from "../utils/config";
import { detailedResume } from "./detailedResume";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import path from "path";

/**
 * Job Application Automation Workflow
 *
 * This workflow demonstrates:
 * 1. Loading resume data
 * 2. Accepting job application URL
 * 3. Using Playwright MCP to automate form filling
 * 4. Smart form field mapping from resume data
 * 5. Draft-only filling (no submission)
 *
 * NOTE: This tool will only fill the application form as a draft.
 * It will NOT submit the application - this must be done manually.
 */

// Define the state schema for our job application workflow
const JobApplicationState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  currentStep: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  resumeData: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
  applicationUrl: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  jobDescription: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  jobDescriptionSource: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  jobAnalysis: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  mcpTools: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
  }),
  fillResults: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  status: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
});

type chatModels = ChatOpenAI | ChatGoogleGenerativeAI;

type JobApplicationStateType = typeof JobApplicationState.State;

/**
 * Helper function to handle tool calls in a loop until completion
 * @param initialResult - The initial AI response that may contain tool calls
 * @param modelWithTools - The model bound with MCP tools
 * @param mcpTools - Array of available MCP tools
 * @param context - Context string for logging (e.g., "JD extraction", "form filling")
 * @returns The final AI response after all tool calls are completed
 */
async function handleToolCalls(
  initialResult: any,
  modelWithTools: any,
  mcpTools: any[],
  context: string = "tool execution"
) {
  // Initialize messages with the AI's response
  let messages = [initialResult];
  let currentMessage = initialResult;

  // Handle tool calls if any
  while (currentMessage.tool_calls && currentMessage.tool_calls.length > 0) {
    console.log(
      `🔧 Executing ${currentMessage.tool_calls.length} tool calls for ${context}...`
    );

    // Create a ToolNode to execute the tools
    const toolNode = new ToolNode(mcpTools || []);

    // Execute the tools
    const toolResults = await toolNode.invoke({
      messages: messages,
    });

    // Add tool results to messages
    if (toolResults.messages) {
      messages = messages.concat(toolResults.messages);
    }

    // Get the next response from the model
    currentMessage = await modelWithTools.invoke(messages);
    messages.push(currentMessage);
  }

  return currentMessage;
}

function configModel(): chatModels {
  let model: chatModels;
  if (config.llm.provider === "google") {
    // Initialize the ChatGeminiAI model
    model = new ChatGoogleGenerativeAI({
      model: config.llm.model,
      temperature: config.llm.temperature,
      apiKey: getLLMApiKey(),
    });
    console.log("✅ ChatGeminiAI model initialized");
  } else if (
    config.llm.provider === "openai" ||
    config.llm.provider === "azure" ||
    config.llm.provider === "openrouter"
  ) {
    // Initialize the ChatOpenAI model
    model = new ChatOpenAI({
      modelName: config.llm.model,
      temperature: config.llm.temperature,
      configuration: {
        baseURL: config.llm.baseUrl,
        defaultHeaders: {
          "HTTP-Referer": "https://localhost:3000",
          "X-Title": "localhost (AI Job Applier)",
        },
      },
      apiKey: getLLMApiKey(),
    });
    console.log("✅ ChatOpenAI model initialized");
  } else {
    throw new Error(`Unsupported LLM provider: ${config.llm.provider}`);
  }
  return model;
}

async function jobApplicationWorkflow() {
  console.log("🚀 Starting Job Application Automation Workflow\n");

  // Initialize MCP client for Playwright tools
  console.log("🔧 Initializing Playwright MCP client...");
  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      playwright: config.mcp.playwright,
    },
  });

  try {
    let model: chatModels = configModel();

    console.log("🎯 Playwright MCP configuration:", config.mcp.playwright);

    // Get MCP tools
    const mcpTools = await mcpClient.getTools();
    const modelWithTools = model.bindTools(mcpTools);
    console.log(`✅ Loaded ${mcpTools.length} Playwright MCP tools`);

    // Define workflow nodes

    // 1. Setup MCP Tools Node - Initializes MCP tools for the workflow
    const setupMCPToolsNode = async (state: JobApplicationStateType) => {
      console.log("🔧 Setting up MCP tools...");

      return {
        messages: [new AIMessage("MCP tools initialized successfully")],
        currentStep: "mcp_setup",
        mcpTools,
      };
    };

    // 2. Load Resume Node - Loads resume data from detailedResume
    const loadResumeNode = async (state: JobApplicationStateType) => {
      console.log("📄 Loading resume data...");

      const resumeData = detailedResume;
      console.log("✅ Resume loaded successfully");
      console.log(`👤 Applicant: ${resumeData.personalInfo.name}`);
      console.log(`📧 Email: ${resumeData.personalInfo.email}`);

      return {
        messages: [new AIMessage("Resume data loaded successfully")],
        currentStep: "resume_loaded",
        resumeData,
      };
    };

    // 2. Get Application URL Node - Accepts the job application URL
    const getApplicationUrlNode = async (state: JobApplicationStateType) => {
      console.log("🔗 Getting application URL...");

      const lastMessage = state.messages[0];
      let applicationUrl = "";

      // Extract URL from the user's message
      if (lastMessage && typeof lastMessage.content === "string") {
        const urlMatch = lastMessage.content.match(/(https?:\/\/[^\s]+)/);
        applicationUrl = urlMatch ? urlMatch[1] : lastMessage.content;
      }

      if (!applicationUrl || !applicationUrl.startsWith("http")) {
        throw new Error("Please provide a valid job application URL");
      }

      console.log(`🎯 Application URL: ${applicationUrl}`);

      return {
        messages: [new AIMessage(`Application URL set: ${applicationUrl}`)],
        currentStep: "url_set",
        applicationUrl,
      };
    };

    // 3. Get Job Description Node - Gets JD from URL or user input
    const getJobDescriptionNode = async (state: JobApplicationStateType) => {
      console.log("📋 Getting job description...");

      const lastMessage = state.messages[state.messages.length - 1];
      let jobDescription = "";
      let jobDescriptionSource = "";

      // Check if user provided job description directly
      if (lastMessage && typeof lastMessage.content === "string") {
        const content = lastMessage.content.toLowerCase();

        // Look for keywords that indicate user provided JD
        if (
          content.includes("job description:") ||
          content.includes("jd:") ||
          content.includes("requirements:") ||
          content.includes("responsibilities:")
        ) {
          jobDescription = lastMessage.content;
          jobDescriptionSource = "user_provided";
          console.log("📝 Using user-provided job description");
        }
      }

      // If no user-provided JD, try to extract from URL
      if (!jobDescription && state.applicationUrl) {
        console.log("🌐 Attempting to extract job description from URL...");

        try {
          // Create a prompt to extract JD from URL content
          const extractJDPrompt = ChatPromptTemplate.fromMessages([
            [
              "system",
              `You are an expert at extracting job descriptions from web pages using Playwright browser automation tools.
              
              You have access to Playwright MCP tools to:
              1. Navigate to web pages
              2. Read page content
              3. Extract text from elements
              4. Take screenshots for verification
              
              Your task is to navigate to the job posting URL and extract:
              1. Job title
              2. Job requirements/qualifications
              3. Job responsibilities
              4. Company information
              5. Skills needed
              6. Experience required
              7. Any other relevant job details
              
              Use the Playwright tools to:
              1. First navigate to the URL
              2. Take a screenshot to see the page
              3. Extract all relevant text content
              4. Identify and extract the job description sections
              5. Format the extracted information clearly
              
              Return the complete job description in a structured format.`,
            ],
            [
              "human",
              "Please navigate to this job posting URL and extract the complete job description: {url}\n\nUse the Playwright MCP tools to access the webpage and read all job-related content.",
            ],
          ]);

          const chain = extractJDPrompt.pipe(modelWithTools);
          const initialResult = await chain.invoke({
            url: state.applicationUrl,
          });

          // Handle tool calls for URL extraction using the helper function
          const result = await handleToolCalls(
            initialResult,
            modelWithTools,
            state.mcpTools || [],
            "JD extraction"
          );

          jobDescription =
            typeof result.content === "string"
              ? result.content
              : JSON.stringify(result.content);
          jobDescriptionSource = "extracted_from_url";
          console.log("✅ Job description extracted from URL");
        } catch (error) {
          console.log(
            "⚠️ Could not extract JD from URL, will use URL for context"
          );
          jobDescription = `Job Application URL: ${state.applicationUrl}\n\nNote: Please manually provide job description for better results.`;
          jobDescriptionSource = "url_only";
        }
      }

      // Fallback if no JD found
      if (!jobDescription) {
        jobDescription =
          "No job description provided. Will use general application approach.";
        jobDescriptionSource = "none";
        console.log("⚠️ No job description available");
      }

      return {
        messages: [
          new AIMessage(
            `Job description obtained from: ${jobDescriptionSource}`
          ),
        ],
        currentStep: "jd_obtained",
        jobDescription,
        jobDescriptionSource,
      };
    };

    // 4. Analyze Job Requirements Node - Analyzes JD and matches with resume
    const analyzeJobRequirementsNode = async (
      state: JobApplicationStateType
    ) => {
      console.log("🔍 Analyzing job requirements against resume...");

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert career advisor and resume matcher. Analyze the job description and candidate's resume to provide:
          
          1. **Job Requirements Analysis:**
             - Key skills required
             - Experience level needed
             - Education requirements
             - Preferred qualifications
          
          2. **Resume Match Assessment:**
             - Matching skills and experience
             - Gaps or missing requirements
             - Strengths to highlight
             - Areas that need emphasis
          
          3. **Application Strategy:**
             - How to position the candidate
             - Key points to emphasize in cover letter
             - Skills to highlight prominently
             - Experience to showcase
          
          Candidate Resume:
          Name: {name}
          Experience: {experience}
          Education: {education}
          Skills: {skills}
          Objective: {objective}`,
        ],
        [
          "human",
          "Job Description:\n{jobDescription}\n\nJob Description Source: {source}\n\nPlease analyze this job against the candidate's background and provide strategic insights for the application.",
        ],
      ]);

      const resume = state.resumeData;
      const chain = prompt.pipe(model);
      const result = await chain.invoke({
        jobDescription: state.jobDescription,
        source: state.jobDescriptionSource,
        name: resume.personalInfo.name,
        experience: JSON.stringify(resume.experience),
        education: JSON.stringify(resume.education),
        skills: JSON.stringify(resume.skills),
        objective: resume.careerObjective,
      });

      const jobAnalysis =
        typeof result.content === "string"
          ? result.content
          : JSON.stringify(result.content);

      console.log("✅ Job requirements analysis completed");

      return {
        messages: [new AIMessage(`Job Analysis: ${jobAnalysis}`)],
        currentStep: "job_analyzed",
        jobAnalysis,
      };
    };

    // 5. Analyze and Fill Form Node - Combined node that analyzes and fills forms, handling multi-page forms
    const analyzeAndFillFormNode = async (state: JobApplicationStateType) => {
      console.log("🔍🤖 Analyzing and filling job application form...");

      const resume = state.resumeData;

      // Create comprehensive instructions for analyzing and filling the form
      const analyzeAndFillPrompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert at analyzing and filling job application forms using Playwright browser automation tools.
          
          You have access to Playwright MCP tools to:
          1. Navigate to web pages
          2. Read page content and analyze form structure
          3. Find and interact with form elements
          4. Fill text inputs, dropdowns, checkboxes
          5. Upload files
          6. Click buttons and links (including Next/Continue buttons)
          7. Take screenshots for verification
          
          CRITICAL FILE UPLOAD HANDLING:
          - Look for file upload fields (input[type="file"], "Add File" buttons, drag-drop areas)
          - Primary option: Use the resume file path: {resumeFilePath}
          - Alternative option: Resume URL available at: {resumeUrl}
          - Backup file reference: {resumePdf}
          - Handle different upload patterns:
          
          Job Context:
          - Job Analysis: {jobAnalysis}
          
          Resume Information to fill:
          - Name: {name}
          - Email: {email}
          - Phone: {phone}
          - LinkedIn: {linkedin}
          - GitHub: {github}
          - Career Objective: {objective}
          - Education: {education}
          - Experience: {experience}
          - Skills: {skills}
          - Resume File Path: {resumeFilePath}
          - Resume URL: {resumeUrl}
          - Resume PDF: {resumePdf}
          
          Additional Application Fields:
          - Current Location: {currentLocation}
          - Preferred Locations: {preferredLocations}
          - Willing to Relocate: {willingToRelocate}
          - Work Preference: {workPreference}
          - Salary Expectations: {salaryExpectations}
          - Work Authorization: {workAuthorization}
          - Availability: {availability}
          - Languages: {languages}
          - Emergency Contact: {emergencyContact}
          - Cover Letter Templates: {coverLetterTemplates}
          - Common Q&A Responses: {commonQuestions}
          
          STRATEGY FOR MULTI-PAGE FORMS:
          1. Navigate to the application URL
          2. Take a screenshot to see the current page
          3. Analyze the visible form fields on this page
          4. Fill all fields on the current page strategically based on job requirements
          5. Look for navigation buttons (Next, Continue, etc.)
          6. If found, click to go to next page and repeat from step 2
          7. Continue until all pages are filled (but don't submit)
          8. Take final screenshot showing the completed form
          9. IMPORTANT: Keep the browser open - do not close browser windows
          10. End execution while leaving browser session active for user review
          
          FORM FIELD MAPPING STRATEGY:
          - Personal Info: Use name, email, phone from resume
          - Location Fields: Use current location and preferred locations
          - Salary Fields: Use salary expectations (min/max/preferred)
          - Work Authorization: Use visa status and work authorization info
          - Availability: Use start date, notice period, work preferences
          - Experience: Highlight relevant experience based on job analysis
          - Education: Include relevant education details
          - Skills: Emphasize skills that match job requirements
          - Languages: Include language proficiencies
          - Cover Letter/Summary: Use career objective, templates, and common Q&A responses
          - Emergency Contact: Use provided emergency contact details
          - File Upload: ACTUALLY upload the resume file when file input is found
          - Demographic Info: Use background information when required (optional fields)
          
          CRITICAL FILE UPLOAD HANDLING:
          - Look for file upload fields (input[type="file"], "Add File" buttons, drag-drop areas)
          - Use the resume file path: {resumeFilePath}
          - Alternative: Resume URL available at: {resumeUrl}
          - Handle different upload patterns:
            * Google Forms: Click "Add File" button, then select the resume file
            * Direct file input: Use setInputFiles() with the file path
            * Drag and drop areas: Use file input or drag-drop simulation
          - Common selectors to look for:
            * button containing "Add File", "Choose File", "Upload"
            * input[type="file"]
            * [role="button"] with file upload text
          - After upload, verify success by:
            * Checking for file name display
            * Looking for upload success indicators
            * Ensuring no error messages appear
          - Take screenshot after successful upload to confirm
          
          EXAMPLE FILE UPLOAD PROCESS:
          1. Find the file upload area (like "CV/Resume" section)
          2. Click the "Add File" button if present
          3. Use setInputFiles() or file dialog to select resume.pdf
          4. Wait for upload completion
          5. Verify file appears in the form
          6. Take screenshot to confirm
          
          Remember: Navigate through ALL pages but DO NOT SUBMIT!
          
          CRITICAL BROWSER PERSISTENCE RULES:
          - NEVER call browser.close() or page.close()
          - NEVER use any commands that close browser windows
          - DO NOT navigate away from the completed form
          - Keep all browser tabs and windows open
          - After completing the form filling, KEEP THE BROWSER OPEN
          - Do NOT close any browser windows or tabs
          - Take a final screenshot showing the completed form
          - End with a message that the browser is ready for manual review
          - The browser session must remain active for user review`,
        ],
        [
          "human",
          `Please analyze and fill the job application form at: {url}
          
          Use the Playwright tools to:
          1. Navigate to the form
          2. Analyze the structure of each page
          3. Fill all form fields strategically based on the job requirements
          4. Handle file uploads (CV/Resume upload is critical - use the provided resume file path)
          5. Handle multi-page navigation (Next buttons, etc.)
          6. Take screenshots at each step
          
          IMPORTANT: Pay special attention to CV/Resume upload fields and ensure the resume file is actually uploaded.
          
          CRITICAL: After completing the form filling, KEEP THE BROWSER OPEN for manual review and submission.
          
          Job Description Source: {jobSource}
          
          Remember: Fill ALL pages INCLUDING file uploads but DO NOT SUBMIT - leave as draft and KEEP BROWSER OPEN!`,
        ],
      ]);

      try {
        // Get the absolute path to the resume file
        const resumeFilePath = path.resolve(
          __dirname,
          detailedResume.personalInfo.resumePdf
        );
        const resumeUrl = detailedResume.personalInfo.resumeUrl;
        const resumePdf = detailedResume.personalInfo.resumePdf;

        // Use the model with tools to get the initial response
        const chain = analyzeAndFillPrompt.pipe(modelWithTools);
        const initialResult = await chain.invoke({
          url: state.applicationUrl,
          jobAnalysis: state.jobAnalysis || "No job analysis available",
          jobSource: state.jobDescriptionSource || "none",
          resumeFilePath: resumeFilePath,
          resumeUrl: resumeUrl,
          resumePdf: resumePdf,
          name: resume.personalInfo.name,
          email: resume.personalInfo.email,
          phone: resume.personalInfo.phone,
          linkedin: resume.personalInfo.linkedin,
          github: resume.personalInfo.github,
          objective: resume.careerObjective,
          education: JSON.stringify(resume.education),
          experience: JSON.stringify(resume.experience),
          skills: JSON.stringify(resume.skills),
          // Additional application fields
          currentLocation: JSON.stringify(
            resume.applicationFields?.currentLocation
          ),
          preferredLocations: JSON.stringify(
            resume.applicationFields?.preferredLocations
          ),
          willingToRelocate: resume.applicationFields?.willingToRelocate,
          workPreference: resume.applicationFields?.workPreference,
          salaryExpectations: JSON.stringify(
            resume.applicationFields?.salaryExpectations
          ),
          workAuthorization: JSON.stringify(
            resume.applicationFields?.workAuthorization
          ),
          availability: JSON.stringify(resume.applicationFields?.availability),
          languages: JSON.stringify(
            resume.applicationFields?.additionalInfo?.languages
          ),
          emergencyContact: JSON.stringify(
            resume.applicationFields?.emergencyContact
          ),
          coverLetterTemplates: JSON.stringify(
            resume.applicationFields?.coverLetterTemplates
          ),
          commonQuestions: JSON.stringify(
            resume.applicationFields?.commonQuestions
          ),
        });

        // Handle tool calls using the helper function
        const currentMessage = await handleToolCalls(
          initialResult,
          modelWithTools,
          state.mcpTools || [],
          "form analysis and filling"
        );

        const fillResults =
          typeof currentMessage.content === "string"
            ? currentMessage.content
            : JSON.stringify(currentMessage.content);

        console.log(
          "🎉 Form analysis and filling process completed with MCP tools"
        );

        return {
          messages: [new AIMessage(fillResults)],
          currentStep: "form_filled",
          fillResults,
          status: "draft_complete",
        };
      } catch (error) {
        console.error("❌ Error during MCP form analysis and filling:", error);

        // Fallback to simulation if MCP fails
        const fallbackResults = `
          ⚠️ MCP tools encountered an issue. Fallback simulation used.
          
          Would have analyzed and filled:
          - Name: ${resume.personalInfo.name}
          - Email: ${resume.personalInfo.email}
          - Phone: ${resume.personalInfo.phone}
          - LinkedIn: ${resume.personalInfo.linkedin}
          - GitHub: ${resume.personalInfo.github}
          - Multi-page navigation handling
          
          Error: ${error instanceof Error ? error.message : String(error)}
          
          Please try manual form filling or check MCP configuration.
        `;

        return {
          messages: [new AIMessage(fallbackResults)],
          currentStep: "form_filled",
          fillResults: fallbackResults,
          status: "draft_complete_with_errors",
        };
      }
    };

    // 5. Build the StateGraph
    console.log("🏗️ Building Job Application workflow...");

    const workflow = new StateGraph(JobApplicationState)
      .addNode("setup_mcp", setupMCPToolsNode)
      .addNode("load_resume", loadResumeNode)
      .addNode("get_url", getApplicationUrlNode)
      .addNode("get_jd", getJobDescriptionNode)
      .addNode("analyze_job", analyzeJobRequirementsNode)
      .addNode("analyze_and_fill_form", analyzeAndFillFormNode)
      .addEdge(START, "setup_mcp")
      .addEdge("setup_mcp", "load_resume")
      .addEdge("load_resume", "get_url")
      .addEdge("get_url", "get_jd")
      .addEdge("get_jd", "analyze_job")
      .addEdge("analyze_job", "analyze_and_fill_form")
      .addEdge("analyze_and_fill_form", END);

    const app = workflow.compile();
    console.log("✅ Job Application workflow compiled successfully");

    return { app, mcpClient };
  } catch (error) {
    console.error("❌ Error in Job Application workflow:", error);
    // await mcpClient.close();
    throw error;
  }
}

// Function to run the job application automation
async function runJobApplication(
  applicationUrl: string,
  jobDescription?: string
) {
  console.log("🎯 Starting Job Application Automation");
  console.log(`📋 Application URL: ${applicationUrl}`);

  if (jobDescription) {
    console.log("📝 Job Description: Provided by user");
  } else {
    console.log("🌐 Job Description: Will be extracted from URL");
  }

  try {
    const { app, mcpClient } = await jobApplicationWorkflow();

    // Prepare messages based on whether JD is provided
    const messages = [new HumanMessage(applicationUrl)];

    if (jobDescription) {
      // Add job description with clear marker
      messages.push(new HumanMessage(`Job Description: ${jobDescription}`));
    }

    const result = await app.invoke({
      messages,
      currentStep: "start",
    });

    // CRITICAL: Never close MCP client to keep browser session alive
    // mcpClient.close() is NEVER called to maintain browser persistence
    console.log(
      "✅ MCP workflow completed - browser session maintained for manual review"
    );
    console.log(
      "🔴 IMPORTANT: MCP client kept alive to prevent browser closure"
    );

    console.log("\n📊 Application Process Summary:");
    console.log("=====================================");
    console.log(
      `📄 Resume: ${result.resumeData?.personalInfo?.name || "Loaded"}`
    );
    console.log(`🔗 URL: ${result.applicationUrl}`);
    console.log(
      `� Job Description Source: ${result.jobDescriptionSource || "none"}`
    );
    console.log(`�📝 Status: ${result.status}`);

    if (result.jobAnalysis) {
      console.log("\n🎯 Job Analysis:");
      console.log(result.jobAnalysis?.substring(0, 300) + "...");
    }

    console.log("\n✅ Fill Results:");
    console.log(result.fillResults);

    console.log("\n⚠️  IMPORTANT REMINDERS:");
    console.log("1. This tool filled the form as a DRAFT only");
    console.log("2. Browser is kept OPEN for your review");
    console.log("3. Please review all filled information in the browser");
    console.log("4. Upload resume.pdf manually if needed");
    console.log("5. Submit the application manually after review");
    console.log("6. Close the browser manually when done");
    console.log(
      "\n🌐 Browser Session: ACTIVE - Check your browser for the filled form"
    );

    // Keep the process alive to maintain browser session
    console.log("\n🔄 Keeping process alive to maintain browser session...");
    console.log(
      "💡 Press Ctrl+C to exit and close browser when done reviewing"
    );

    // Set up a keep-alive mechanism
    const keepAlive = setInterval(() => {
      // This interval keeps the Node.js process alive
      // which prevents the MCP server from shutting down
    }, 30000); // Check every 30 seconds

    // Clean up on process termination
    // process.on("SIGINT", () => {
    //   console.log("\n\n🛑 Shutting down...");
    //   clearInterval(keepAlive);
    //   if (mcpClient) {
    //     mcpClient.close().then(() => {
    //       console.log("✅ MCP client closed");
    //       process.exit(0);
    //     });
    //   } else {
    //     process.exit(0);
    //   }
    // });

    // Return result but don't exit the function
    return result;
  } catch (error) {
    console.error("❌ Job application automation failed:", error);
    throw error;
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  // Example usage
  const exampleUrl =
    "https://apply.workable.com/groundtruth/j/FFCB55146B/apply";

  // Example with job description
  const exampleJD = `
    Company - Humans Of Football
Role - Product Management Intern
Batch - 2024/2025/2026
Stipend - 20,000 - 30,000/month
Location - Gurgaon
About the Role:
• Help drive a brand-new product - Team vs Team games across
India.
  `;

  // Run with job description (recommended)
  runJobApplication(exampleUrl, exampleJD)
    .then(() => {
      console.log("\n🎉 Job Application automation completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error(
        "\n💥 Job Application automation failed:",
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    });
}

export { jobApplicationWorkflow, runJobApplication };
