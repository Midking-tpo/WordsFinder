## 改修記録（2026年6月）

学校で途中まで作成したこのプロジェクトを、就活ポートフォリオとして整備するために改修しました。

### データベーステーブルの不足を修正
- `/words` への保存・取得が500エラーで失敗
- サーバーログを確認すると `Table 'demo.words' doesn't exist` というエラー
  - `init.sql` には `users`・`tasks`・`dones` テーブルしか定義されておらず、`words` テーブルの定義が漏れていた（開発途中で「Todoアプリ」から「単語学習アプリ」への方針転換の影響と思われる）
  - `api/cruds/words.py` で使われているカラム（`id`, `userid`, `enmean`, `jpmean`）を確認し、`init.sql` に `CREATE TABLE words` を追記して解決
  - 既存のDBボリュームには反映されないため、`docker-compose down -v` でボリュームを削除してから再構築する必要があった

### 環境の再構築
- Docker Desktop未インストールのMacに新規導入
- `Dockerfile.api` のベースイメージが `python:3.11-slim-buster` のままだった
  - Debian "buster" はサポート終了（EOL）しており、パッケージ取得元のサーバーが閉鎖済みで `apt-get` が404エラーで失敗
  - `python:3.11-slim-bookworm`（サポート中のバージョン）に変更して解決

### 静的ファイルエラーの修正
- `api/main.py` で `StaticFiles(directory="static")` としていたため、Docker実行時の作業ディレクトリ（`/src`）から見て `static` フォルダが見つからずエラー
  - `directory="api/static"` に修正し、正しい相対パスを指定

### DeepL翻訳機能の修正
- 翻訳リクエストが403エラーで失敗
  - 当初はAPIキーの期限切れを疑い、新しいキーを発行
  - それでも解決せず、`curl` で直接APIを叩いて検証した結果、**DeepLの認証方式自体が変更されていた**ことが判明
  - 旧方式：リクエストボディに `auth_key` を含める
  - 新方式：リクエストヘッダーに `Authorization: DeepL-Auth-Key <key>` を含める
  - `api/routers/translate.py` を新方式に対応させて解決

### 学んだこと
- 数年前に作られたDocker環境は、ベースイメージのサポート終了や外部APIの仕様変更により、当時のままでは動かなくなることがある
- エラーメッセージを鵜呑みにせず、`curl` などでAPIに直接アクセスして検証することで、問題を切り分けられる
- CORSエラーとして表示されていても、実際の原因はサーバー側の別のエラー（500エラーなど）であることがある

### 既知の残課題
- `/words`（単語保存機能）でログイン認証に関連するエラーが残っている（次回対応予定）