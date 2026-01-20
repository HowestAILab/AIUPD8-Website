#!/usr/bin/env node

/**
 * Add New Research Project Script
 *
 * This script automates adding a new research project to the AIUPD8-Website.
 * It updates configuration files and generates code snippets for backend integration.
 *
 * Usage: npm run add-project
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Color output for terminal
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, "green");
}

function logError(message) {
  log(`✗ ${message}`, "red");
}

function logInfo(message) {
  log(`ℹ ${message}`, "blue");
}

function logWarning(message) {
  log(`⚠ ${message}`, "yellow");
}

// Prompt user for input
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}? ${question}${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Validate inputs
function validateProjectId(id) {
  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  if (!camelCaseRegex.test(id)) {
    throw new Error("Project ID must be camelCase (e.g., projectname)");
  }
  return true;
}

function validateHexColor(color) {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  if (!hexRegex.test(color)) {
    throw new Error("Color must be a valid hex code (e.g., #8B5CF6)");
  }
  return true;
}

function validateSlug(slug) {
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    throw new Error("Slug must be lowercase with hyphens only");
  }
  return true;
}

// Main script
async function main() {
  log(
    "\n╔════════════════════════════════════════════════════════════╗",
    "bright"
  );
  log(
    "║   AIUPD8-Website: Add New Research Project                  ║",
    "bright"
  );
  log(
    "╚════════════════════════════════════════════════════════════╝\n",
    "bright"
  );

  try {
    // Gather project information
    log("Please provide the following information:\n", "cyan");

    // Project ID
    let projectId = "";
    while (!projectId) {
      projectId = await prompt("Project ID (camelCase, e.g., projectname):");
      try {
        validateProjectId(projectId);
      } catch (e) {
        logError(e.message);
        projectId = "";
      }
    }

    // Project Name
    const projectName = await prompt("Project Name (e.g., Project Name):");
    if (!projectName) throw new Error("Project name is required");

    // URL Slug
    const defaultSlug = projectId.toLowerCase();
    let slug = await prompt(`URL Slug (default: ${defaultSlug}):`);
    if (!slug) slug = defaultSlug;
    try {
      validateSlug(slug);
    } catch (e) {
      logError(e.message);
      throw e;
    }

    // Color
    let color = "";
    while (!color) {
      color = await prompt("Color (Hex, e.g., #8B5CF6):");
      try {
        validateHexColor(color);
      } catch (e) {
        logError(e.message);
        color = "";
      }
    }

    // Profile Name
    const profileName = await prompt(
      "Profile Name (e.g., Creative Professional):"
    );
    if (!profileName) throw new Error("Profile name is required");

    // Profile Description
    const profileDescription = await prompt("Profile Description (for users):");
    if (!profileDescription) throw new Error("Profile description is required");

    // Full Description
    log(
      "Full Description (enter multiple lines, end with empty line):",
      "cyan"
    );
    let fullDescription = "";
    while (true) {
      const line = await prompt("> ");
      if (!line) break;
      fullDescription += line + " ";
    }
    if (!fullDescription) throw new Error("Full description is required");

    // Short Description
    const shortDescription = await prompt("Short Description (one line):");
    if (!shortDescription) throw new Error("Short description is required");

    // Target Audiences
    const audiencesInput = await prompt("Target Audiences (comma-separated):");
    const targetAudience = audiencesInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
    if (targetAudience.length === 0)
      throw new Error("At least one audience is required");

    // Logos
    const logosInput = await prompt(
      "Logo URLs (space-separated, optional - press Enter to skip):"
    );
    const logos = logosInput
      .split(/\s+/)
      .filter((url) => url)
      .map((url, index) => ({
        src: url,
        alt: `Partner ${index + 1}`,
        url: undefined,
      }));

    // Project Image
    const projectImage = await prompt(
      "Project Image URL (or default: /images/" + projectId + "-project.jpg):"
    );
    const imageUrl = projectImage || `/images/${projectId}-project.jpg`;

    // Confirmation
    log("\n📋 Project Summary:\n", "cyan");
    log(`  ID: ${projectId}`, "bright");
    log(`  Name: ${projectName}`);
    log(`  Slug: ${slug}`);
    log(`  Color: ${color}`);
    log(`  Profile: ${profileName}`);
    log(`  Target Audiences: ${targetAudience.join(", ")}`);
    log(`  Logo Count: ${logos.length}`);
    log("");

    const confirm = await prompt("Proceed with these settings? (yes/no):");
    if (confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "y") {
      logWarning("Operation cancelled");
      process.exit(0);
    }

    // Generate project config object
    const projectConfig = {
      id: projectId,
      name: projectName,
      slug: slug,
      color: color,
      profile: {
        name: profileName,
        description: profileDescription,
      },
      description: fullDescription.trim(),
      shortDescription: shortDescription.trim(),
      targetAudience: targetAudience,
      logos: logos,
      image: imageUrl,
      isActive: true,
    };

    // Update config/projects.ts
    log("\n🔧 Updating configuration files...\n", "cyan");

    const projectsConfigPath = path.join(
      __dirname,
      "..",
      "config",
      "projects.ts"
    );
    let projectsContent = fs.readFileSync(projectsConfigPath, "utf8");

    // Find the insertion point (before the comment template)
    const insertionPoint = projectsContent.indexOf(
      "  // Template for adding new projects:"
    );
    if (insertionPoint === -1) {
      throw new Error("Could not find insertion point in config/projects.ts");
    }

    const projectConfigString = `  ${JSON.stringify(projectConfig, null, 2)
      .split("\n")
      .join("\n  ")},\n`;

    projectsContent =
      projectsContent.substring(0, insertionPoint) +
      projectConfigString +
      projectsContent.substring(insertionPoint);

    fs.writeFileSync(projectsConfigPath, projectsContent, "utf8");
    logSuccess("Updated config/projects.ts");

    // Update composables/useDatabase.ts
    const useDatabasePath = path.join(
      __dirname,
      "..",
      "composables",
      "useDatabase.ts"
    );
    let useDatabaseContent = fs.readFileSync(useDatabasePath, "utf8");

    // Add favorite field mapping
    const favoriteMapping = `  if (attrs.is${
      projectId.charAt(0).toUpperCase() +
      projectId.slice(1).replace(/([A-Z])/g, (match) => match)
    }Favourite) favorites['${projectId}'] = true;`;
    const favoriteInsertPoint = useDatabaseContent.indexOf(
      "// When adding new projects, add their favorite field here:"
    );
    if (favoriteInsertPoint !== -1) {
      const nextLineStart = useDatabaseContent.indexOf(
        "\n",
        favoriteInsertPoint
      );
      useDatabaseContent =
        useDatabaseContent.substring(0, nextLineStart + 1) +
        "  " +
        favoriteMapping +
        "\n" +
        useDatabaseContent.substring(nextLineStart + 1);
    }

    // Add workflow field to interface
    const workflowField = `  ${projectId}Workflows?: any[]; // Project-specific workflows for ${projectName}`;
    const interfaceInsertPoint = useDatabaseContent.indexOf(
      "psyaidWorkflows?: any[];"
    );
    if (interfaceInsertPoint !== -1) {
      const nextLineStart = useDatabaseContent.indexOf(
        "\n",
        interfaceInsertPoint
      );
      useDatabaseContent =
        useDatabaseContent.substring(0, nextLineStart + 1) +
        workflowField +
        "\n" +
        useDatabaseContent.substring(nextLineStart + 1);
    }

    // Add workflow field to mapping result
    const mappingLine = `    ${projectId}Workflows: attrs.${projectId}Workflows || undefined,`;
    const mappingInsertPoint = useDatabaseContent.indexOf(
      "psyaidWorkflows: attrs.psyaidWorkflows || undefined,"
    );
    if (mappingInsertPoint !== -1) {
      const nextLineStart = useDatabaseContent.indexOf(
        "\n",
        mappingInsertPoint
      );
      useDatabaseContent =
        useDatabaseContent.substring(0, nextLineStart + 1) +
        mappingLine +
        "\n" +
        useDatabaseContent.substring(nextLineStart + 1);
    }

    fs.writeFileSync(useDatabasePath, useDatabaseContent, "utf8");
    logSuccess("Updated composables/useDatabase.ts");

    // Generate code snippets for backend
    log("\n📝 Generated Code Snippets:\n", "cyan");

    const sanitySchema = `
// Add these fields to your tool schema in Sanity CMS:

defineField({
  name: 'is${
    projectId.charAt(0).toUpperCase() +
    projectId.slice(1).replace(/([A-Z])/g, (match) => match)
  }Favourite',
  title: '${projectName} Favourite',
  type: 'boolean',
  initialValue: false,
  description: 'Mark this tool as favorite for ${projectName} project',
}),

defineField({
  name: '${projectId}Workflows',
  title: '${projectName} Workflows',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Workflow Name',
          type: 'string',
        },
        {
          name: 'steps',
          title: 'Workflow Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'image', type: 'image' },
              ],
            },
          ],
        },
      ],
    },
  ],
  description: 'Project-specific workflows for ${projectName}',
}),
`;

    const groqQuery = `
// Update your GROQ queries to include these fields:

*[_type == "tool"] {
  // ... existing fields ...
  is${
    projectId.charAt(0).toUpperCase() +
    projectId.slice(1).replace(/([A-Z])/g, (match) => match)
  }Favourite,
  ${projectId}Workflows,
}
`;

    const apiMapping = `
// Add this mapping in server/api/tools/index.ts:

if (attrs.is${
      projectId.charAt(0).toUpperCase() +
      projectId.slice(1).replace(/([A-Z])/g, (match) => match)
    }Favourite) {
  favorites['${projectId}'] = true;
}

// In the result object:
${projectId}Workflows: attrs.${projectId}Workflows || undefined,
`;

    log("1️⃣  SANITY CMS SCHEMA:", "yellow");
    log(sanitySchema);

    log("\n2️⃣  GROQ QUERY UPDATES:", "yellow");
    log(groqQuery);

    log("\n3️⃣  API ENDPOINT MAPPING:", "yellow");
    log(apiMapping);

    // Summary
    log(
      "\n╔════════════════════════════════════════════════════════════╗",
      "bright"
    );
    log(
      "║                    ✓ Project Added!                         ║",
      "bright"
    );
    log(
      "╚════════════════════════════════════════════════════════════╝\n",
      "bright"
    );

    logSuccess("Frontend configuration complete");
    logInfo("Next Steps:");
    log("  1. Copy the Sanity CMS schema code above");
    log("  2. Add it to your tool schema definition");
    log("  3. Update your GROQ queries with the new fields");
    log("  4. Update API endpoints with the mapping code");
    log("  5. Test: npm run dev");
    log("  6. Verify project appears in the dropdown");
    log("  7. Test filtering with project-specific data\n");

    logInfo(
      "Documentation: See ADD_NEW_PROJECT_GUIDE.md for detailed instructions"
    );
  } catch (error) {
    logError(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
