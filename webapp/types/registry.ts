/**
 * Types mirroring the shapes built by webapp/lib/registry.js
 *
 * Folder structure scanned by the registry:
 *   /{basePath}/{nanoclVersion}/{statefileSlug}/{statefileVersion}/
 *
 * Main concepts:
 * - StatefileVersionEntry: metadata + YAML content for a specific statefile version (e.g., 0.1.0)
 * - StatefileEntry: the statefile record with latest info and a map of all discovered versions
 * - VersionBucket: collection of statefiles for a given Nanocl version (e.g., v0.17) + tag index
 * - RegistrySnapshot: full in-memory registry across Nanocl versions
 */

export type NanoclVersion = string; // e.g., "v0.17"
export type StatefileVersionString = string; // e.g., "0.1.0"
export type StatefileSlug = string; // e.g., "certbot"
export type Tag = string; // e.g., "networking", "security"

/**
 * Core metadata extracted from YAML (Metadata block)
 */
export interface StatefileMeta {
  name: string; // Metadata.Name
  about: string; // Metadata.About
  longAbout: string; // Metadata.LongAbout
  tags: string[]; // Metadata.Tags
}

/**
 * A specific version of a statefile, including YAML location and content.
 */
export interface StatefileVersionEntry extends StatefileMeta {
  version: StatefileVersionString;
  yamlPath: string; // absolute path to the YAML file on disk
  yamlText: string; // raw YAML content
}

/**
 * The statefile record returned by the registry, keeping latest fields for convenience
 * and listing all discovered versions.
 */
export interface StatefileEntry extends StatefileMeta {
  slug: StatefileSlug;
  latestVersion: StatefileVersionString;
  // Latest version convenience fields (path/text mirror the latest version entry)
  yamlPath: string;
  yamlText: string;
  // All discovered versions for this statefile, keyed by version string
  versions: Record<StatefileVersionString, StatefileVersionEntry>;
}

/**
 * Tag index for a specific Nanocl version: tag -> list of statefile slugs
 */
export type TagMap = Record<Tag, StatefileSlug[]>;

/**
 * Bucket of statefiles and tags for a single Nanocl version.
 */
export interface StatefileVersionBucket {
  statefiles: Record<StatefileSlug, StatefileEntry>;
  tags: TagMap;
}

/**
 * Full registry snapshot in memory as built by the loader.
 */
export interface RegistrySnapshot {
  basePath: string;
  latestVersion: NanoclVersion; // default Nanocl version used by the app
  versions: NanoclVersion[]; // all discovered Nanocl versions (e.g., ["v0.17"]) 
  data: Record<NanoclVersion, StatefileVersionBucket>; // per-Nanocl version data
}

/**
 * Convenience result shapes corresponding to registry accessors.
 */
export type GetVersionResult = StatefileVersionBucket | undefined;
export type GetStatefileResult = StatefileEntry | null;
export type GetStatefileVersionResult = StatefileVersionEntry | null;
export type GetByTagResult = StatefileEntry[];
