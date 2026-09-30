import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "/Users/johnphs/Documents/code/NTU-AIE/m2-b2b-invoice-mgmt-sys";
const SKILL_DIR = "/Users/johnphs/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const TMP_DIR = path.join(workspaceDir, ".codex-pptx-build/easyinvoice");
const FINAL_PPTX = path.join(workspaceDir, "docs/planning/EasyInvoice-Module2-Presentation-final.pptx");
const RUNTIME_PYTHON = "/Users/johnphs/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const { finalizePresentation, resolvePresentationFont } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href,
);

const fontFamily = resolvePresentationFont({ fontFamily: "Arial" });
const colors = {
  ink: "#1B211F",
  muted: "#5F6662",
  canvas: "#F6F5F1",
  paper: "#FFFDF9",
  rule: "#D5D8D3",
  ocean: "#1F5552",
  amber: "#EDB86C",
  copper: "#A45F3F",
  navy: "#0E3C75",
};

const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });

function addBox(slide, x, y, w, h, fill, radius = "rect") {
  return slide.shapes.add({
    geometry: radius,
    position: { left: x, top: y, width: w, height: h },
    fill: { type: "solid", color: fill },
    line: { fill: "none", width: 0 },
  });
}

function addText(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: fontFamily,
    fontSize: opts.fontSize ?? 28,
    bold: opts.bold ?? false,
    color: opts.color ?? colors.ink,
    autoFit: "none",
    ...(opts.italic ? { italic: true } : {}),
  };
  return shape;
}

function addSlideTitle(slide, title) {
  addText(slide, title, 64, 38, 1100, 58, { fontSize: 42, bold: true, color: colors.ink });
  addBox(slide, 64, 102, 96, 6, colors.amber);
}

async function addImage(slide, fileName, position, alt, options = {}) {
  const imagePath = path.join(workspaceDir, "docs/images", fileName);
  return addImagePath(slide, imagePath, position, alt, options);
}

async function addImagePath(slide, imagePath, position, alt, options = {}) {
  const bytes = await fs.readFile(imagePath);
  const contentType = path.extname(imagePath).toLowerCase() === ".jpeg" || path.extname(imagePath).toLowerCase() === ".jpg"
    ? "image/jpeg"
    : "image/png";
  return slide.images.add({
    blob: new Uint8Array(bytes),
    contentType,
    alt,
    fit: options.fit ?? "contain",
    position,
    ...(options.crop ? { crop: options.crop } : {}),
    ...(options.geometry ? { geometry: options.geometry } : {}),
    ...(options.borderRadius ? { borderRadius: options.borderRadius } : {}),
  });
}

function addRule(slide, x, y, w) {
  addBox(slide, x, y, w, 2, colors.rule);
}

function setNotes(slide, text) {
  slide.speakerNotes.textFrame.setText(text);
}

// Slide 1: cover
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.ocean;
  addBox(slide, 68, 112, 112, 10, colors.amber);
  addText(slide, "EasyInvoice", 68, 150, 600, 100, { fontSize: 68, bold: true, color: colors.paper });
  addText(slide, "React learning project\nfor B2B e-invoicing", 70, 268, 570, 92, {
    fontSize: 32,
    color: colors.paper,
  });
  addText(slide, "NTU AI Engineering, Module 2", 70, 392, 570, 40, {
    fontSize: 26,
    bold: true,
    color: colors.amber,
  });
  addText(slide, "TEAM 6", 718, 108, 450, 38, { fontSize: 24, bold: true, color: colors.amber });
  const portraits = [
    {
      path: "/Users/johnphs/Documents/John-local/Courses/NTU 2026 SCTP Advanced Professional Certificate in AI Engineering (Full-Time)/Fulltime/Module 2/Module Project-Team 6/Ralph KOH Kwan Liang.jpeg",
      name: "Ralph Koh\nKwan Liang",
      left: 690,
    },
    {
      path: "/Users/johnphs/Documents/John-local/Courses/NTU 2026 SCTP Advanced Professional Certificate in AI Engineering (Full-Time)/Fulltime/Module 2/Module Project-Team 6/ANG Jenn Fang.png",
      name: "Ang Jenn\nFang",
      left: 884,
    },
    {
      path: "/Users/johnphs/Documents/John-local/Courses/NTU 2026 SCTP Advanced Professional Certificate in AI Engineering (Full-Time)/Fulltime/Module 2/Module Project-Team 6/John PHANG.png",
      name: "John\nPhang",
      left: 1078,
    },
  ];
  for (const portrait of portraits) {
    addBox(slide, portrait.left - 6, 162, 150, 150, colors.paper, "ellipse");
    await addImagePath(slide, portrait.path, { left: portrait.left, top: 168, width: 138, height: 138 }, `${portrait.name.replace("\n", " ")} portrait`, {
      fit: "cover",
      geometry: "ellipse",
    });
    addText(slide, portrait.name, portrait.left - 18, 326, 174, 68, { fontSize: 24, bold: true, color: colors.paper });
  }
  addText(slide, "Live demo follows this short overview", 70, 610, 620, 38, {
    fontSize: 24,
    color: colors.amber,
  });
  setNotes(slide, "Timing: 25 seconds. Introduce EasyInvoice as the team's React learning project. The slides take about four minutes, followed by the working demo. Sources: README.md and docs/planning/presentation-outline.md.");
}

// Slide 2: problem
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.canvas;
  addSlideTitle(slide, "Problem and audience");
  addText(slide, "Invoice work spans creation,\ntransmission and payment status", 64, 140, 560, 112, {
    fontSize: 34,
    bold: true,
    color: colors.navy,
  });
  addText(slide, "Audience", 64, 274, 180, 34, { fontSize: 25, bold: true, color: colors.copper });
  addText(slide, "Small business finance and accounts receivable teams", 64, 312, 520, 82, {
    fontSize: 28,
    color: colors.ink,
  });
  addText(slide, "EasyInvoice", 64, 416, 200, 34, { fontSize: 25, bold: true, color: colors.copper });
  addText(slide, "A browser demo of the invoice lifecycle using Singapore InvoiceNow concepts", 64, 454, 520, 88, {
    fontSize: 28,
    color: colors.ink,
  });
  addText(slide, "Simulated network. Synthetic data only.", 64, 610, 510, 40, {
    fontSize: 24,
    bold: true,
    color: colors.ocean,
  });
  addBox(slide, 652, 128, 560, 520, colors.paper, "roundRect");
  await addImage(slide, "Peppol-InvoiceNow.png", { left: 680, top: 150, width: 504, height: 474 }, "Peppol InvoiceNow business process diagram", { fit: "contain" });
  setNotes(slide, "Timing: 40 seconds. Explain that small finance teams need one view of invoice creation, transmission and collection status. EasyInvoice demonstrates that workflow but does not connect to the real InvoiceNow network. Sources: README.md and docs/images/Peppol-InvoiceNow.png.");
}

// Slide 3: screenshots
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.canvas;
  addSlideTitle(slide, "Working application");
  addBox(slide, 56, 132, 566, 506, colors.paper, "roundRect");
  addBox(slide, 658, 132, 566, 506, colors.paper, "roundRect");
  addText(slide, "Dashboard", 80, 150, 230, 38, { fontSize: 29, bold: true, color: colors.ocean });
  addText(slide, "Search, filter, status and actions", 80, 188, 450, 34, { fontSize: 24, color: colors.muted });
  await addImage(slide, "dashboard.png", { left: 80, top: 232, width: 518, height: 380 }, "EasyInvoice dashboard screenshot", {
    fit: "cover",
    crop: { left: 0.04, top: 0.08, right: 0.04, bottom: 0.22 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  addText(slide, "Create invoice", 682, 150, 260, 38, { fontSize: 29, bold: true, color: colors.ocean });
  addText(slide, "Controlled form, catalogue items and GST", 682, 188, 480, 34, { fontSize: 24, color: colors.muted });
  await addImage(slide, "create-invoice.png", { left: 682, top: 232, width: 518, height: 380 }, "EasyInvoice create invoice form screenshot", {
    fit: "cover",
    crop: { left: 0.04, top: 0.04, right: 0.04, bottom: 0.05 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  setNotes(slide, "Timing: 40 seconds. Point out the dashboard's operational view and the controlled create form. The live demo will show search, invoice creation, simulated transmission and status changes. Sources: docs/images/dashboard.png and docs/images/create-invoice.png.");
}

// Slide 4: technology
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.canvas;
  addSlideTitle(slide, "Technology and data");
  const rows = [
    ["React 19 + Vite 8", "Components, hooks and fast local builds"],
    ["React Router 7", "Public login/tour and protected app routes"],
    ["MockAPI", "Shared CRUD persistence, no custom server"],
    ["Vitest + React Testing Library", "37 behaviour tests in GitHub Actions"],
    ["Public APIs", "FX rates and illustrative customer contacts"],
  ];
  let y = 140;
  for (const [label, detail] of rows) {
    addText(slide, label, 64, y, 450, 34, { fontSize: 27, bold: true, color: colors.ocean });
    addText(slide, detail, 64, y + 38, 500, 48, { fontSize: 24, color: colors.ink });
    if (y < 520) addRule(slide, 64, y + 92, 500);
    y += 102;
  }
  addBox(slide, 620, 132, 596, 508, colors.paper, "roundRect");
  addText(slide, "MockAPI reference data", 648, 152, 420, 38, { fontSize: 28, bold: true, color: colors.copper });
  await addImage(slide, "referenceData-customers.png", { left: 648, top: 202, width: 540, height: 408 }, "MockAPI customer reference data screenshot", {
    fit: "cover",
    crop: { left: 0.04, top: 0.04, right: 0.04, bottom: 0.04 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  setNotes(slide, "Timing: 50 seconds. Explain why each technology was chosen. MockAPI provides shared persistence without a custom backend. The free tier allowed two resources, so customers and products share referenceData. Sources: README.md, docs/engineering/architecture-design.md and docs/images/referenceData-customers.png.");
}

// Slide 5: learnings
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.canvas;
  addText(slide, "Team learnings", 80, 38, 1084, 58, { fontSize: 42, bold: true, color: colors.ink });
  addBox(slide, 80, 102, 96, 6, colors.amber);
  const learningRows = [
    ["Ralph Koh", "Structured a complete React app with reusable components, routes and shared state"],
    ["Ang Jenn Fang", "Tested user behaviour with Vitest, React Testing Library and mocks"],
    ["John Phang", "Integrated hosted persistence, role checks and CI across parallel branches"],
  ];
  let y = 154;
  for (const [name, learning] of learningRows) {
    addText(slide, name, 64, y, 420, 38, { fontSize: 30, bold: true, color: colors.copper });
    addText(slide, learning, 64, y + 46, 520, 82, { fontSize: 26, color: colors.ink });
    if (y < 440) addRule(slide, 64, y + 140, 520);
    y += 166;
  }
  addBox(slide, 642, 132, 574, 510, colors.paper, "roundRect");
  await addImage(slide, "Full_tour_with_code.png", { left: 668, top: 152, width: 522, height: 468 }, "EasyInvoice React learning tour screenshot", {
    fit: "cover",
    crop: { left: 0.04, top: 0.03, right: 0.04, bottom: 0.18 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  setNotes(slide, "Timing: 45 seconds. Summarise each member's learning focus. Ralph built the initial React application, Jenn established behavioural testing, and John integrated persistence, permissions and repository automation. Sources: docs/planning/presentation-outline.md, README.md and docs/images/Full_tour_with_code.png.");
}

// Slide 6: challenges and demo handoff
{
  const slide = presentation.slides.add();
  slide.background.fill = colors.canvas;
  addSlideTitle(slide, "Challenges and responses");
  const challenges = [
    ["MockAPI allowed two resources", "Customers and products share a typed referenceData resource"],
    ["The schema editor could erase records", "The team documented the risk and added repeatable seed data"],
    ["Session-key mismatch after integration", "Tests caught the regression before release"],
  ];
  let y = 142;
  for (const [challenge, response] of challenges) {
    addText(slide, challenge, 64, y, 660, 42, { fontSize: 28, bold: true, color: colors.navy });
    addText(slide, response, 64, y + 46, 650, 62, { fontSize: 24, color: colors.ink });
    if (y < 400) addRule(slide, 64, y + 120, 650);
    y += 138;
  }
  addBox(slide, 770, 132, 446, 430, colors.paper, "roundRect");
  await addImage(slide, "Hints-ON.png", { left: 794, top: 154, width: 398, height: 386 }, "EasyInvoice hints mode screenshot", {
    fit: "cover",
    crop: { left: 0.04, top: 0.03, right: 0.04, bottom: 0.10 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  addBox(slide, 64, 594, 1152, 72, colors.amber, "roundRect");
  addText(slide, "Live demo next: viewer permissions, create and transmit, mark paid", 92, 611, 1100, 40, {
    fontSize: 28,
    bold: true,
    color: colors.ink,
  });
  setNotes(slide, "Timing: 50 seconds. Describe the resource-limit decision, the destructive schema-editor risk and the integration bug found by tests. Then move directly to the live demo: compare viewer and editor access, create and transmit an invoice, and mark a transmitted invoice paid. Sources: docs/planning/presentation-outline.md, docs/decisions/decisions-log.md and docs/images/Hints-ON.png.");
}

await fs.mkdir(TMP_DIR, { recursive: true });
const previewDir = path.join(TMP_DIR, "previews");
await fs.mkdir(previewDir, { recursive: true });
for (let i = 0; i < presentation.slides.items.length; i += 1) {
  const slide = presentation.slides.items[i];
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(previewDir, `slide-${i + 1}.png`), new Uint8Array(await preview.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(previewDir, `slide-${i + 1}.layout.json`), await layout.text());
}

const requirements = {
  explicitTotalSlideCount: 6,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
};
const fontPolicy = { basis: "design", families: [fontFamily] };
const expectedSlideSizeEmu = "12192000,6858000";
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
const candidatePath = path.join(stagingDir, "easyinvoice-candidate-final.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", expectedSlideSizeEmu,
    "--validate-bullet-geometry",
    "--validate-heading-fit",
  ],
  requiredNativeTableOwnerSlides: [],
  fontPolicy,
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "EasyInvoice-Module2-Presentation-final.validation.json"),
});

console.log(JSON.stringify({ finalPath: FINAL_PPTX, fontFamily, result }, null, 2));
