from fastapi import APIRouter, Request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")  # .envファイルの中身をちゃんと読みやすく
DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

@router.post("/translate")
async def translate(request: Request):
    data = await request.json()
    text = data.get("text")
    if not text:
        return {"error": "Missing 'text' in request"}

    text_to_translate = data["text"]

    try:
        response = requests.post(
            DEEPL_API_URL,
            data={
                "auth_key": DEEPL_API_KEY,
                "text": text_to_translate,
                "target_lang": "JA"
            }
        )
        response.raise_for_status()
        result = response.json()
        translated_text = result["translations"][0]["text"]
        return {"translation": translated_text}

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
