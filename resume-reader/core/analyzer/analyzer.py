import re
from typing import Dict, List, Optional

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PHONE_REGEX = re.compile(r"\+?\d[\d \-\(\)]{7,}\d")
URL_REGEX = re.compile(r"https?://\S+")

SECTION_HEADERS: Dict[str, List[str]] = {
    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "employment history",
    ],
    "education": ["education", "academic background", "academics"],
    "skills": ["skills", "technical skills", "core skills"],
    "projects": ["projects", "project experience"],
    "certifications": ["certifications", "licenses", "certificates"],
    "achievements": ["achievements", "awards", "honors"],
    "summary": ["summary", "professional summary", "profile"],
}

COMMON_SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "angular",
    "node.js",
    "c++",
    "c#",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "linux",
    "html",
    "css",
    "sass",
    "django",
    "flask",
    "fastapi",
    "spring",
    "hibernate",
    "go",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "machine learning",
    "data analysis",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "jira",
    "agile",
    "scrum",
}


def _normalize_line(line: str) -> str:
    return line.strip()


def _lower_compact(line: str) -> str:
    return re.sub(r"\s+", " ", line.lower()).strip()


def extract_contacts(text: str) -> Dict[str, List[str]]:
    emails = sorted({match.group(0) for match in EMAIL_REGEX.finditer(text)})
    phones = sorted({re.sub(r"\s+", " ", match.group(0)).strip() for match in PHONE_REGEX.finditer(text)})
    urls = sorted({match.group(0).rstrip(".,") for match in URL_REGEX.finditer(text)})
    return {"emails": emails, "phones": phones, "urls": urls}


def detect_sections(lines: List[str]) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {key: [] for key in SECTION_HEADERS}
    current_key: Optional[str] = None

    for raw_line in lines:
        line = _normalize_line(raw_line)
        if not line:
            continue
        normalized = _lower_compact(line)
        matched_section = None
        for key, headers in SECTION_HEADERS.items():
            if any(normalized.startswith(header) for header in headers):
                matched_section = key
                break

        if matched_section:
            current_key = matched_section
            continue

        if current_key:
            sections[current_key].append(line)

    return {key: value for key, value in sections.items() if value}


def detect_skills(text: str, section_map: Dict[str, List[str]]) -> List[str]:
    tokens = text.lower()
    found = {skill for skill in COMMON_SKILLS if skill in tokens}
    skill_section = section_map.get("skills", [])
    for entry in skill_section:
        normalized = entry.lower()
        for skill in COMMON_SKILLS:
            if skill in normalized:
                found.add(skill)
    return sorted(found)


def infer_probable_name(lines: List[str], emails: List[str]) -> Optional[str]:
    if not lines:
        return None

    scope = lines[:10]
    first_candidates = [line for line in scope if line and len(line.split()) <= 6]
    email_usernames = {email.split("@")[0] for email in emails}

    for candidate in first_candidates[:3]:
        compact = candidate.replace(" ", "").lower()
        if compact and not any(compact in username for username in email_usernames if len(username) > 3):
            return candidate

    return first_candidates[0] if first_candidates else None


def summarize(lines: List[str], limit: int = 5) -> List[str]:
    summary = []
    for line in lines:
        stripped = _normalize_line(line)
        if stripped:
            summary.append(stripped)
        if len(summary) >= limit:
            break
    return summary
