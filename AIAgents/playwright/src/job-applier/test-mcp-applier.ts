import { runJobApplication } from './applier';

/**
 * Test script for Job Application Automation with Playwright MCP Integration
 * 
 * This test now uses actual Playwright MCP tools for browser automation
 * 
 * Usage examples:
 * 1. npx ts-node src/job-applier/test-mcp-applier.ts "https://careers.company.com/apply/software-engineer"
 * 2. npx ts-node src/job-applier/test-mcp-applier.ts "https://jobs.example.com/frontend-developer" "job description text..."
 */

async function testMCPJobApplication(): Promise<any> {
  // Example job application URLs (replace with real URLs when testing)
  const testUrls = [
    'https://careers.openai.com/apply/software-engineer',
    'https://jobs.microsoft.com/apply/frontend-developer',
    'https://careers.google.com/apply/full-stack-developer'
  ];

  // Example job description for testing
  const sampleJobDescription = `
    Job Title: Software Engineer
    
    We are seeking a talented Software Engineer to join our dynamic development team.
    
    Requirements:
    - Bachelor's degree in Computer Science, Engineering, or related field
    - 2+ years of experience in software development
    - Proficiency in JavaScript, Python, Node.js
    - Experience with modern web frameworks (React, Next.js, Vue.js)
    - Knowledge of databases (MongoDB, PostgreSQL)
    - Familiarity with cloud platforms (AWS, Azure)
    - Understanding of DevOps practices and CI/CD
    
    Responsibilities:
    - Develop and maintain scalable web applications
    - Collaborate with cross-functional teams including designers and product managers
    - Write clean, efficient, and well-documented code
    - Participate in code reviews and maintain coding standards
    - Troubleshoot and debug applications
    - Stay updated with emerging technologies
    
    Preferred Skills:
    - Experience with AI/ML integration
    - Knowledge of microservices architecture
    - Experience with automated testing
    - Open source contributions
  `;

  // Get parameters from command line arguments
  const applicationUrl = process.argv[2] || testUrls[0];
  const jobDescription = process.argv[3] || sampleJobDescription;

  console.log('🧪 Testing Job Application Automation with Playwright MCP');
  console.log('=======================================================');
  console.log(`📋 Target URL: ${applicationUrl}`);
  console.log('📄 Resume: Mokshit Jain');
  console.log('🤖 Playwright MCP: ENABLED (Real browser automation)');
  console.log('📝 Job Description: Provided');
  console.log('\n⚠️  IMPORTANT: This will use actual browser automation');
  console.log('⚠️  Forms will be filled as DRAFT only - NO SUBMISSION');
  console.log('⚠️  Please ensure you have proper permissions for target site\n');

  try {
    console.log('🚀 Starting MCP-powered job application process...\n');
    
    const result = await runJobApplication(applicationUrl, jobDescription);
    
    console.log('\n🎉 MCP Test completed successfully!');
    console.log('\n📋 MCP Process Summary:');
    console.log(`✅ Resume loaded: ${result.resumeData?.personalInfo?.name}`);
    console.log(`✅ URL processed: ${result.applicationUrl}`);
    console.log(`✅ Job description source: ${result.jobDescriptionSource}`);
    console.log(`✅ Job analysis completed: ${result.jobAnalysis ? 'Yes' : 'No'}`);
    console.log(`✅ Form analysis completed: ${result.formAnalysis ? 'Yes' : 'No'}`);
    console.log(`✅ MCP tools used: ${result.mcpTools?.length || 0} tools available`);
    console.log(`✅ Form filling status: ${result.status}`);
    
    console.log('\n🎯 MCP Integration Benefits:');
    console.log('• Real browser automation with Playwright');
    console.log('• Actual form interaction and filling');
    console.log('• Screenshot capabilities for verification');
    console.log('• File upload support for resume.pdf');
    console.log('• Intelligent element detection and interaction');
    
    console.log('\n📝 Next Steps:');
    console.log('1. Review the filled form carefully');
    console.log('2. Check screenshots if generated');
    console.log('3. Verify all information is correct');
    console.log('4. Make any necessary manual adjustments');
    console.log('5. Submit the application manually');
    
    return result;
  } catch (error) {
    console.error('\n❌ MCP Test failed:', error);
    console.log('\n🔧 MCP Troubleshooting Guide:');
    console.log('1. Check if OPENAI_API_KEY or GEMINI_API_KEY is set');
    console.log('2. Verify Playwright MCP is properly installed:');
    console.log('   npm install @playwright/mcp @langchain/mcp-adapters');
    console.log('3. Ensure the target URL is accessible');
    console.log('4. Check if browser automation is allowed on target site');
    console.log('5. Verify resume data is complete in DetailedResume.ts');
    console.log('6. Try with a simpler test form first');
    throw error;
  }
}

// Additional test functions for different scenarios

async function testMCPWithoutJobDescription(url: string): Promise<any> {
  console.log('🧪 Testing MCP WITHOUT job description (URL extraction mode)');
  return await runJobApplication(url);
}

async function testMCPMultipleApplications(): Promise<void> {
  const testUrls = [
    'https://careers.openai.com/apply/software-engineer',
    'https://jobs.microsoft.com/apply/frontend-developer'
  ];
  
  console.log('🔄 Running multiple MCP application tests...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n📋 Test ${i + 1}/${testUrls.length}: ${url}`);
    
    try {
      await testMCPJobApplication();
      console.log(`✅ Test ${i + 1} completed successfully`);
    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error);
    }
    
    if (i < testUrls.length - 1) {
      console.log('\n⏳ Waiting 5 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function demonstrateMCPCapabilities(): Promise<void> {
  console.log('🎯 MCP Integration Capabilities Demonstration');
  console.log('===========================================');
  
  console.log('\n🤖 Playwright MCP Tools Available:');
  console.log('• browser_create - Create new browser instance');
  console.log('• page_navigate - Navigate to URLs'); 
  console.log('• page_screenshot - Take page screenshots');
  console.log('• element_click - Click elements');
  console.log('• element_fill - Fill form inputs');
  console.log('• element_select - Select dropdown options');
  console.log('• file_upload - Upload files');
  console.log('• page_evaluate - Execute JavaScript');
  console.log('• wait_for_element - Wait for elements to appear');
  console.log('• extract_text - Extract text content');
  
  console.log('\n🎯 Job Application Workflow with MCP:');
  console.log('1. 🔧 Initialize MCP client and tools');
  console.log('2. 📄 Load resume data');
  console.log('3. 🌐 Navigate to application URL');
  console.log('4. 📸 Take initial screenshot');
  console.log('5. 🔍 Analyze form structure');
  console.log('6. 📝 Fill personal information');
  console.log('7. 💼 Fill experience and education');
  console.log('8. 🎯 Fill job-specific content');
  console.log('9. 📎 Upload resume file if needed');
  console.log('10. 📸 Take final screenshot');
  console.log('11. ⚠️ Skip submission (draft only)');
  console.log('12. 🧹 Clean up browser and MCP client');
}

// Run if this file is executed directly
if (require.main === module) {
  // Check command line arguments for different test modes
  const testMode = process.argv[4]; // Optional test mode parameter
  
  if (testMode === 'demo') {
    demonstrateMCPCapabilities()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (testMode === 'multiple') {
    testMCPMultipleApplications()
      .then(() => {
        console.log('\n🎉 All MCP tests completed!');
        process.exit(0);
      })
      .catch(() => process.exit(1));
  } else if (testMode === 'no-jd') {
    const url = process.argv[2] || 'https://careers.openai.com/apply/software-engineer';
    testMCPWithoutJobDescription(url)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    testMCPJobApplication()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { 
  testMCPJobApplication, 
  testMCPWithoutJobDescription, 
  testMCPMultipleApplications,
  demonstrateMCPCapabilities 
};