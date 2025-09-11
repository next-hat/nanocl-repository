/**
 * Nanocl Registry in-memory loader
 * Scans a base folder structured as: /folder/{nanocl_version}/{statefilename}/{statefile_version}/
 * - Each statefile folder may contain a `.metadata.json` with `{ "latest_version": "0.1.0" }`
 * - The YAML statefile is expected at `{statefile_version}.yml` inside the statefile folder
 * - Alternatively, inside a subfolder: `{statefile_version}/{statefile_version}.yml`
 *
 * Builds: registry[version] = {
 *   statefiles: {
 *     [statefileName]: {
 *       // Latest version fields (for backward compatibility)
 *       slug, name, about, longAbout, tags, latestVersion, yamlPath, yamlText,
 *       // All discovered versions
 *       versions: {
 *         [ver]: { version, name, about, longAbout, tags, yamlPath, yamlText }
 *       }
 *     }
 *   },
 *   tags: { [tag]: string[] },
 * }
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/** @type {null | { basePath: string, latestVersion: string, versions: string[], data: Record<string, { statefiles: Record<string, any>, tags: Record<string, string[]> }> }} */
let REGISTRY = null;

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts metadata fields from a YAML document object.
 * @param {any} yml
 */
function extractMeta(yml) {
  const metaBlock = (yml && (yml.Metadata || yml.metadata)) || {};
  const name = metaBlock.Name || '';
  const about = metaBlock.About || '';
  const longAbout = metaBlock.LongAbout || '';
  const tags = Array.isArray(metaBlock.Tags) ? metaBlock.Tags : [];
  return { name, about, longAbout, tags };
}

/**
 * Discover all versions available for a given statefile by scanning .yml files.
 * Supports two layouts:
 *  - Direct: {stateDir}/{ver}.yml
 *  - Subfolder: {stateDir}/{ver}/{ver}.yml
 * @param {string} basePath
 * @param {string} versionDir
 * @param {string} stateSlug
 * @returns {Record<string, { version: string, name: string, about: string, longAbout: string, tags: string[], yamlPath: string, yamlText: string }>} versions map
 */
function discoverVersions(basePath, versionDir, stateSlug) {
  const stateDir = path.join(basePath, versionDir, stateSlug);
  /** @type {Record<string, { version: string, name: string, about: string, longAbout: string, tags: string[], yamlPath: string, yamlText: string }> } */
  const versions = {};

  if (!isDirectory(stateDir)) return versions;

  // 1) Direct .yml files: {ver}.yml
  try {
    const entries = fs.readdirSync(stateDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.yml')) {
        const ver = e.name.replace(/\.yml$/, '');
        const ymlPath = path.join(stateDir, e.name);
        try {
          const yamlText = fs.readFileSync(ymlPath, 'utf8');
          let yml;
          try {
            yml = yaml.load(yamlText) || {};
          } catch (err) {
            console.warn(`[registry] Failed to parse YAML for ${stateSlug}@${ver}:`, err.message);
            yml = {};
          }
          const meta = extractMeta(yml);
          versions[ver] = { version: ver, ...meta, yamlPath: ymlPath, yamlText };
        } catch (err) {
          console.warn(`[registry] Failed to read YAML for ${stateSlug}@${ver}:`, err.message);
        }
      }
    }
  } catch (err) {
    // ignore; directory listing issues
  }

  // 2) Version subfolders: {ver}/{ver}.yml
  try {
    const entries = fs.readdirSync(stateDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const ver = e.name;
        const candidate = path.join(stateDir, ver, `${ver}.yml`);
        if (!fileExists(candidate)) continue;
        if (versions[ver]) continue; // prefer direct file if already discovered
        try {
          const yamlText = fs.readFileSync(candidate, 'utf8');
          let yml;
          try {
            yml = yaml.load(yamlText) || {};
          } catch (err) {
            console.warn(`[registry] Failed to parse YAML for ${stateSlug}@${ver}:`, err.message);
            yml = {};
          }
          const meta = extractMeta(yml);
          versions[ver] = { version: ver, ...meta, yamlPath: candidate, yamlText };
        } catch (err) {
          console.warn(`[registry] Failed to read YAML for ${stateSlug}@${ver}:`, err.message);
        }
      }
    }
  } catch (err) {
    // ignore
  }

  return versions;
}

/**
 * Load a single statefile latest metadata and YAML.
 * @param {string} basePath
 * @param {string} versionDir e.g., "v0.17"
 * @param {string} stateSlug e.g., "certbot"
 */
function loadStatefile(basePath, versionDir, stateSlug) {
  const stateDir = path.join(basePath, versionDir, stateSlug);
  const metaPath = path.join(stateDir, '.metadata.json');
  if (!fileExists(metaPath)) {
    return null; // skip if metadata missing
  }
  /** @type {{ latest_version?: string }} */
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    console.error(`[registry] Invalid JSON: ${metaPath}`, e);
    return null;
  }
  const latestVersion = meta.latest_version;
  if (!latestVersion) return null;

  // Discover all available versions
  const versions = discoverVersions(basePath, versionDir, stateSlug);

  // Determine latest entry from discovered versions
  let latest = versions[latestVersion];
  if (!latest) {
    // try to resolve latest path as before if not found in discovery
    let ymlPath = path.join(stateDir, `${latestVersion}.yml`);
    if (!fileExists(ymlPath)) {
      const alt = path.join(stateDir, latestVersion, `${latestVersion}.yml`);
      if (fileExists(alt)) ymlPath = alt;
    }
    if (fileExists(ymlPath)) {
      const yamlText = fs.readFileSync(ymlPath, 'utf8');
      let yml;
      try {
        yml = yaml.load(yamlText) || {};
      } catch (e) {
        console.warn(`[registry] Failed to parse YAML for ${stateSlug}@${latestVersion}:`, e.message);
        yml = {};
      }
      const meta = extractMeta(yml);
      latest = { version: latestVersion, ...meta, yamlPath: ymlPath, yamlText };
      versions[latestVersion] = latest;
    }
  }

  if (!latest) return null; // cannot resolve latest

  return {
    slug: stateSlug,
    // latest version fields kept for compatibility
    name: latest.name || stateSlug,
    about: latest.about || '',
    longAbout: latest.longAbout || '',
    tags: Array.isArray(latest.tags) ? latest.tags : [],
    latestVersion,
    yamlPath: latest.yamlPath,
    yamlText: latest.yamlText,
    versions,
  };
}

/**
 * Build registry from base path.
 * @param {string} basePath
 * @returns {{ versions: string[], data: Record<string, { statefiles: Record<string, any>, tags: Record<string, string[]> }> }}
 */
function build(basePath) {
  const versions = fs
    .readdirSync(basePath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => /^v\d+/.test(name))
    .sort();

  /** @type {Record<string, { statefiles: Record<string, any>, tags: Record<string, string[]> }>} */
  const data = {};

  for (const ver of versions) {
    const verDir = path.join(basePath, ver);
    const stateDirs = fs
      .readdirSync(verDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    /** @type {Record<string, any>} */
    const statefiles = {};
    /** @type {Record<string, string[]>} */
    const tagsMap = {};

    for (const stateSlug of stateDirs) {
      const entry = loadStatefile(basePath, ver, stateSlug);
      if (!entry) continue;
      statefiles[stateSlug] = entry;
      for (const t of entry.tags) {
        if (!tagsMap[t]) tagsMap[t] = [];
        tagsMap[t].push(stateSlug);
      }
    }

    data[ver] = { statefiles, tags: tagsMap };
  }

  return { versions, data };
}

/**
 * Initialize the global registry singleton.
 * @param {string} basePath
 * @param {string} latestVersion
 */
function initRegistry(basePath, latestVersion) {
  if (!fileExists(basePath) || !isDirectory(basePath)) {
    throw new Error(`[registry] Base path not found or not a directory: ${basePath}`);
  }
  const built = build(basePath);
  REGISTRY = {
    basePath,
    latestVersion,
    versions: built.versions,
    data: built.data,
  };
  console.log(`> [registry] Loaded versions: ${REGISTRY.versions.join(', ')}`);
}

function ensureInitialized() {
  if (!REGISTRY) throw new Error('[registry] Not initialized');
}

function getRegistry() {
  ensureInitialized();
  return REGISTRY;
}

function getLatestVersion() {
  ensureInitialized();
  return REGISTRY.latestVersion;
}

/**
 * @param {string} version
 */
function getVersion(version) {
  ensureInitialized();
  return REGISTRY.data[version];
}

/**
 * @param {string} version
 * @param {string} slug
 */
function getStatefile(version, slug) {
  ensureInitialized();
  const ver = getVersion(version);
  if (!ver) return null;
  return ver.statefiles[slug] || null;
}

/**
 * Get a specific version of a statefile entry.
 * Returns null if version or slug not found.
 * @param {string} version Base nanocl version (e.g., "v0.17")
 * @param {string} slug Statefile slug (e.g., "certbot")
 * @param {string} wantedVersion Statefile version (e.g., "0.1.0")
 * @returns {null | { version: string, name: string, about: string, longAbout: string, tags: string[], yamlPath: string, yamlText: string }}
 */
function getStatefileVersion(version, slug, wantedVersion) {
  ensureInitialized();
  const entry = getStatefile(version, slug);
  if (!entry || !entry.versions) return null;
  return entry.versions[wantedVersion] || null;
}

/**
 * @param {string} version
 * @param {string} tag
 */
function getByTag(version, tag) {
  ensureInitialized();
  const ver = getVersion(version);
  if (!ver) return [];
  const slugs = ver.tags[tag] || [];
  return slugs.map((s) => ver.statefiles[s]).filter(Boolean);
}

module.exports = {
  initRegistry,
  getRegistry,
  getLatestVersion,
  getVersion,
  getStatefile,
  getStatefileVersion,
  getByTag,
};
