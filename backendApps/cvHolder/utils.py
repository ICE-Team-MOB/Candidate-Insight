# backendApps/cvHolder/utils.py
import io
import json
from typing import Dict, Any

import requests
from requests.exceptions import ReadTimeout, ConnectionError
from PyPDF2 import PdfReader


def extract_text_from_pdf(file_obj) -> str:
    pdf_bytes = file_obj.read()
    pdf_stream = io.BytesIO(pdf_bytes)

    reader = PdfReader(pdf_stream)
    pages_text: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text)

    return "\n\n".join(pages_text).strip()


class LlamaError(Exception):
    """Своя ошибка для проблем з LLaMA / Ollama."""


def call_llama_for_cv(pdf_text: str) -> Dict[str, Any]:
    # ❗ Ограничиваем размер промпта (например, 8000 символов)
    MAX_CHARS = 8000
    if len(pdf_text) > MAX_CHARS:
        pdf_text = pdf_text[:MAX_CHARS]

    prompt = f"""
Ти — HR-асистент. Ти отримуєш повний текст резюме українською або російською мовою.

Твоє завдання — проаналізувати текст і повернути СТРОГО валідний JSON (без пояснень, без коментарів, без форматування Markdown).

Потрібні поля:
- first_name — ім'я кандидата (рядок, без по-батькові).
- last_name — прізвище кандидата.
- education — один з варіантів:
  "primary_education" | "basic_secondary_education" | "complete_secondary_education" |
  "vocational_education" | "junior_bachelor" | "bachelor" | "master" | "phd" | "doctor_of_science".
- sector — одна з категорій:
  "it" | "finance" | "hr" | "marketing" | "sales" | "engineering" | "education" | "healthcare" | "other".
- experience — одна з категорій:
  "no_experience" | "0_1" | "1_3" | "3_5" | "5_plus".
- work_format — одна з категорій:
  "office" | "remote" | "hybrid".

Текст резюме:
\"\"\"{pdf_text}\"\"\"


Поверни ТІЛЬКИ JSON в одному рядку, наприклад:
{{"first_name": "Андрій", "last_name": "Спесівцев", "education": "master", "sector": "it", "experience": "1_3", "work_format": "remote"}}
"""

    try:
        resp = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "llama3.1",
                "prompt": prompt,
                "stream": False,
                # ❗ просим модель мало писать
                "options": {
                    "num_predict": 256,   # максимум токенов в ответе
                    "temperature": 0.2,
                },
            },
            # ❗ увеличиваем таймаут на чтение ответа
            timeout=240,  # секунд
        )
    except ReadTimeout as e:
        raise LlamaError("LLaMA не відповіла вчасно (ReadTimeout).") from e
    except ConnectionError as e:
        raise LlamaError("Немає з'єднання з Ollama (ConnectionError).") from e

    if resp.status_code != 200:
        raise LlamaError(f"LLaMA повернула статус {resp.status_code}: {resp.text[:200]}")

    data = resp.json()
    raw_text = data.get("response", "").strip()

    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start != -1 and end != -1 and end > start:
        raw_json = raw_text[start : end + 1]
    else:
        raw_json = raw_text

    try:
        parsed = json.loads(raw_json)
    except json.JSONDecodeError as e:
        raise LlamaError(f"Не вдалося розпарсити JSON з відповіді LLaMA: {raw_json[:200]}") from e

    return parsed
