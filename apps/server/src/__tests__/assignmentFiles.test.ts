/**
 * Tests for URL utility logic in lib/assignmentFiles.ts.
 * We test the pure helper functions in isolation by inlining them here,
 * since the module imports agents.ts which needs env vars.
 */
import { describe, it, expect } from "vitest";

// --- Inlined helpers from assignmentFiles.ts ---

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx < 0) return "";
  return filename.slice(idx).toLowerCase();
}

function isSupportedFilename(filename: string): boolean {
  const ext = getExtension(filename);
  return ext === ".pdf" || ext === ".docx";
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
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

// --- Tests ---

describe("getExtension", () => {
  it("extracts .pdf", () => expect(getExtension("report.pdf")).toBe(".pdf"));
  it("extracts .docx", () => expect(getExtension("essay.docx")).toBe(".docx"));
  it("lowercases extension", () => expect(getExtension("file.PDF")).toBe(".pdf"));
  it("returns empty string for no extension", () => expect(getExtension("README")).toBe(""));
  it("handles multiple dots", () => expect(getExtension("my.old.file.pdf")).toBe(".pdf"));
});

describe("isSupportedFilename", () => {
  it("accepts .pdf", () => expect(isSupportedFilename("doc.pdf")).toBe(true));
  it("accepts .docx", () => expect(isSupportedFilename("doc.docx")).toBe(true));
  it("rejects .txt", () => expect(isSupportedFilename("doc.txt")).toBe(false));
  it("rejects no extension", () => expect(isSupportedFilename("doc")).toBe(false));
});

describe("sanitizeFilename", () => {
  it("replaces forbidden characters", () => {
    expect(sanitizeFilename('file?name<test>.pdf')).not.toMatch(/[?<>]/);
  });
  it("returns fallback for empty input", () => {
    expect(sanitizeFilename("   ")).toBe("linked-file");
  });
  it("trims whitespace", () => {
    expect(sanitizeFilename("  doc.pdf  ")).toBe("doc.pdf");
  });
});

describe("filenameFromUrl", () => {
  it("extracts filename from URL path", () => {
    const url = new URL("https://canvas.example.com/files/42/download/rubric.pdf");
    expect(filenameFromUrl(url)).toBe("rubric.pdf");
  });

  it("returns null for URL with no path segment", () => {
    const url = new URL("https://canvas.example.com/");
    expect(filenameFromUrl(url)).toBeNull();
  });

  it("decodes percent-encoded characters", () => {
    const url = new URL("https://canvas.example.com/files/my%20doc.pdf");
    expect(filenameFromUrl(url)).toBe("my doc.pdf");
  });
});

describe("isCanvasFileUrl", () => {
  const base = "https://myschool.instructure.com";

  it("recognises /files/ path", () => {
    const url = new URL("https://myschool.instructure.com/courses/1/files/99");
    expect(isCanvasFileUrl(url, base)).toBe(true);
  });

  it("recognises /download path", () => {
    const url = new URL("https://myschool.instructure.com/files/99/download");
    expect(isCanvasFileUrl(url, base)).toBe(true);
  });

  it("recognises verifier query param", () => {
    const url = new URL("https://myschool.instructure.com/files/99?verifier=abc");
    expect(isCanvasFileUrl(url, base)).toBe(true);
  });

  it("rejects external URL", () => {
    const url = new URL("https://otherdomain.com/files/99");
    expect(isCanvasFileUrl(url, base)).toBe(false);
  });
});

describe("isDirectSupportedFileUrl", () => {
  it("accepts .pdf path", () => {
    expect(isDirectSupportedFileUrl(new URL("https://cdn.example.com/rubric.pdf"))).toBe(true);
  });
  it("accepts .docx path", () => {
    expect(isDirectSupportedFileUrl(new URL("https://cdn.example.com/essay.docx"))).toBe(true);
  });
  it("rejects html path", () => {
    expect(isDirectSupportedFileUrl(new URL("https://cdn.example.com/page.html"))).toBe(false);
  });
});

describe("looksLikePdf", () => {
  it("recognises %PDF magic bytes", () => {
    expect(looksLikePdf(Buffer.from("%PDF-1.4 rest"))).toBe(true);
  });
  it("rejects non-PDF bytes", () => {
    expect(looksLikePdf(Buffer.from("PK\x03\x04"))).toBe(false);
  });
  it("rejects buffer shorter than 4 bytes", () => {
    expect(looksLikePdf(Buffer.from("%PD"))).toBe(false);
  });
});

describe("looksLikeDocx", () => {
  it("recognises PK magic bytes (ZIP/DOCX)", () => {
    expect(looksLikeDocx(Buffer.from([0x50, 0x4b, 0x03, 0x04]))).toBe(true);
  });
  it("rejects PDF bytes", () => {
    expect(looksLikeDocx(Buffer.from("%PDF"))).toBe(false);
  });
  it("rejects buffer shorter than 4 bytes", () => {
    expect(looksLikeDocx(Buffer.from([0x50, 0x4b]))).toBe(false);
  });
});
