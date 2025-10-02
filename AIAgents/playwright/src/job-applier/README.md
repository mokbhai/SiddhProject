# Job Application Automation with Job Description Analysis

This tool automates the process of filling job application forms using AI and Playwright MCP (Model Context Protocol) with intelligent job description analysis for better targeting.

## 🚀 Features

- 🤖 **AI-Powered Form Analysis**: Uses OpenAI/Gemini to analyze job application forms
- 📄 **Resume Integration**: Automatically loads your resume data from `DetailedResume.ts`
- 📋 **Dual Job Description Support**: 
  - **URL Extraction**: Automatically extracts JD from the application URL
  - **User Provided**: Accepts job description text directly
- 🧠 **Job-Resume Matching**: Analyzes job requirements against your background
- 🎯 **Context-Aware Form Filling**: Tailors application based on job analysis
- 🔒 **Draft-Only Mode**: Fills forms as drafts without submitting (safety feature)
- 🚀 **Playwright MCP**: Uses Model Context Protocol for browser automation

## 📋 Enhanced Workflow

1. **📄 Load Resume** - Gets resume from `DetailedResume.ts`
2. **🔗 Get Application URL** - Accepts job application link  
3. **📋 Get Job Description** - Two methods:
   - **🌐 URL Extraction**: AI extracts JD from the application page
   - **📝 User Input**: Provide job description text directly
4. **🧠 Analyze Job Requirements** - Matches job requirements with your resume
5. **🔍 Strategic Form Analysis** - Creates targeted form-filling strategy
6. **🤖 Context-Aware Form Filling** - Fills form with job-specific emphasis

## 🛠️ Prerequisites

1. **Environment Variables**: Set up your `.env` file:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   # OR
   GEMINI_API_KEY=your_gemini_api_key_here
   
   MCP_SERVER_URL=http://localhost:3000  # Optional
   ```

2. **Resume File**: Ensure `./resume.pdf` exists in the project root for upload

3. **Playwright MCP**: The tool uses Playwright MCP configuration from `config.ts`

## 📖 Usage

### Method 1: With Job Description (Recommended)

```typescript
import { runJobApplication } from './applier';

const jobDescription = `
  Job Title: Software Engineer
  
  Requirements:
  - 3+ years of JavaScript/TypeScript experience
  - React.js and Node.js proficiency
  - Experience with databases and APIs
  - Strong problem-solving skills
  
  Responsibilities:
  - Develop scalable web applications
  - Collaborate with cross-functional teams
  - Code reviews and testing
`;

const result = await runJobApplication(
  'https://careers.company.com/apply/software-engineer', 
  jobDescription
);
```

### Method 2: URL-Only (Auto-extraction)

```typescript
import { runJobApplication } from './applier';

// Will attempt to extract job description from the URL
const result = await runJobApplication(
  'https://careers.company.com/apply/software-engineer'
);
```

### Command Line Usage

```bash
# With job description
npx ts-node src/job-applier/test-applier.ts "https://jobs.example.com/apply/123" "Job Title: Software Engineer..."

# Without job description (auto-extraction)
npx ts-node src/job-applier/test-applier.ts "https://jobs.example.com/apply/123"

# Multiple test mode
npx ts-node src/job-applier/test-applier.ts "https://jobs.example.com/apply/123" "" "multiple"
```

## 🔄 Enhanced Process Flow

### 1. **Resume Loading** 📄
- Loads your structured resume from `DetailedResume.ts`
- Validates all required sections

### 2. **URL Processing** 🔗
- Accepts and validates job application URL
- Prepares for job description extraction

### 3. **Job Description Acquisition** 📋
- **User-Provided**: Uses job description text you provide
- **URL Extraction**: AI attempts to extract JD from the application page
- **Fallback**: Uses URL context if extraction fails

### 4. **Job Requirements Analysis** 🧠
- Analyzes job requirements vs. your background
- Identifies matching skills and experience
- Highlights gaps and strengths
- Creates strategic application approach

### 5. **Form Strategy Development** 🔍
- Uses job analysis to create targeted form-filling plan
- Emphasizes relevant skills based on job requirements
- Prepares customized cover letter content
- Maps strategic resume data to form fields

### 6. **Context-Aware Form Filling** 🤖
- Fills forms with job-specific emphasis
- Highlights relevant experience first
- Uses strategic skill ordering
- Uploads resume and supports file inputs

## 📊 Job Analysis Output

The enhanced workflow provides detailed analysis:

```
🎯 Job Analysis:
=====================================
📋 Job Requirements:
- Programming: JavaScript, React, Node.js
- Experience: 3+ years web development
- Skills: API development, database design

📄 Resume Match Assessment:
✅ Strong match: JavaScript (5+ years), React expertise
✅ Good match: Node.js experience, API development
⚠️  Gap: Specific database mentioned in JD
💪 Strength: AI/automation experience (bonus)

📝 Application Strategy:
- Emphasize JavaScript and React expertise
- Highlight relevant projects (AutoTube, AIRIA work)
- Mention database experience from LPU project
- Position AI skills as valuable addition
```

## 🎯 Smart Field Mapping

Enhanced mapping based on job analysis:

| Resume Field | Form Mapping Strategy |
|-------------|----------------------|
| Name | `input[name*="name"]` |
| Email | `input[name*="email"]` |
| Skills | **Job-relevant skills first** |
| Experience | **Emphasize matching experience** |
| Cover Letter | **Tailored to job requirements** |
| Projects | **Highlight relevant projects** |

## 🧪 Testing Examples

### Test with Software Engineer Position

```bash
npx ts-node src/job-applier/test-applier.ts \
  "https://careers.openai.com/apply/software-engineer" \
  "Software Engineer position requiring JavaScript, React, and AI experience..."
```

### Test with Auto-Extraction

```bash
npx ts-node src/job-applier/test-applier.ts \
  "https://jobs.microsoft.com/apply/frontend-developer"
```

## 🔧 Troubleshooting

### Common Issues

1. **Job Description Extraction Failed**
   ```
   Warning: Could not extract JD from URL
   ```
   **Solution**: Provide job description manually as second parameter

2. **Poor Job Match Analysis**
   ```
   Job Analysis shows many gaps
   ```
   **Solutions**: 
   - Verify job description is complete
   - Ensure resume data is up-to-date
   - Provide more detailed job requirements

3. **Form Filling Not Targeted**
   ```
   Generic form filling without job context
   ```
   **Solution**: Ensure job description is provided and analysis completed

### Debug Mode

Enable detailed logging:
```bash
DEBUG=true npx ts-node src/job-applier/test-applier.ts "url" "jd"
```

## 🎨 Customization

### Adding Custom Job Description Sources

```typescript
// Custom job description extraction
const customJD = await extractFromLinkedIn(linkedinUrl);
await runJobApplication(applicationUrl, customJD);
```

### Modifying Analysis Strategy

Update the job analysis prompt in `analyzeJobRequirementsNode` to:
- Focus on specific industries
- Emphasize certain skill types
- Adjust matching criteria

## 📈 Best Practices

1. **Always Provide Job Description**: Better targeting and higher success rate
2. **Review Job Analysis**: Check the matching assessment before proceeding
3. **Customize Cover Letters**: Use analysis insights for manual customization
4. **Test with Different Job Types**: Verify the tool works for your target roles
5. **Keep Resume Updated**: Ensure `DetailedResume.ts` reflects current experience

## ⚠️ Safety Features

- ✅ **Draft-Only Mode**: Never submits applications automatically
- ✅ **Manual Review Required**: All information must be reviewed
- ✅ **Job Analysis Insights**: Helps you understand fit before applying
- ✅ **Strategic Guidance**: Provides application strategy recommendations

## 🚀 Examples

### Example 1: AI/ML Engineer Position
```typescript
const aiJobDescription = `
  AI/ML Engineer - We need someone with Python, TensorFlow, and LangGraph experience
  to build intelligent automation systems...
`;

await runJobApplication('https://openai.com/careers/ai-engineer', aiJobDescription);
```

### Example 2: Frontend Developer Role
```typescript
const frontendJD = `
  Frontend Developer - React, TypeScript, Next.js expertise required...
`;

await runJobApplication('https://vercel.com/careers/frontend', frontendJD);
```

## 📞 Support

For issues or questions:
1. Check job description format and completeness
2. Verify environment variables (OPENAI_API_KEY or GEMINI_API_KEY)
3. Ensure resume data is complete in `DetailedResume.ts`
4. Review job analysis output for insights
5. Test with simpler job descriptions first

---

**Enhanced Features**: This tool now provides intelligent job-resume matching and strategic application guidance, significantly improving your application quality and targeting.