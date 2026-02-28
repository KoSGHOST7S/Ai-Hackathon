import io

import fitz  # pymupdf
from docx import Document


def parse_pdf(content: bytes) -> str:
    doc = fitz.open(stream=content, filetype="pdf")
    pages = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            pages.append(text.strip())
    doc.close()
    return "\n\n".join(pages)


def parse_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())


def parse_file(content: bytes, filename: str) -> str | None:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return parse_pdf(content)
    elif lower.endswith(".docx"):
        return parse_docx(content)
    return None
