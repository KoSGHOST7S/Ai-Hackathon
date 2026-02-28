import { load } from "cheerio";
import { parseFileViaAgents, type FileContent } from "./agents";

const MAX_LINKED_FILES = 3;
const MAX_FILE_SIZE_BYTES = 2_000_000;

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx < 0) return "";
  return filename.slice(idx).toLowerCase();
}

function isSupportedFilename(filename: string): boolean {
  const ext = getExtension(filename);
  return ext === ".pdf" || ext === ".docx";
}

function inferExtensionFromContentType(contentType: string | null): ".pdf" | ".docx" | null {
  const value = (contentType ?? "").toLowerCase();
  if (value.includes("application/pdf")) return ".pdf";
  if (value.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) return ".docx";
  return null;
}

function sanitizeFilename(raw: string): string {
  const trimmed = raw.trim().replace(/[/?<>\\:*|"']/g, "_");
  return trimmed.length > 0 ? trimmed : "linked-file";
}

function filenameFromUrl(url: URL): string | null {
  const last = url.pathname.split("/").pop();
  if (!last) return null;
  const decoded = decodeURIComponent(last).trim();
  if (!decoded) return null;
  return sanitizeFilename(decoded);
}

function isCanvasFileUrl(url: URL, canvasBaseUrl: string): boolean {
  const canvasOrigin = new URL(canvasBaseUrl).origin;
  if (url.origin !== canvasOrigin) return false;
  return (
    url.pathname.includes("/files/") ||
    url.pathname.includes("/download") ||
    url.searchParams.has("verifier")
  );
}

function isDirectSupportedFileUrl(url: URL): boolean {
  const path = url.pathname.toLowerCase();
  return path.endsWith(".pdf") || path.endsWith(".docx");
}

function looksLikePdf(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "%PDF";
}

function looksLikeDocx(buffer: Buffer): boolean {
  // DOCX is a ZIP package and starts with PK magic bytes.
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function extensionFromFilename(filename: string): ".pdf" | ".docx" | null {
  const ext = getExtension(filename);
  if (ext === ".pdf") return ".pdf";
  if (ext === ".docx") return ".docx";
  return null;
}

function extractCanvasFileIdFromUrl(url: URL): string | null {
  // Supports paths like:
  // - /files/:id
  // - /courses/:course_id/files/:id
  const m = url.pathname.match(/\/files\/(\d+)(?:\/|$)/);
  return m?.[1] ?? null;
}

async function resolveCanvasDownloadUrl(
  canvasOrigin: string,
  apiKey: string,
  url: URL
): Promise<{ downloadUrl: URL; displayName: string | null }> {
  const fileId = extractCanvasFileIdFromUrl(url);
  if (!fileId) return { downloadUrl: url, displayName: null };

  const metaRes = await fetch(`${canvasOrigin}/api/v1/files/${fileId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!metaRes.ok) return { downloadUrl: url, displayName: null };

  const meta = await metaRes.json() as { url?: string; display_name?: string };
  if (!meta.url) return { downloadUrl: url, displayName: meta.display_name ?? null };
  try {
    return { downloadUrl: new URL(meta.url), displayName: meta.display_name ?? null };
  } catch {
    return { downloadUrl: url, displayName: meta.display_name ?? null };
  }
}

async function downloadAndParseLinkedFile(
  baseUrl: string,
  url: URL,
  apiKey: string,
  preferredName: string | null,
  useCanvasAuth: boolean
): Promise<FileContent | null> {
  const canvasOrigin = new URL(baseUrl).origin;
  let requestUrl = url;
  let resolvedName = preferredName;
  if (useCanvasAuth) {
    const resolved = await resolveCanvasDownloadUrl(canvasOrigin, apiKey, url);
    requestUrl = resolved.downloadUrl;
    if (resolved.displayName) resolvedName = resolved.displayName;
  }

  const headers: Record<string, string> = {};
  if (useCanvasAuth && requestUrl.origin === canvasOrigin) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  const res = await fetch(requestUrl.toString(), { headers, redirect: "follow" });
  if (!res.ok) return null;

  const len = Number(res.headers.get("content-length") ?? "0");
  if (Number.isFinite(len) && len > MAX_FILE_SIZE_BYTES) return null;

  const contentType = res.headers.get("content-type");
  const inferredExt = inferExtensionFromContentType(contentType);
  const fallbackName = resolvedName ?? filenameFromUrl(requestUrl) ?? "linked-file";
  let filename = sanitizeFilename(fallbackName);
  if (!isSupportedFilename(filename)) {
    if (inferredExt) filename = `${filename}${inferredExt}`;
    else return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_FILE_SIZE_BYTES) return null;

  // Guard parser boundary: skip mislabeled files (common with HTML login pages).
  const ext = extensionFromFilename(filename);
  if (ext === ".pdf" && !looksLikePdf(buffer)) return null;
  if (ext === ".docx" && !looksLikeDocx(buffer)) return null;

  return parseFileViaAgents(buffer, filename);
}

export async function fetchAssignmentLinkedFileContents(
  baseUrl: string,
  apiKey: string,
  assignmentDescriptionHtml: string
): Promise<{ names: string[]; contents: FileContent[] }> {
  const names: string[] = [];
  const contents: FileContent[] = [];
  if (!assignmentDescriptionHtml?.trim()) return { names, contents };

  const seenUrls = new Set<string>();
  const $ = load(assignmentDescriptionHtml);
  const links: Array<{ url: URL; name: string | null; useCanvasAuth: boolean }> = [];

  $("a[href]").each((_, anchor) => {
    if (links.length >= 12) return;
    const href = $(anchor).attr("href");
    if (!href) return;

    let resolved: URL;
    try {
      resolved = new URL(href, baseUrl);
    } catch {
      return;
    }

    resolved.hash = "";
    const key = resolved.toString();
    if (seenUrls.has(key)) return;

    const canvasLink = isCanvasFileUrl(resolved, baseUrl);
    const directLink = isDirectSupportedFileUrl(resolved);
    if (!canvasLink && !directLink) return;

    seenUrls.add(key);
    const rawText = $(anchor).text().trim();
    const name = rawText.length > 0 ? rawText : filenameFromUrl(resolved);
    links.push({ url: resolved, name, useCanvasAuth: canvasLink });
  });

  // Download and parse all candidate links concurrently (capped at MAX_LINKED_FILES)
  const candidates = links.slice(0, MAX_LINKED_FILES);
  const results = await Promise.allSettled(
    candidates.map((link) =>
      downloadAndParseLinkedFile(baseUrl, link.url, apiKey, link.name, link.useCanvasAuth)
    )
  );
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      contents.push(r.value);
      names.push(r.value.name);
    }
  }

  return { names, contents };
}
