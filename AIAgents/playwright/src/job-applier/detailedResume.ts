export const detailedResume = {
  personalInfo: {
    name: "MOKSHIT JAIN",
    phone: "+91-7000209021",
    email: "mokshitjain18@gmail.com",
    linkedin: "https://linkedin.com/in/mokshit-jain",
    github: "https://github.com/mokbhai",
    bio: "https://mokshit-bio.jainparichay.in",
    resumeUrl: "https://mokshit-bio.jainparichay.in/resume",
    resumePdf: "./resume.pdf"
  },

  // Additional Application Fields
  applicationFields: {
    // Location and Work Preferences
    currentLocation: {
      city: "Bhawani Mandi",
      state: "Rajasthan",
      country: "India",
      pincode: "326502",
    },
    preferredLocations: [
      "Bangalore, Karnataka, India",
      "Hyderabad, Telangana, India",
      "Pune, Maharashtra, India",
      "Gurgaon, Haryana, India",
      "Mumbai, Maharashtra, India",
      "Remote",
    ],
    willingToRelocate: "Yes",
    workPreference: "Any - Remote preferred", // Options: Remote, Onsite, Hybrid

    // Salary and Compensation
    salaryExpectations: {
      currency: "INR",
      minimum: "1000000", // 10 LPA
      maximum: "2000000", // 20 LPA
      preferred: "1500000", // 15 LPA
      negotiable: true,
    },

    // Work Authorization and Legal
    workAuthorization: {
      countryOfCitizenship: "India",
      currentVisaStatus: "Indian Citizen",
      requiresSponsorship: "No",
      authorizedToWorkIn: ["India"],
      willingToWorkInternationally: "Yes",
    },

    // Availability and Timeline
    availability: {
      startDate: "After notice period", // or specific date like "2025-06-01"
      noticePeriod: "45 days", // For default employees
      // noticePeriod: "0 days", // For students/fresher --- IGNORE ---
      // startDate: "Immediate", // or specific date like "2025-06-01" --- IGNORE ---
      availableForFullTime: "Yes",
      availableForPartTime: "Yes",
      availableForInternship: "Yes",
      availableForContract: "Yes",
    },

    // Background Information
    backgroundInfo: {
      veteranStatus: "Not Applicable",
      disabilityStatus: "No",
      genderIdentity: "Male", // Optional, can be "Prefer not to say"
      ethnicity: "Asian/Indian", // Optional
      dateOfBirth: "2004-02-10", // Optional, format: YYYY-MM-DD
      maritalStatus: "Single", // Optional
    },

    // Emergency Contact
    emergencyContact: {
      name: "Kamlesh Kumar Jain",
      relationship: "Father",
      phone: "+91-9829718593",
    },

    // References (Professional)
    references: [
      {
        name: "Available upon request",
        position: "",
        company: "",
        email: "",
        phone: "",
        relationship: "Professional Reference",
      },
    ],

    // Cover Letter Templates
    coverLetterTemplates: {
      generic:
        "I am writing to express my strong interest in the [Position] role at [Company]. As a passionate Computer Science student with hands-on experience in AI/ML, full-stack development, and product management, I am excited about the opportunity to contribute to your team. My experience at AIRIA has equipped me with the skills to work directly with founders and cross-functional teams to deliver AI-powered solutions. I am particularly drawn to [Company] because of [specific reason]. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success.",

      technical:
        "I am excited to apply for the [Position] role at [Company]. With my background in AI agents, LangGraph workflows, and full-stack development using JavaScript, Python, and modern frameworks, I am well-positioned to contribute to your technical team. During my internship at AIRIA, I developed AI-powered solutions and automated testing tools, gaining valuable experience in product development and client collaboration. I am particularly interested in [specific technology/project] and would love to bring my technical skills and passion for innovation to [Company].",

      product:
        "I am writing to express my interest in the [Position] role at [Company]. My experience combines technical development with product management skills, having worked closely with product and leadership teams at AIRIA to ideate, develop, and deliver solutions. I have experience in stakeholder management, user-centric design, and agile methodologies. My technical background allows me to bridge the gap between engineering and product, ensuring successful delivery of features that meet business needs and user expectations.",
    },

    // Additional Skills and Certifications
    additionalInfo: {
      languages: [
        { name: "English", proficiency: "Fluent" },
        { name: "Hindi", proficiency: "Native" },
        { name: "Punjabi", proficiency: "Native" },
      ],
      certifications: [], // Add any relevant certifications
      portfolioUrl: "https://mokshit-bio.jainparichay.in",
      personalWebsite: "https://mokshit-bio.jainparichay.in",
      socialMedia: {
        youtube: "https://www.youtube.com/@mokbhaimj",
        twitter: "", // Add if available
        instagram: "", // Add if available
      },
    },

    // Questions commonly asked in applications
    commonQuestions: {
      whyInterestedInCompany:
        "I am drawn to [Company] because of its innovative approach to [specific area] and commitment to [company values]. The opportunity to work on [specific projects/technologies] aligns perfectly with my career goals and passion for technology.",

      whyInterestedInRole:
        "This role excites me because it combines my technical skills with my interest in [specific area]. I am particularly attracted to the opportunity to [specific responsibility] and contribute to [specific goal/project].",

      careerGoals:
        "My goal is to become a well-rounded technology professional who can bridge the gap between technical implementation and business impact. I aim to work on innovative projects that solve real-world problems and create meaningful user experiences.",

      greatestStrength:
        "My greatest strength is my ability to quickly adapt and learn new technologies while maintaining a user-centric approach. I combine technical skills with strong communication abilities, allowing me to work effectively across different teams and stakeholders.",

      greatestWeakness:
        "I sometimes spend too much time perfecting details, but I've learned to balance thoroughness with meeting deadlines by setting clear priorities and time boundaries.",

      whyHireYou:
        "You should hire me because I bring a unique combination of technical expertise, product thinking, and collaborative skills. My experience working directly with founders and cross-functional teams has taught me to deliver solutions that meet both technical requirements and business objectives.",
    },
  },
  careerObjective:
    "Resourceful Computer Science student and versatile software developer with a passion for technology, product innovation, and emotional wellness. Eager to work directly with founders to ideate, research, and develop solutions that drive impact. Adept at collaborating with cross-functional teams, conducting research, and applying AI, automation, and data-driven approaches to solve real-world problems.",
  education: [
    {
      institution: "Lovely Professional University",
      degree: "B.Tech, Computer Science",
      duration: "2022–2026, currently in 4th year, 7th semester",
      cgpa: "7.8/10",
    },
  ],
  experience: [
    {
      position: "Software Developer Intern",
      company: "AIRIA",
      duration: "Apr 2025 – Present",
      location: "Remote",
      responsibilities: [
        "Worked closely with product and leadership teams to ideate, develop, and deliver AI-powered solutions",
        "Managed client communications, coordinated product demos, and ensured smooth client onboarding and feedback integration",
        "Currently developing an advanced UI testing tool that automates browser interactions and website testing, leveraging AI-agents automation and LangGraph workflows",
        "Led end-to-end development of a fitness application, integrating both AI agents and user-centred design to improve health and workout outcomes",
        "Actively participated in sprint reviews, and cross-functional collaboration, ensuring a clear understanding of business needs and user experience",
      ],
    },
    {
      position: "Freelancer",
      company: "Innovation Studio LPU & Ministry of Defence",
      duration: "Nov 2024 – Jan 2025",
      location: "Remote",
      responsibilities: [
        "Collaborating with stakeholders to define requirements and deliver features ahead of schedule",
        "Architectured microservices for vehicle validation, checkpoint logging, and e2e monitoring with optimised Prisma PostgreSQL queries",
        "Enhanced system security with Permission Management, Role-Based Access Control (RBAC), and secure session management",
      ],
      demoLink: "https://youtu.be/3xswnyAoGAU",
    },
  ],
  projects: [
    {
      name: "AutoTube: AI-Powered Text-to-Video Generator",
      description:
        "Developed pipeline that converts text into YouTube-ready videos, automating content creation process",
      technologies: ["Python", "Google Translate", "Edge TTS"],
      features: ["Integrated multilingual support and natural voiceovers"],
      link: "https://www.youtube.com/@mokbhaimj",
    },
    {
      name: "Thrombocizer: Assistive Exercise Device",
      description:
        "Led technical development for a wellness-focused leg movement device for paralysed patients",
      features: [
        "Developed easy-to-use interfaces and real-time monitoring tools",
        "Keeping user well-being at the centre of product design",
      ],
    },
  ],
  skills: {
    productAndCrossFunctional: [
      "Product Ideation & Management",
      "Data-driven Decision Making",
      "Agile Methodologies",
      "Communication",
      "Critical thinking",
      "Teamwork abilities",
      "Stakeholder Management",
      "User-Centric Design",
    ],
    technical: {
      programming: ["JavaScript", "Python", "Node.js", "SQL"],
      aiAutomation: ["AI Agents", "LangGraph", "WhatsApp Bots", "OpenAI"],
      frameworks: ["Astro.js", "Next.js", "Nest.js"],
      devOps: ["Git", "Docker", "AWS EC2", "CI/CD"],
      databases: ["MongoDB", "PostgreSQL", "ChromaDB", "Pinecone"],
    },
  },
  awards: [
    {
      title: "1st Runner Up",
      event: "MEDHA Medical Device Hackathon 2024",
    },
    {
      title: "Participant",
      event: "Hack IT Sapiens 2.0",
    },
  ],
};
