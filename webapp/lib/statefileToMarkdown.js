const yaml = require("js-yaml");

/**
 * Convert a statefile JSON object and raw YAML text into Markdown documentation
 * @param {Object} statefile - Parsed JSON object of the statefile
 * @param {string} rawYaml - The raw YAML content of the statefile
 * @param {string} source - Optional source name for the statefile
 * @returns {string} - Markdown string
 */
function statefileToMarkdown(statefile, source = "statefile.yaml") {
  // Convert stripped state back to YAML (simply reusing rawYaml here, could use js-yaml if you want)
  const data = yaml.load(statefile.yamlText);
  const metadata = data.Metadata || {};
  let name = metadata.Name || source;
  const rawYaml = yaml.dump({...data, Metadata: undefined});
  if (metadata.About) name += ` - ${metadata.About}`;
  let markdown = "# Statefile Manual\n\n";
  if (metadata.ManContent) {
    markdown += metadata.ManContent + `\n## Content\n\`\`\`yaml\n${rawYaml}\n\`\`\`\n`;
    return markdown;
  }
  markdown += `## Name\n${name}\n\n`;
  if (metadata.Tags && metadata.Tags.length > 0) {
    markdown += `## Tags\n${metadata.Tags.join(", ")}\n\n`;
  }
  markdown += `## Synopsis\nnanocl state apply -s ${source} -- [--help] **ARGUMENTS**\nnanocl state rm -s ${source} -- [--help] **ARGUMENTS**\n\n`;
  if (metadata.LongAbout) {
    markdown += `## Description\n${metadata.LongAbout}\n`;
  } else if (metadata.About) {
    markdown += `## Description\n${metadata.about}\n`;
  }
  if (data.Args && data.Args.length > 0) {
    markdown += "## Arguments\n";
    for (const a of data.Args) {
      const required = a.Required ? " (required)" : "";
      const multiple = a.Multiple ? " (multiple)" : "";
      const description = a.Description ? `\n\n${a.Description}` : "";
      const def = a.Default !== undefined ? `\nDefault: ${a.Default}` : "";
      markdown += `**--${a.Name}** ${a.Kind}${required}${multiple}${description}${def}\n\n`;
    }
  }
  markdown += `## Content\n\`\`\`yaml\n${rawYaml}\n\`\`\`\n`;
  return markdown;
}

module.exports = {
  statefileToMarkdown,
}