

async function searchMeaning() {
  const word = document.getElementById('wordInput').value.trim();
  const enword = document.getElementById('enword');
  const jpword = document.getElementById('jpword');

  enword.textContent = word || "（未入力）";
  jpword.style.opacity = 0;
  jpword.textContent = "翻訳中…";

  if (!word) return;
  console.log(word)

  try {
    // 入力した単語や文章をそのままDeepLに渡す
    const translationRes = await fetch("http://localhost:8000/translate", {
      method: "POST",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({text: word})
    });

    if (!translationRes.ok) {
      throw new Error(`API error: ${translationRes.status}`);
    }

    const translationData = await translationRes.json();
    console.log(translationData)

    // console.log(jpword, enword)
    // const save = {enword:enword, jpword:jpword}
    // console.log(save)


    // return translationRes = await fetch("http://localhost:8000/words", {
    //   method: "POST",
    //   headers: {
    //   "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(save)
    // });

    // APIのレスポンスが { translation: "..." } であることを前提
    const japaneseMeaning = translationData.translation;

    jpword.textContent = japaneseMeaning;
    // jpword.style.opacity = 1;

  } catch (error) {
    jpword.textContent = '翻訳に失敗しました。';
    jpword.style.opacity = 1;
    console.error("翻訳エラー:", error);
  }
  save()

  // const translationData = await translationRes.json();
  // console.log(translationData)

  // console.log(jpword, enword)
  // const save = {enword:enword, jpword:jpword}
  // console.log(save)


  // return translationRes = await fetch("http://localhost:8000/words", {
  //   method: "POST",
  //   headers: {
  //   "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(save)
  // });
}

const save = () => {
  console.log("kokodayo: " + jpword.textContent, enword.textContent)
  const save = {"enword":enword.textContent, "jpword":jpword.textContent}
  console.log(save)
  saveNewWords(save)
}

