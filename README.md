# nhk-connect-deno

## 概要

お気に入りのNHKの番組情報を通知する

## 機能

通知機能と通知設定変更機能の2つがある

### 通知機能

- 日次で通知
- 週次で通知

通知先：Discord or LINE

### 通知設定変更機能

下記の設定を変更できる

- 通知対象の番組を設定
- APIキーと放送地域を設定
- 番組の通知先を設定

設定を変更するには、提供するWeb APIサーバへPOSTすること

APIの仕様はOpen API Documentで提供する。
閲覧するには、アプリケーション起動後、ルート直下にブラウザでアクセスすること

## システム構成

### インフラ

[Deno Deploy](https://deno.com/deploy)

### NHK番組情報の取得

[NHK番組表API](https://api-portal.nhk.or.jp/)

## 使い方

[nhk-connect-deno](https://scrapbox.io/lsadsfj/nhk-connect-deno)
