const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // .env 読み込み

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "テキストが指定されていません。" });
  }

  try {
    const result = await axios.post("https://api-free.deepl.com/v2/translate", null, {
      params: {
        auth_key: DEEPL_API_KEY,
        text: text,
        target_lang: "JA"
      }
    });

    res.json(result.data);
  } catch (err) {
    console.error("翻訳エラー:", err.response?.data || err.message);
    res.status(500).json({ error: "翻訳に失敗しました。" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DeepL Proxy Server running at http://localhost:${PORT}`);
});
