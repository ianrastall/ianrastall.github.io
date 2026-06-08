import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import YAML from "yaml";

const root = process.cwd();
const contentDir = join(root, "src", "content", "blog");
const publicDir = join(root, "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];

function walkMarkdownFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }

    return /\.(md|mdx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function parseFrontMatter(filePath) {
  const text = readFileSync(filePath, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    errors.push(`${relative(root, filePath)}: missing YAML front matter.`);
    return undefined;
  }

  try {
    return YAML.parse(match[1]) ?? {};
  } catch (error) {
    errors.push(`${relative(root, filePath)}: invalid YAML front matter: ${error.message}`);
    return undefined;
  }
}

function asDate(value) {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function requireString(data, filePath, fieldName) {
  if (typeof data[fieldName] !== "string" || data[fieldName].trim() === "") {
    errors.push(`${relative(root, filePath)}: ${fieldName} must be a non-empty string.`);
    return undefined;
  }

  return data[fieldName].trim();
}

const files = walkMarkdownFiles(contentDir);
const slugs = new Map();

for (const file of files) {
  const data = parseFrontMatter(file);
  if (!data) {
    continue;
  }

  requireString(data, file, "title");
  requireString(data, file, "description");
  requireString(data, file, "category");

  const slug = requireString(data, file, "slug");
  if (slug) {
    if (!slugPattern.test(slug)) {
      errors.push(
        `${relative(root, file)}: slug must be lowercase letters/numbers separated by hyphens.`
      );
    }

    const previous = slugs.get(slug);
    if (previous) {
      errors.push(
        `${relative(root, file)}: duplicate slug "${slug}" also appears in ${relative(root, previous)}.`
      );
    } else {
      slugs.set(slug, file);
    }
  }

  if (typeof data.draft !== "boolean") {
    errors.push(`${relative(root, file)}: draft must be true or false.`);
  }

  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    errors.push(`${relative(root, file)}: featured must be true or false when present.`);
  }

  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push(`${relative(root, file)}: tags must be a YAML list when present.`);
  }

  const published = asDate(data.published);
  if (data.draft === false && !published) {
    errors.push(`${relative(root, file)}: public posts require a valid published timestamp.`);
  }

  const updated = asDate(data.updated);
  if (data.updated !== undefined && !updated) {
    errors.push(`${relative(root, file)}: updated must be a valid timestamp when present.`);
  }

  if (published && updated && updated.getTime() < published.getTime()) {
    errors.push(`${relative(root, file)}: updated cannot be earlier than published.`);
  }

  if (data.heroImage !== undefined) {
    if (typeof data.heroImage !== "string" || !data.heroImage.startsWith("/images/posts/")) {
      errors.push(`${relative(root, file)}: heroImage must start with /images/posts/.`);
    } else {
      const heroPath = join(publicDir, data.heroImage.replace(/^\//, ""));
      if (!existsSync(heroPath)) {
        errors.push(`${relative(root, file)}: heroImage does not exist: ${data.heroImage}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${files.length} blog post file${files.length === 1 ? "" : "s"}.`);
