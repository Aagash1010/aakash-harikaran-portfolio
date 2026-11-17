export type SocialIcon = "github" | "linkedin" | "mail";

export interface SocialLink {
  name: string;
  handle: string;
  href: string | null;
  icon: SocialIcon;
}

export type TechIconKey =
  | "html"
  | "css"
  | "javascript"
  | "react"
  | "bootstrap"
  | "java"
  | "spring"
  | "node"
  | "rest"
  | "python"
  | "mysql"
  | "git"
  | "github"
  | "intellij"
  | "vscode"
  | "ai"
  | "ml"
  | "cp"
  | "uiux";

export type SkillStatus = "used" | "exploring";

export interface Skill {
  name: string;
  icon: TechIconKey;
  note: string;
  status: SkillStatus;
}

export interface SkillCategory {
  id: string;
  label: string;
  index: string;
  blurb: string;
  skills: Skill[];
}

export interface ProjectTech {
  name: string;
  role: string;
}

export type CaseStudyStatus = "documented" | "partial" | "pending";

export interface CaseStudySection {
  status: CaseStudyStatus;
  body: string[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  stack: ProjectTech[];
  features: string[];
  contribution: string;
  implementation: CaseStudySection;
  challenges: CaseStudySection;
  learnings: CaseStudySection;
  screenshots: CaseStudySection;
  repo: string | null;
  demo: string | null;
  visual: "tourism" | "billing" | "weather" | "esp32";
}

export interface TimelineItem {
  period: string;
  role: string;
  org: string;
  type: string;
  summary: string;
  focus: string[];
  current?: boolean;
}

export interface Interest {
  name: string;
  description: string;
  icon: "ai" | "ml" | "fullstack" | "web" | "cp" | "engineering" | "uiux";
  tag: string;
}

/**
 * EDIT ME:
 * - `email` is a placeholder address. Replace it with the real inbox before launch.
 * - `photo` points at the hero portrait in `public/`. Replace `public/portrait.jpg`
 *   (keeping the filename) to update it; the frame presents the photograph as-is.
 *   Setting it to `null` restores the designed placeholder frame.
 * - Social URLs point to the live profiles; email is the real inbox.
 * - `availability.open` drives every status indicator on the site. Set it to
 *   `false` and update the copy if your availability changes.
 */
export const profile = {
  name: "Aagash Harikaran",
  firstName: "Aagash",
  lastName: "Harikaran",
  displayName: "AAGASH HARIKARAN",
  roles: ["Software Developer", "AI Enthusiast", "Creative Technologist"],
  roleLine: "Software Developer | AI Enthusiast | Creative Technologist",
  tagline:
    "Turning ideas into meaningful digital experiences through software engineering and thoughtful design.",
  location: "Sri Lanka",
  timeZone: "Asia/Colombo",
  email: "aagash1004@gmail.com",
  photo: "/portrait.jpg" as string | null,
  photoAlt: "Portrait of Aagash Harikaran",
  cv: "/Aagash-Harikaran-CV.pdf",
  university: "SLIIT",
  universityFull: "Sri Lanka Institute of Information Technology",
  degree: "Bachelor of Science (Honours) in Information Technology",
  degreeShort: "BSc (Hons) Information Technology",
  specialization: "Artificial Intelligence",
  educationLocation: "Malabe, Sri Lanka",
  availability: {
    open: true,
    short: "Open to internships",
    label: "Open to internships & collaborations",
  },
  socials: [
    {
      name: "GitHub",
      handle: "@Aagash1010",
      href: "https://github.com/Aagash1010",
      icon: "github",
    },
    {
      name: "LinkedIn",
      handle: "harikaran-aagash",
      href: "https://www.linkedin.com/in/harikaran-aagash-aa13b9254",
      icon: "linkedin",
    },
    {
      name: "Email",
      handle: "aagash1004@gmail.com",
      href: "mailto:aagash1004@gmail.com",
      icon: "mail",
    },
  ] satisfies SocialLink[],
};

export const hero = {
  eyebrow: "Portfolio / 2026",
  roles: profile.roles,
  headline: "Turning ideas into meaningful digital experiences.",
  supporting:
    "I'm an Information Technology undergraduate specializing in Artificial Intelligence, passionate about software engineering, full-stack development, and building technology-driven solutions.",
  facts: [
    { label: "Education", value: "BSc (Hons) IT" },
    { label: "Specialization", value: "Artificial Intelligence" },
    { label: "University", value: "SLIIT" },
    { label: "Based in", value: "Sri Lanka" },
  ],
} as const;

export const identity = {
  name: "Beyond the Interface",
  signature: "AAGASH HARIKARAN / PORTFOLIO",
  statement: ["Turning ideas into", "meaningful digital experiences."],
  manifesto: ["Not just writing code.", "Building possibilities."],
  exploring: "Currently exploring.",
  contact: ["HAVE A PROJECT", "OR OPPORTUNITY", "IN MIND?"],
  status: profile.availability.short,
  coordinates: "06° 55′ N / 079° 51′ E",
};

export const navItems = [
  { id: "home", label: "Home", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "projects", label: "Work", index: "03" },
  { id: "experience", label: "Journey", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
] as const;

export const aboutParagraphs = [
  "I'm Aagash Harikaran, an Information Technology undergraduate at SLIIT, Sri Lanka, specializing in Artificial Intelligence. My work sits at the intersection of software engineering, full-stack development and intelligent systems.",
  "I build with Java, Spring Boot, JavaScript, React and MySQL — from database-backed applications to responsive interfaces. University coursework and personal projects have given me practical exposure to object-oriented design, REST APIs, relational data modelling and the discipline of shipping something that actually works.",
  "In June–July 2026 I completed a full-stack development internship at Codevda Technologies, where I worked alongside a team to turn requirements into web features. It was a practical education in how frontend, backend and delivery fit together in a professional environment.",
  "I care about clean implementation, clear interfaces and software that is useful to the people who use it. I'm continuing to deepen my knowledge of artificial intelligence and machine learning while strengthening the engineering fundamentals that support good work.",
  "I'm currently open to internship and collaboration opportunities where I can contribute, learn from experienced engineers and build technology-driven solutions.",
];

export const aboutFacts = [
  { label: "Name", value: "Aagash Harikaran" },
  { label: "Education", value: "BSc (Hons) IT" },
  { label: "Specialization", value: "Artificial Intelligence" },
  { label: "University", value: "SLIIT" },
  { label: "Location", value: "Sri Lanka" },
  { label: "Availability", value: profile.availability.short },
];

export const aboutFocus = [
  "Full-stack development",
  "AI / machine learning",
  "Software engineering",
  "Modern web",
];

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    index: "01",
    blurb:
      "The languages I use to reason through problems, from academic work to personal builds.",
    skills: [
      {
        name: "Java",
        icon: "java",
        note: "Core language, object-oriented design and application logic",
        status: "used",
      },
      {
        name: "Python",
        icon: "python",
        note: "Scripting and foundations for artificial intelligence work",
        status: "used",
      },
      {
        name: "JavaScript",
        icon: "javascript",
        note: "ES6+, DOM behaviour and asynchronous web logic",
        status: "used",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    index: "02",
    blurb:
      "Interfaces built with semantic structure, responsive layouts and a bias for clarity.",
    skills: [
      {
        name: "HTML",
        icon: "html",
        note: "Semantic, accessible document structure",
        status: "used",
      },
      {
        name: "CSS",
        icon: "css",
        note: "Responsive layout systems and visual detail",
        status: "used",
      },
      {
        name: "JavaScript",
        icon: "javascript",
        note: "Interactive behaviour and API-driven interfaces",
        status: "used",
      },
      {
        name: "React",
        icon: "react",
        note: "Component-driven interface development",
        status: "used",
      },
      {
        name: "Bootstrap",
        icon: "bootstrap",
        note: "Rapid, responsive interface foundations",
        status: "used",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    index: "03",
    blurb:
      "Server-side foundations for applications that need structure, data and dependable behaviour.",
    skills: [
      {
        name: "Java",
        icon: "java",
        note: "Application logic and object-oriented architecture",
        status: "used",
      },
      {
        name: "Spring Boot",
        icon: "spring",
        note: "REST services and backend application structure",
        status: "used",
      },
      {
        name: "Node.js",
        icon: "node",
        note: "Server-side JavaScript runtime",
        status: "used",
      },
      {
        name: "REST APIs",
        icon: "rest",
        note: "Design, integration and consumption of APIs",
        status: "used",
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    index: "04",
    blurb:
      "Relational thinking: modelling data, writing queries and keeping records consistent.",
    skills: [
      {
        name: "MySQL",
        icon: "mysql",
        note: "Schema design, queries and relational data modelling",
        status: "used",
      },
    ],
  },
  {
    id: "tools",
    label: "Developer Tools",
    index: "05",
    blurb:
      "The everyday environment around the code — version control, editors and collaboration.",
    skills: [
      {
        name: "Git",
        icon: "git",
        note: "Version control and change tracking",
        status: "used",
      },
      {
        name: "GitHub",
        icon: "github",
        note: "Repositories and collaborative workflows",
        status: "used",
      },
      {
        name: "IntelliJ IDEA",
        icon: "intellij",
        note: "Java development environment",
        status: "used",
      },
      {
        name: "VS Code",
        icon: "vscode",
        note: "Primary everyday editor",
        status: "used",
      },
    ],
  },
  {
    id: "interests",
    label: "Areas of Interest",
    index: "06",
    blurb:
      "Not a claim of mastery — these are the directions I'm actively reading, practising and building toward.",
    skills: [
      {
        name: "Artificial Intelligence",
        icon: "ai",
        note: "Foundations, applications and responsible use",
        status: "exploring",
      },
      {
        name: "Machine Learning",
        icon: "ml",
        note: "Models, mathematics and practical experiments",
        status: "exploring",
      },
      {
        name: "UI/UX Design",
        icon: "uiux",
        note: "Interaction, typography and visual craft",
        status: "exploring",
      },
      {
        name: "Competitive Programming",
        icon: "cp",
        note: "Algorithms and structured problem solving",
        status: "exploring",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "tourism-platform",
    index: "01",
    title: "Tourism Package Customization Platform",
    shortTitle: "Tourism Platform",
    category: "Full-stack web application",
    description:
      "A Java-based web application designed to simplify tourism package customization and management — bringing destinations, hotels, guides and bookings into one coherent system.",
    overview:
      "A full-stack application for customizing and managing tourism packages. Destinations, hotels, tour guides and bookings are handled in one system, supported by authentication, full CRUD operations and a MySQL-backed data layer.",
    problem:
      "Customizing a tourism package usually means coordinating destinations, accommodation, guides and bookings across disconnected sources. The project set out to bring that information and management into a single application.",
    solution:
      "A Spring Boot application backed by MySQL, with a browser interface for creating and managing destinations, hotels, guides and bookings through full CRUD flows and authenticated access.",
    stack: [
      { name: "Java", role: "Application language" },
      { name: "Spring Boot", role: "Backend framework" },
      { name: "MySQL", role: "Relational database" },
      { name: "HTML", role: "Page structure" },
      { name: "CSS", role: "Interface styling" },
      { name: "JavaScript", role: "Client-side behaviour" },
    ],
    features: [
      "User and admin authentication",
      "Destination management",
      "Hotel management",
      "Tour guide management",
      "Booking management",
      "Full CRUD operations",
      "Database integration",
      "Object-oriented architecture",
    ],
    contribution:
      "End-to-end development across the Spring Boot backend, MySQL data layer and responsive frontend.",
    implementation: {
      status: "partial",
      body: [
        "The application follows a Spring Boot service structure with MySQL as the relational store.",
        "The browser interface is built with HTML, CSS and JavaScript, covering destination, hotel, tour guide and booking management.",
        "Authentication and CRUD flows sit alongside the core data model.",
        "Deeper architecture notes — package structure, schema and API contracts — have not been documented yet.",
      ],
    },
    challenges: {
      status: "pending",
      body: [
        "A specific challenge log for this build has not been written up yet. This section is intentionally left as a placeholder rather than filled with generic claims.",
        "Add the concrete blockers, trade-offs and fixes from your development notes here.",
      ],
    },
    learnings: {
      status: "pending",
      body: [
        "Learning notes are not documented yet. Add the specific concepts, tools or decisions this build taught you.",
      ],
    },
    screenshots: {
      status: "pending",
      body: [
        "No verified screenshots have been supplied. The abstract panel on this page is a custom illustration, not a screenshot of the application.",
      ],
    },
    repo: null,
    demo: null,
    visual: "tourism",
  },
  {
    id: "luxmy-billing",
    index: "02",
    title: "Luxmy Digital Color Lab — Billing System",
    shortTitle: "Luxmy Billing",
    category: "Business application",
    description:
      "A browser-based billing application built to streamline invoice generation and day-to-day sales management for a digital color lab.",
    overview:
      "A billing application for a digital color lab. It handles invoice generation, category and subcategory management, sales reporting and PDF export, with records stored locally in the browser.",
    problem:
      "A busy color lab needs a quick, consistent way to produce invoices, keep numbering organised and review daily and monthly sales without depending on a server-backed system.",
    solution:
      "A client-side billing tool built with HTML, CSS and JavaScript. Records live in LocalStorage, invoices are generated in the browser and can be exported as PDFs; categories, subcategories and sales views support day-to-day operation.",
    stack: [
      { name: "HTML", role: "Application structure" },
      { name: "CSS", role: "Interface and print styling" },
      { name: "JavaScript", role: "Application logic" },
      { name: "LocalStorage", role: "Client-side persistence" },
      { name: "PDF generation", role: "Invoice export" },
    ],
    features: [
      "Invoice generation",
      "Custom invoice numbering",
      "Category management",
      "Subcategory management",
      "Daily and monthly sales reports",
      "Sales analytics",
      "PDF export",
    ],
    contribution:
      "Designed and developed the billing workflow, reporting views and PDF export features.",
    implementation: {
      status: "partial",
      body: [
        "The interface is built with HTML, CSS and JavaScript, with no server-side dependency.",
        "Records are persisted in the browser using LocalStorage.",
        "Invoice generation, sales reporting and PDF export run client-side.",
        "Deeper implementation notes — data schema, PDF library and report logic — have not been documented yet.",
      ],
    },
    challenges: {
      status: "pending",
      body: [
        "A specific challenge log for this build has not been written up yet. This section is intentionally left as a placeholder rather than filled with generic claims.",
        "Add the concrete blockers, trade-offs and fixes from your development notes here.",
      ],
    },
    learnings: {
      status: "pending",
      body: [
        "Learning notes are not documented yet. Add the specific concepts, tools or decisions this build taught you.",
      ],
    },
    screenshots: {
      status: "pending",
      body: [
        "No verified screenshots have been supplied. The abstract panel on this page is a custom illustration, not a screenshot of the application.",
      ],
    },
    repo: null,
    demo: null,
    visual: "billing",
  },
  {
    id: "weather-app",
    index: "03",
    title: "Weather Application",
    shortTitle: "Weather App",
    category: "Frontend & API integration",
    description:
      "A modern weather application demonstrating frontend development and API integration — turning a live weather feed into a clear, responsive interface.",
    overview:
      "A responsive weather interface that requests live conditions from a REST API and presents them clearly. The build focuses on API integration, location-based lookup and thoughtful loading and error states.",
    problem:
      "Weather information is only useful when it is quick to read and works on the screen in front of you. The application explores how a live feed can become a focused, legible interface.",
    solution:
      "A lightweight HTML, CSS and JavaScript front end that queries a REST weather API, supports location-based lookup and renders current conditions in a responsive layout with explicit loading and error handling.",
    stack: [
      { name: "HTML", role: "Page structure" },
      { name: "CSS", role: "Responsive layout" },
      { name: "JavaScript", role: "Application logic" },
      { name: "REST APIs", role: "Live weather data" },
    ],
    features: [
      "Real-time weather conditions",
      "Location-based lookup",
      "REST API integration",
      "Responsive, focused interface",
    ],
    contribution:
      "Built the interface and API integration end to end, including loading and error states.",
    implementation: {
      status: "partial",
      body: [
        "The interface is built with HTML, CSS and JavaScript.",
        "Weather data is requested from a REST API and rendered into a responsive layout.",
        "Loading and error states are handled in the interface.",
        "The specific API provider and request/response handling have not been documented yet.",
      ],
    },
    challenges: {
      status: "pending",
      body: [
        "A specific challenge log for this build has not been written up yet. This section is intentionally left as a placeholder rather than filled with generic claims.",
        "Add the concrete blockers, trade-offs and fixes from your development notes here.",
      ],
    },
    learnings: {
      status: "pending",
      body: [
        "Learning notes are not documented yet. Add the specific concepts, tools or decisions this build taught you.",
      ],
    },
    screenshots: {
      status: "pending",
      body: [
        "No verified screenshots have been supplied. The abstract panel on this page is a custom illustration, not a screenshot of the application.",
      ],
    },
    repo: null,
    demo: null,
    visual: "weather",
  },
  {
    id: "esp32-healthcare",
    index: "04",
    title: "ESP32 Healthcare Monitoring System",
    shortTitle: "ESP32 Healthcare",
    category: "IoT · University group project",
    description:
      "An IoT-based healthcare monitoring project developed as part of a university group project — combining sensing, location and GSM communication in one prototype.",
    overview:
      "A university group project built around an ESP32 microcontroller. The prototype combines heart-rate sensing, motion data, GPS location and GSM communication to explore continuous health monitoring in a portable system.",
    problem:
      "Continuous health monitoring in a portable prototype requires several components to work together: sensing, processing, location and remote communication. The team explored that combination on an ESP32 platform.",
    solution:
      "An ESP32 prototype combining a heart-rate sensor, MPU6050 motion data, GPS location and SIM800L GSM communication. My contribution covered the heart-rate monitoring module and its sensor integration.",
    stack: [
      { name: "ESP32", role: "Microcontroller" },
      { name: "Heart rate sensor", role: "Vital-sign input" },
      { name: "MPU6050", role: "Motion data" },
      { name: "SIM800L", role: "GSM communication" },
      { name: "GPS", role: "Location tagging" },
    ],
    features: [
      "Continuous heart-rate sensing",
      "Motion data via MPU6050",
      "GSM communication with SIM800L",
      "GPS location tagging",
      "Collaborative hardware prototype",
    ],
    contribution:
      "Heart Rate Monitoring Module — sensor integration, signal reading and the path from raw readings to usable data.",
    implementation: {
      status: "partial",
      body: [
        "The prototype is built around an ESP32 microcontroller.",
        "A heart-rate sensor provides readings, MPU6050 supplies motion data, GPS provides location and SIM800L handles GSM communication.",
        "My contribution focused on the heart-rate monitoring module and sensor integration.",
        "Firmware architecture and circuit details have not been documented yet.",
      ],
    },
    challenges: {
      status: "pending",
      body: [
        "A specific challenge log for this build has not been written up yet. This section is intentionally left as a placeholder rather than filled with generic claims.",
        "Add the concrete blockers, trade-offs and fixes from your development notes here.",
      ],
    },
    learnings: {
      status: "pending",
      body: [
        "Learning notes are not documented yet. Add the specific concepts, tools or decisions this build taught you.",
      ],
    },
    screenshots: {
      status: "pending",
      body: [
        "No verified screenshots have been supplied. The abstract panel on this page is a custom illustration, not a screenshot of the application.",
      ],
    },
    repo: null,
    demo: null,
    visual: "esp32",
  },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export const timeline: TimelineItem[] = [
  {
    period: "JUN — JUL 2026",
    role: "Full Stack Development Intern",
    org: "Codevda Technologies",
    type: "Internship",
    summary:
      "A focused full-stack development internship centred on turning requirements into working web features. Practical exposure to frontend, backend and the workflows that connect them.",
    focus: [
      "Full-stack feature development",
      "Frontend and backend collaboration",
      "Professional engineering workflows",
    ],
  },
  {
    period: "ONGOING",
    role: "BSc (Hons) Information Technology",
    org: "SLIIT — Sri Lanka Institute of Information Technology",
    type: "Education",
    summary:
      "Specializing in Artificial Intelligence while building a broad software engineering foundation through coursework, group projects and continuous self-directed development.",
    focus: [
      "Artificial Intelligence specialization",
      "Software engineering & OOP",
      "Databases and web technologies",
      "Team-based university projects",
    ],
    current: true,
  },
];

export const education = {
  institution: "SLIIT",
  fullName: "Sri Lanka Institute of Information Technology",
  degree: "Bachelor of Science (Honours) in Information Technology",
  specialization: "Artificial Intelligence",
  location: "Malabe, Sri Lanka",
  status: "Undergraduate",
  focus: [
    "Artificial Intelligence",
    "Software Engineering",
    "Object-Oriented Programming",
    "Database Systems",
    "Web Technologies",
    "Data Structures & Algorithms",
  ],
};

export const interests: Interest[] = [
  {
    name: "Artificial Intelligence",
    description:
      "Exploring how intelligent systems are designed, trained and applied to problems that matter.",
    icon: "ai",
    tag: "Research",
  },
  {
    name: "Machine Learning",
    description:
      "Learning the models, mathematics and experiments behind systems that improve with data.",
    icon: "ml",
    tag: "Practice",
  },
  {
    name: "Competitive Programming",
    description:
      "Sharpening algorithmic thinking and problem decomposition, one problem at a time.",
    icon: "cp",
    tag: "Sharpen",
  },
  {
    name: "Full-Stack Development",
    description:
      "Connecting thoughtful interfaces to dependable server-side systems and clean data models.",
    icon: "fullstack",
    tag: "Build",
  },
  {
    name: "Creative Coding",
    description:
      "Using code as a material — generative visuals, motion studies and experiments that exist to ask questions.",
    icon: "engineering",
    tag: "Experiment",
  },
  {
    name: "Modern Web Technologies",
    description:
      "React, TypeScript and the craft of building fast, expressive, accessible interfaces.",
    icon: "web",
    tag: "Craft",
  },
  {
    name: "Creative UI/UX Development",
    description:
      "Motion, typography and interaction treated as part of the product — not decoration.",
    icon: "uiux",
    tag: "Design",
  },
];

export const stats = [
  { value: "04", label: "Featured builds" },
  { value: "06", label: "Skill areas" },
  { value: "AI", label: "Specialization" },
  { value: "LK", label: "Based in Sri Lanka" },
];

export const site = {
  title: "Aagash Harikaran — Software Developer",
  description:
    "Aagash Harikaran is a software developer and AI enthusiast from Sri Lanka, building thoughtful full-stack applications and technology-driven solutions.",
};
