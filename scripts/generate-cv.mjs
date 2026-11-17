import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

/**
 * Generates the CV downloaded from the portfolio.
 * Everything here is sourced from the information supplied for the portfolio.
 * Update this file (and re-run `npm run cv`) when your experience grows.
 */

const outDir = path.resolve("public");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "Aagash-Harikaran-CV.pdf");

const PAGE_WIDTH = 595.28;
const LEFT = 50;
const RIGHT = 395;
const LEFT_WIDTH = 315;
const RIGHT_WIDTH = 150;

const ink = "#10120d";
const muted = "#5f6658";
const lime = "#b7e63f";
const line = "#d9dbd1";

const doc = new PDFDocument({
  size: "A4",
  margin: 0,
  info: {
    Title: "Aagash Harikaran — Curriculum Vitae",
    Author: "Aagash Harikaran",
    Subject: "Software Developer · AI Enthusiast · Creative Technologist",
    Keywords: "Software Developer, Artificial Intelligence, Full Stack, Sri Lanka",
  },
});

doc.pipe(fs.createWriteStream(outFile));

/* ---------------- Header ---------------- */
doc.rect(0, 0, PAGE_WIDTH, 158).fill("#080a05");
doc.rect(0, 0, 6, 158).fill(lime);

doc
  .fillColor(lime)
  .font("Helvetica-Bold")
  .fontSize(7.3)
  .text("CURRICULUM VITAE  /  AAGASH HARIKARAN", LEFT, 32, {
    characterSpacing: 1.6,
  });

doc
  .fillColor("#f2f4ec")
  .font("Helvetica-Bold")
  .fontSize(30)
  .text("AAGASH HARIKARAN", LEFT, 48, { characterSpacing: -0.7 });

doc
  .fillColor(lime)
  .font("Helvetica")
  .fontSize(8.4)
  .text(
    "SOFTWARE DEVELOPER   ·   AI ENTHUSIAST   ·   CREATIVE TECHNOLOGIST",
    LEFT,
    93,
    { characterSpacing: 0.5 },
  );

doc
  .fillColor("#8a9183")
  .font("Helvetica")
  .fontSize(8)
  .text("Sri Lanka", LEFT, 116)
  .text("aagash1004@gmail.com", LEFT + 62, 116)
  .text("SLIIT · BSc (Hons) Information Technology · AI Specialization", LEFT, 129);

const linkedinUrl = "linkedin.com/in/harikaran-aagash-aa13b9254";
const linkedinWidth = doc.widthOfString(linkedinUrl);
doc
  .fillColor("#8a9183")
  .font("Helvetica")
  .fontSize(8)
  .text(linkedinUrl, LEFT, 142, {
    link: "https://www.linkedin.com/in/harikaran-aagash-aa13b9254",
  })
  .text("·", LEFT + linkedinWidth + 6, 142)
  .text("github.com/Aagash1010", LEFT + linkedinWidth + 14, 142, {
    link: "https://github.com/Aagash1010",
  });

// Abstract header mark
doc
  .strokeColor("#cdff4f")
  .lineWidth(0.7)
  .circle(PAGE_WIDTH - 92, 80, 48)
  .stroke()
  .circle(PAGE_WIDTH - 92, 80, 28)
  .stroke();
doc.circle(PAGE_WIDTH - 92, 80, 3.2).fill(lime);
doc
  .strokeColor("#3a4034")
  .circle(PAGE_WIDTH - 92, 80, 63)
  .stroke();

/* ---------------- Helpers ---------------- */
function sectionTitle(title, x, y, width) {
  doc.rect(x, y + 1, 5, 5).fill(lime);
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(8.2)
    .text(title.toUpperCase(), x + 11, y - 1, {
      width,
      characterSpacing: 1.4,
    });
  doc
    .moveTo(x, y + 14)
    .lineTo(x + width, y + 14)
    .lineWidth(0.6)
    .strokeColor(line)
    .stroke();
  return y + 22;
}

function paragraph(text, x, y, width, options = {}) {
  doc
    .fillColor(options.color || muted)
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.size || 8.1)
    .text(text, x, y, {
      width,
      lineGap: options.lineGap ?? 2.2,
      characterSpacing: options.characterSpacing ?? 0,
    });
  return doc.y;
}

/* ---------------- Left column: profile ---------------- */
let y = 184;
y = sectionTitle("Profile", LEFT, y, LEFT_WIDTH);
y = paragraph(
  "Information Technology undergraduate specializing in Artificial Intelligence at SLIIT, Sri Lanka. Builds with Java, Spring Boot, JavaScript, React and MySQL across database-backed applications and responsive interfaces. Practical experience through university projects and a full-stack development internship.",
  LEFT,
  y,
  LEFT_WIDTH,
  { lineGap: 2.6 },
);

/* ---------------- Left column: experience ---------------- */
y += 16;
y = sectionTitle("Experience", LEFT, y, LEFT_WIDTH);

const experienceTop = y;
doc
  .fillColor(ink)
  .font("Helvetica-Bold")
  .fontSize(9.4)
  .text("Full Stack Development Intern", LEFT, experienceTop, { width: 225 });
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(7.2)
  .text("JUN — JUL 2026", LEFT + 230, experienceTop + 1, {
    width: 85,
    align: "right",
    characterSpacing: 0.6,
  });
doc
  .fillColor(ink)
  .font("Helvetica-Bold")
  .fontSize(8.2)
  .text("Codevda Technologies", LEFT, experienceTop + 13);
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(7.8)
  .text(
    "A focused full-stack development internship centred on turning requirements into working web features, with practical exposure to frontend, backend and professional engineering workflows.",
    LEFT,
    experienceTop + 25,
    { width: LEFT_WIDTH, lineGap: 1.8 },
  );
doc
  .fillColor(muted)
  .font("Helvetica-Oblique")
  .fontSize(6.9)
  .text(
    "Detailed responsibilities and verified outcomes are documented in the online portfolio.",
    LEFT,
    experienceTop + 57,
    { width: LEFT_WIDTH },
  );

/* ---------------- Left column: selected projects ---------------- */
y = experienceTop + 78;
y = sectionTitle("Selected Projects", LEFT, y, LEFT_WIDTH);

const projects = [
  {
    title: "Tourism Package Customization Platform",
    stack: "Java · Spring Boot · HTML · CSS · JavaScript · MySQL",
    copy: "Full-stack platform for destination, hotel, guide and booking management with authentication and CRUD operations.",
  },
  {
    title: "Luxmy Digital Color Lab — Billing System",
    stack: "HTML · CSS · JavaScript · LocalStorage · PDF generation",
    copy: "Browser-based billing application with custom invoice numbering, category management, sales analytics and daily/monthly reports.",
  },
  {
    title: "Weather Application",
    stack: "HTML · CSS · JavaScript · REST APIs",
    copy: "Responsive weather interface integrating a live REST API with considered loading and error states.",
  },
  {
    title: "ESP32 Healthcare Monitoring System",
    stack: "ESP32 · Heart Rate Sensor · MPU6050 · SIM800L · GPS",
    copy: "University group IoT project. Contributed the heart rate monitoring module and sensor integration.",
  },
];

let projectY = y;
for (const project of projects) {
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .text(project.title, LEFT, projectY, { width: LEFT_WIDTH });
  projectY = doc.y + 1.5;
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(6.7)
    .text(project.stack, LEFT, projectY, { width: LEFT_WIDTH });
  projectY = doc.y + 1.5;
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(7.5)
    .text(project.copy, LEFT, projectY, { width: LEFT_WIDTH, lineGap: 1.4 });
  projectY = doc.y + 9;
}

/* ---------------- Right column: education ---------------- */
let ry = 184;
ry = sectionTitle("Education", RIGHT, ry, RIGHT_WIDTH);
doc
  .fillColor(ink)
  .font("Helvetica-Bold")
  .fontSize(9)
  .text("BSc (Hons) Information Technology", RIGHT, ry, {
    width: RIGHT_WIDTH,
    lineGap: 1.5,
  });
ry = doc.y + 3;
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(7.4)
  .text("Specialization: Artificial Intelligence", RIGHT, ry, {
    width: RIGHT_WIDTH,
  });
ry = doc.y + 2;
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(7.2)
  .text("Sri Lanka Institute of Information Technology (SLIIT), Malabe, Sri Lanka", RIGHT, ry, {
    width: RIGHT_WIDTH,
    lineGap: 1.5,
  });

/* ---------------- Right column: skills ---------------- */
ry = doc.y + 16;
ry = sectionTitle("Technical Toolkit", RIGHT, ry, RIGHT_WIDTH);

const skills = [
  ["Programming", "Java, Python, JavaScript"],
  ["Frontend", "HTML, CSS, JavaScript, React, Bootstrap"],
  ["Backend", "Java, Spring Boot, Node.js, REST APIs"],
  ["Database", "MySQL"],
  ["Developer Tools", "Git, GitHub, IntelliJ IDEA, VS Code"],
  ["Areas of Interest", "AI, Machine Learning, UI/UX, Competitive Programming"],
];

for (const [group, list] of skills) {
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(7.3)
    .text(group, RIGHT, ry);
  ry = doc.y + 1;
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(7.2)
    .text(list, RIGHT, ry, { width: RIGHT_WIDTH, lineGap: 1.3 });
  ry = doc.y + 6;
}

/* ---------------- Right column: interests ---------------- */
ry = doc.y + 8;
ry = sectionTitle("Interests", RIGHT, ry, RIGHT_WIDTH);
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(7.2)
  .text(
    "Artificial Intelligence · Machine Learning · Full-Stack Development · Modern Web Technologies · Competitive Programming · Software Engineering · Creative UI/UX",
    RIGHT,
    ry,
    { width: RIGHT_WIDTH, lineGap: 1.5 },
  );

/* ---------------- Footer ---------------- */
doc
  .moveTo(LEFT, 795)
  .lineTo(PAGE_WIDTH - LEFT, 795)
  .lineWidth(0.6)
  .strokeColor(line)
  .stroke();
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(6.5)
  .text("AAGASH HARIKARAN  ·  SOFTWARE DEVELOPER", LEFT, 804, {
    characterSpacing: 0.8,
  });
doc
  .fillColor(muted)
  .fontSize(6.5)
  .text("AAGASH HARIKARAN  /  PORTFOLIO CV", LEFT, 804, {
    width: PAGE_WIDTH - LEFT * 2,
    align: "right",
    characterSpacing: 0.8,
  });

doc.end();

console.log(`CV written to ${outFile}`);
