"""Tests for lib/file_parser.py — no external services required."""
import io
import struct

import pytest

from lib.file_parser import parse_file


# ---------------------------------------------------------------------------
# Minimal valid PDF bytes (single empty page, enough to satisfy PyMuPDF)
# ---------------------------------------------------------------------------

_MINIMAL_PDF = (
    b"%PDF-1.4\n"
    b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
    b"3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R>>endobj\n"
    b"xref\n0 4\n"
    b"0000000000 65535 f \n"
    b"0000000009 00000 n \n"
    b"0000000058 00000 n \n"
    b"0000000115 00000 n \n"
    b"trailer<</Size 4/Root 1 0 R>>\n"
    b"startxref\n190\n%%EOF\n"
)


# ---------------------------------------------------------------------------
# parse_file — dispatch
# ---------------------------------------------------------------------------

def test_parse_file_unsupported_extension_returns_none():
    assert parse_file(b"some bytes", "document.txt") is None


def test_parse_file_unknown_extension_returns_none():
    assert parse_file(b"", "noextension") is None


def test_parse_file_pdf_mislabeled_docx_returns_none():
    """A file named .docx that is actually a PDF should return None."""
    result = parse_file(_MINIMAL_PDF, "file.docx")
    assert result is None


def test_parse_file_empty_pdf_returns_string():
    """Minimal PDF without text content should return an empty string (not None)."""
    result = parse_file(_MINIMAL_PDF, "empty.pdf")
    assert result is not None
    assert isinstance(result, str)


def test_parse_file_corrupted_pdf_returns_none():
    """Corrupted PDF bytes should not raise — returns None."""
    result = parse_file(b"%PDF-1.4 corrupted garbage", "bad.pdf")
    assert result is None


def test_parse_file_corrupted_docx_returns_none():
    """Corrupted DOCX (zip) bytes should not raise — returns None."""
    # PK magic (ZIP header) but not a valid DOCX
    result = parse_file(b"PK\x03\x04garbage", "bad.docx")
    assert result is None
