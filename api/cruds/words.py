from sqlalchemy import text
from sqlalchemy.orm import Session

def save_words(
    db: Session,
    index: dict,
    user_id: int,
):
    sql = text(
        """
        INSERT INTO words (userid, enmean, jpmean)
        VALUES (:userid, :enmean, :jpmean)
        """
    )
    params = {
        "userid": user_id,
        "enmean": index.get('enword'),
        "jpmean": index.get('jpword')
    }

    print(f"SQL: {sql}\nParams: {params}")
    res = db.execute(sql, params)
    db.commit()
    new_word_id = res.lastrowid  # 正しく res を使う
    new_word = get_mywords(db, word_id=new_word_id)
    print(f"DB操作の結果: {new_word}")

    return new_word


def get_mywords(
    db: Session,
    word_id: int,
):
    sql = text(
        """
        SELECT * FROM words
        WHERE id = :id
        """
    )
    params = {"id": word_id}

    print(f"SQL: {sql}\nParams: {params}")
    result = db.execute(sql, params).first()
    if result is not None:
        result = result._asdict()  # SQLAlchemy Rowを辞書に変換
    print(f"DB操作の結果: {result}")

    return result

def get_all_mywords(
    db: Session,
    user_id: int,
):
    sql = text(
        """
        SELECT * FROM words
        WHERE userid = :userid
        ORDER BY id DESC
        """
    )
    params = {"userid": user_id}
    result = db.execute(sql, params).fetchall()
    return [row._asdict() for row in result]

