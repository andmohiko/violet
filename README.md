## 概要

このアプリは、音声ファイルをアップロードすると自動で文字起こしを行い、結果をFirestoreに保存します。  
また、毎日自動で前日投稿されたデータの要約をSlackに通知する機能も備えています。

## パッケージ構成

本プロジェクトでは Turborepo によるマルチレポ構成を採用しています。

| Type | Name                         | Description              | Default Port |
| ---- | ---------------------------- | ------------------------ | ------------ |
| app  | @firebase-monorepo/console   | 管理画面                 | ---          |
| app  | @firebase-monorepo/web       | Web アプリ本体           | ---          |
| app  | @firebase-monorepo/functions | Cloud Functions          | ---          |
| pkg  | @firebase-monorepo/common    | 共通で使用する型定義など | ---          |

## 環境構築

### 事前準備

#### 1. 指定バージョンの node をセットする

プロジェクトの node のバージョンを [こちら](リンク先URL) に記載されるバージョンに固定します。  
nodenv などのお好みのバージョン管理ツールで指定してください。

#### 2. pnpm をインストールする

```sh
$ npm i -g pnpm@10.12.2
```

```sh
pnpm -v
```

```
10.12.2 # ここが 10.12.2 であればOK
```

#### 3. 環境変数、Firebase環境を準備する

##### 3-1. Firebase プロジェクトの作成

Firebase でプロジェクトを作成し、アプリを追加→ウェブを選択。アプリ名を登録した後に、表示される Firebase SDK の追加の、`firebaseConfig={}` 内に書かれてある以下の値を取得します：

- apiKey
- authDomain
- projectId
- StorageBucket
- messagingSenderId
- appId
- measurementId

Firebase プロジェクトを Blaze プランに変更します。

##### 3-2. Web アプリの環境変数設定

`apps/web` に `.env.local` を作成し、先ほど取得した値を以下のように設定します：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=StorageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=appId
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=measurementId
```

##### 3-3. 外部サービスの API キー取得

- Google AI Studio から Gemini API の API キーを取得
- 送信したい Slack のチャット部屋の webhook URL を取得

##### 3-4. Firebase Authentication の設定

1. プロジェクト画面の構築から Authentication を選択
2. ログイン方法を **メール/パスワード** で選択
3. その後の画面でメール/パスワードを有効にして保存

##### 3-5. Firestore の設定

1. プロジェクト画面の構築から Firestore を選択
2. データベースの作成を行う
   - データベース ID: `(default)`
   - ロケーション: `asia-northeast1 (Tokyo)`
   - **本番モードで開始する** を選択

##### 3-6. Storage の設定

1. プロジェクト画面の構築から Storage を選択
2. **使ってみる** を選択
3. 料金不要のロケーションを選択
   - 場所: `US-CENTRAL1`
   - **本番環境モードで開始する** を選択して作成

##### 3-7. Functions の設定

1. プロジェクト画面の構築から Functions を選択
2. **始める** を選択
3. 表示される内容を読み飛ばして **終了** を選択
4. 画面に「最初のデプロイを待機しています」という表示が出ることを確認

##### 3-8. Functions の環境変数設定

`apps/functions` に `.env` を作成し、以下のように設定します：

```env
DEV_GEMINI_API_KEY=google AI STUDIOで取得したgeminiAPIのAPIキー
STORAGE_BUCKET=firebaseで作成した、firebaseConfig={}内のstorage_bucketの値
SLACK_WEBHOOK_URL=slackで取得したwebhookのurl
```

### ローカルサーバーの立ち上げ

#### 依存関係のインストール

すべてのパッケージの依存関係をインストールします。

```sh
pnpm install
```

#### 開発サーバーの起動

すべてのアプリケーションでローカルサーバーを起動します。

```sh
pnpm dev
```

## 4. デプロイ手順

### 4-1. Web 側のデプロイ手順

### 4-2. Functions 側のデプロイ手順

#### 1. Firebase CLI のインストールと認証

ターミナル上のルートディレクトリで

```sh
firebase login
```

#### 2. プロジェクトの設定

`.firebaserc` の `projects` 内の `default` に、自分の Firebase project ID を記載、  
ルートディレクトリで、

```sh
firebase use default
```

#### 3. デプロイの実行

```sh
firebase deploy
```

デプロイ中に以下のメッセージが表示されたら `y` を押して続けます：

```
Cloud Storage for Firebase needs an IAM Role to use cross-service rules. Grant the new role?
```

#### ⚠️ エラーが発生した場合

権限の伝播の遅れが原因で以下のようなエラーが表示されることがあります：

```
HTTP Error: 400, Validation failed for trigger projects/test-f01cc/locations/us-central1/triggers/onaudioupload-983708: Invalid resource state for "": Permission denied while using the Eventarc Service Agent. If you recently started to use Eventarc, it may take a few minutes before all necessary permissions are propagated to the Service Agent. Otherwise, verify that it has Eventarc Service Agent role.
```

このエラーが表示された場合は、少し時間をおいてから以下のコマンドを再実行してください：

```sh
firebase deploy --only functions
```

## 技術スタック

- フロントエンド：Next.js（App Router）
- UIライブラリ：shadcn/ui
- 言語：TypeScript
- バックエンド：Cloud Functions for Firebase
- データベース：Firestore
- ストレージ：Cloud Storage for Firebase
- 認証:Firebase Authentication
- 外部API：geminiAPI
- 通知：Slack Webhook
- スケジューラ：Cloud Scheduler

## インフラ構成

本プロジェクトは以下のインフラサービス・構成で動作します。

### 1. Firebase プロジェクト

- **Authentication**  
  メール/パスワード認証を利用し、ユーザー管理を行います。

- **Firestore**  
  書き起こしデータ（transcriptsコレクション）などのデータを保存します。  
  [firestore-design.md](firestore-design.md) に設計詳細あり。

- **Cloud Storage**  
  音声ファイルをアップロード・保存します。  
  StorageへのアップロードをトリガーにCloud FunctionsのonAudioUploadが動作します。

- **Cloud Functions**
  - 音声ファイルアップロード時の自動書き起こし（onAudioUpload関数）
  - 毎日定時の要約・Slack通知（scheduledTask/dailySummary関数）

### 2. 外部サービス

- **Google Gemini API**  
  音声ファイルの書き起こし・要約に利用します。

- **Slack Webhook**  
  毎日の要約結果をSlackに通知します。

### 3. ディレクトリ構成

- `apps/web` ... Next.js製Webアプリ
- `apps/functions` ... Cloud Functions

## アプリが解決すること

音声メモや会話の内容は、録音だけでは後から確認や検索が難しいという課題があります。
また、記録を共有したい場合にも、音声のままだと扱いにくく、業務効率が下がる原因になります。

このアプリでは、音声データを自動で文字起こしし、見やすいテキストとして保存・管理できます。
さらに、内容を要約した上でSlackに自動通知する機能により、振り返りもスムーズに行えます。

## アプリが提供する機能

### 1. メールアドレス／パスワードによる認証機能

### 2. 録音ファイルアップロード

.wav.mp3などの音声ファイルを手動でアップロード可能
アップロードされたファイルは Firebase Storage に保存

### 3. 自動文字起こし（音声→テキスト）

アップロードされた音声を Gemini API を使って自動で文字起こし
結果はテキストとメタデータとして Firestore に保存

### 4. テキスト閲覧・検索機能

保存された文字起こしを一覧表示
フリーワード検索、日付検索で過去のメモ・会話内容を簡単に探せる

### 5. 自動要約 & Slack通知（毎日0時に実行）

前日にアップロードされたテキストをまとめて要約（Gemini APIを使用）
要約内容を Slackの指定チャンネル に自動投稿
