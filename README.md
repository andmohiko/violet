<!-- @format -->

# Firebase Monorepo

この README では、開発環境手順等にのみ言及します.

## パッケージ構成

本プロジェクトでは [Turborepo](https://turbo.build/repo/docs) によるマルチレポ構成を採用しています.

| type | name                                              | description 　　　　　　 | default port |
| ---- | ------------------------------------------------- | ------------------------ | ------------ |
| app  | [@firebase-monorepo/console](./apps/console/)     | 管理画面                 | ---          |
| app  | [@firebase-monorepo/web](./apps/web/)             | Web アプリ本体           | ---          |
| app  | [@firebase-monorepo/functions](./apps/functions/) | Cloud Functions          | ---          |
| pkg  | [@firebase-monorepo/common](./packages/common/)   | 共通で使用する型定義など | ---          |

## 環境構築

### 事前準備

##### 1. 指定バージョンの node をセットする

プロジェクトの node のバージョンを [こちら](./.node-version) に記載されるバージョンに固定します.

nodenv などのお好みのバージョン管理ツールで指定してくだい.

##### 2. pnpm をインストールする

```sh
$ npm i -g pnpm@10.12.2

$ pnpm -v
10.12.2 # ここが 10.12.2 であればOK
```

##### 3. 環境変数、firebase環境を準備する

1. - firebaseでプロジェクトを作成し、アプリを追加→ウェブを選択。アプリ名を登録した後に、表示されるFirebaseSDKの追加の、 firebaseConfig={}内に書かれてあるapiKey,authDomain,projectId,StorageBucket,messagingSenderId, appId,measurementIdを取得します。FirebaseプロジェクトをBlazeプランに変更します

2. apps/webに.env.localを作成し、先ほど取得したapiKey等を

- NEXT_PUBLIC_FIREBASE_API_KEY= apiKey
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= authDomain
- NEXT_PUBLIC_FIREBASE_PROJECT_ID= projectId
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= StorageBucket
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= messagingSenderId
- NEXT_PUBLIC_FIREBASE_APP_ID= appId
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID= measurementId
  として設定します

3. googleAIStudioからgeminiAPIのapikeyを取得、送信したいslackのchat部屋のwebhook URLを取得します

4. プロジェクト画面の構築からのAuthenticationを選択し、ログイン方法をメール/パスワードで選択します。その後の画面でメール/パスワードを有効にして保存します

5. プロジェクト画面の構築からfirestoreを選択し,データベースの作成を行います。データベースIDは(default)で、ロケーションはasia-northeast1 (Tokyo)を選択してください。本番モードで開始するを選択して開始してください

6. プロジェクト画面の構築からStorageを選択し、使ってみるを選択してください。料金浮揚のロケーションを選択し、場所はUS-CENTRAL1を選んで下さい。本番環境モードで開始するを選択し、作成してください。

7. プロジェクト画面の構築からFunctionsを選択し、始めるを選択します。表示される内容を読み飛ばして終了を選択して下さい。その後、画面に最初のデプロイを待機していますという表示が出たことを確認してください

8. apps/functionsに.envを作成し、
   - DEV_GEMINI_API_KEY= google AI STUDIOで取得したgeminiAPIのAPIキー
   - STORAGE_BUCKET= firebaseで作成した内のstorage_bucketの値
   - SLACK_WEBHOOK_URL= slackで取得したwebhookのurl
     として設定します

### ローカルサーバーの立ち上げ

すべてのパッケージの依存関係をインストールします.

```sh
$ pnpm install
```

すべてのアプリケーションでローカルサーバーを起動します.

```sh
$ pnpm dev
```

## その他の CLI

- web側のデプロイ手順

- functions側のデプロイ手順
  1. ターミナル上のルートディレクトリでpnpm install -g firebase-toolsを行います
  2. firebase loginを実行し、firebaseを認証します
  3. .firebasercのprojects内のdefaultに、自分のfirebase projectIdを記載します
  4. firebase use defaultを実行します
  5. firebase deployを行います。デプロイ中に
     Cloud Storage for Firebase needs an IAM Role to use cross-service rules. Grant the new role?
     と表示されたらyを押して続けます
     権限の伝播の遅れが原因で以下のエラーが表示されることがあります
     had HTTP Error: 400, Validation failed for trigger projects/test-f01cc/locations/us-central1/triggers/onaudioupload-983708: Invalid resource state for "": Permission denied while using the Eventarc Service Agent. If you recently started to use Eventarc, it may take a few minutes before all necessary permissions are propagated to the Service Agent. Otherwise, verify that it has Eventarc Service Agent role.
     このように表示された際は、少し時間をおいてもう一度
     firebase deploy --only functions
     を実行してください
