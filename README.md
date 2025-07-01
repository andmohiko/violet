# Firebase Monorepo

この README では、開発環境手順等にのみ言及します。

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
