from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.db import get_db
from api.extra_modules.auth.core import get_current_user
# from api.models.user import User
import api.cruds.words as words_crud

router = APIRouter()

class WordInput(BaseModel):
    enword: str
    jpword: str

@router.post("/words")
def save_words(
    words_body=Body(),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    print("もう大丈夫！！/words にPOSTリクエストが来た！")
    print("受けたデータ\n", words_body, current_user)

    res = words_crud.save_words(
        db, 
        index=words_body, 
        user_id=current_user.get('id')
        #JSONが、pythonだと辞書になるので、データの引っ張り方が変化した
    )

    print("返すデータ\n", res)
    return res

@router.get("/words")
def list_words(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return words_crud.get_all_mywords(db, current_user.get("id"))