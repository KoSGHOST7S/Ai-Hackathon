import { describe, it, expect } from "vitest";
import { stripHtml } from "../lib/html";

describe("stripHtml", () => {
  it("removes simple tags", () => {
    expect(stripHtml("<p>Hello world</p>")).toBe("Hello world");
  });

  it("removes nested tags", () => {
    expect(stripHtml("<div><b>bold</b> and <i>italic</i></div>")).toBe("bold and italic");
  });

  it("decodes &amp;", () => {
    expect(stripHtml("Fish &amp; Chips")).toBe("Fish & Chips");
  });

  it("decodes &nbsp; to a space then collapses", () => {
    expect(stripHtml("one&nbsp;two")).toBe("one two");
  });

  it("decodes &lt; and &gt;", () => {
    expect(stripHtml("&lt;foo&gt;")).toBe("<foo>");
  });

  it("decodes &quot;", () => {
    expect(stripHtml("She said &quot;hello&quot;")).toBe(`She said "hello"`);
  });

  it("decodes &#39; (apostrophe)", () => {
    expect(stripHtml("it&#39;s")).toBe("it's");
  });

  it("decodes decimal numeric entities", () => {
    // &#65; = 'A'
    expect(stripHtml("&#65;")).toBe("A");
  });

  it("decodes hex numeric entities", () => {
    // &#x41; = 'A'
    expect(stripHtml("&#x41;")).toBe("A");
  });

  it("collapses whitespace", () => {
    expect(stripHtml("  hello   world  ")).toBe("hello world");
  });

  it("trims leading and trailing whitespace", () => {
    expect(stripHtml("  <p> text </p>  ")).toBe("text");
  });

  it("returns empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
  });

  it("handles input with no HTML unchanged", () => {
    expect(stripHtml("plain text")).toBe("plain text");
  });

  it("handles self-closing tags", () => {
    expect(stripHtml("line1<br/>line2")).toBe("line1 line2");
  });

  it("handles a realistic Canvas description", () => {
    const html = `<p>Write a 5-page essay on <strong>climate change</strong>.</p>
<ul><li>Include at least 3 sources</li><li>APA format</li></ul>`;
    const result = stripHtml(html);
    // Tags are replaced with spaces, so punctuation may be separated; check key phrases
    expect(result).toContain("climate change");
    expect(result).toContain("Include at least 3 sources");
    expect(result).toContain("APA format");
    expect(result).not.toContain("<");
  });
});
